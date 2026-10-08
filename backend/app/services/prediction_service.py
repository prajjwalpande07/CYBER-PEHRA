import random
from datetime import datetime, timezone
from sqlalchemy.orm import Session
from app.models.complaint import Complaint
from app.models.location import WithdrawalLocation
from app.models.investigation import InvestigationCase
from app.models.model_meta import ModelMetrics
from app.ml.model_pipeline import ml_pipeline
from app.ml.explainability import compute_explainable_factors
from app.services.alert_service import create_alert
from app.services.audit_service import append_block

async def run_prediction_for_complaint(db: Session, complaint_id: str):
    complaint = db.query(Complaint).filter(Complaint.id == complaint_id).first()
    if not complaint:
        raise ValueError(f"Complaint '{complaint_id}' not found.")

    # 1. Candidate withdrawal location resolution
    candidate_location = (
        db.query(WithdrawalLocation)
        .filter(WithdrawalLocation.state == complaint.state)
        .order_by(WithdrawalLocation.risk_score.desc())
        .first()
    )
    if not candidate_location:
        candidate_location = db.query(WithdrawalLocation).first()

    if not candidate_location:
        raise ValueError("No withdrawal locations available in database.")

    # 2. Build feature vector
    # Estimate distance (approx Euclidean based on lat/lon or default 1.8km)
    lat_diff = abs(complaint.latitude - candidate_location.latitude)
    lon_diff = abs(complaint.longitude - candidate_location.longitude)
    distance_km = min(45.0, max(0.4, round((lat_diff**2 + lon_diff**2)**0.5 * 111, 1)))

    # Estimate minutes since transaction
    try:
        txn_dt = datetime.fromisoformat(complaint.transaction_time)
        hop_minutes = max(5, int((datetime.now(timezone.utc) - txn_dt.replace(tzinfo=timezone.utc)).total_seconds() / 60))
    except Exception:
        hop_minutes = random.randint(15, 75)

    features = {
        "transaction_amount": complaint.transaction_amount,
        "hop_minutes": hop_minutes,
        "distance_km": distance_km,
        "mule_layer": 1 if complaint.transaction_amount < 500000 else 2,
        "hour_of_day": datetime.now().hour,
        "account_risk": min(98.0, 65.0 + (complaint.transaction_amount / 100000)),
        "atm_past_hits": 5 if candidate_location.type == "ATM" else 2,
        "is_csp": 1 if candidate_location.type == "CSP/Kiosk" else 0,
    }

    # 3. Model Prediction
    risk_score, risk_level, confidence = ml_pipeline.predict(features)

    # 4. Explainable Factor Attribution
    factors = compute_explainable_factors(features, risk_score)

    # 5. Update Candidate Location
    candidate_location.risk_score = risk_score
    candidate_location.risk_level = risk_level
    candidate_location.amount_at_risk = candidate_location.amount_at_risk + complaint.transaction_amount
    candidate_location.confidence_score = confidence
    candidate_location.predicted_time_window = "Within next 45 – 90 mins"
    candidate_location.status = "Alert Sent"
    candidate_location.last_anomaly_detected = "Just now"

    linked_c = list(candidate_location.linked_complaint_ids or [])
    if complaint.id not in linked_c:
        linked_c.append(complaint.id)
    candidate_location.linked_complaint_ids = linked_c

    linked_m = list(candidate_location.linked_mule_accounts or [])
    if complaint.suspected_account not in linked_m:
        linked_m.append(complaint.suspected_account)
    candidate_location.linked_mule_accounts = linked_m

    candidate_location.reasons = factors

    # 6. Update Complaint
    complaint.status = "Predicted"
    complaint.risk_score = risk_score
    complaint.risk_level = risk_level
    complaint.predicted_location_id = candidate_location.id

    # 7. Check or create investigation case
    existing_inv = db.query(InvestigationCase).filter(InvestigationCase.complaint_id == complaint.id).first()
    if not existing_inv:
        now_iso = datetime.now(timezone.utc).isoformat()
        now_time = datetime.now().strftime("%I:%M:%S %p")
        inv_id = f"INV-{random.randint(7750, 7999)}"
        new_inv = InvestigationCase(
            id=inv_id,
            complaint_id=complaint.id,
            complaint_title=f"{complaint.complaint_type} - ₹{(complaint.transaction_amount / 100000):.1f}L",
            assigned_officer="Insp. V. K. Sharma (Cyber Cell)",
            police_station=f"{candidate_location.district} Cyber Police Station",
            location_name=candidate_location.name,
            location_id=candidate_location.id,
            risk_level=risk_level,
            suspected_account=complaint.suspected_account,
            suspected_mule_name="Mule Associate Under Geofencing",
            action_taken="Predictive alert issued. Coordinated with bank nodal officer.",
            account_freeze_status="Requested",
            seizure_status="Pending",
            amount_recovered=0.0,
            evidence_list=["complaint_payload_geohash.json", "atm_proximity_prediction.pdf"],
            notes=[
                f"{now_time} - Predictive AI triggered with {risk_score}/100 Risk Score.",
                f"Pinpointed extraction point: {candidate_location.name} ({candidate_location.address}).",
            ],
            status="Open",
            created_at=now_iso,
            updated_at=now_iso,
        )
        db.add(new_inv)

    # 8. Model metrics increment
    current_metrics = db.query(ModelMetrics).filter(ModelMetrics.is_current == True).first()
    if current_metrics:
        current_metrics.predictions_today += 1

    # 9. Audit trail append
    append_block(
        db=db,
        action="PREDICTION_ENGINE_RUN",
        officer=f"AI_INFERENCE_ENGINE_{ml_pipeline.current_version}",
        case_id=complaint.id,
        payload_summary=f"Predicted Cash Extraction at {candidate_location.name}. Risk Score: {risk_score}/100. Confidence: {confidence}%"
    )

    db.commit()
    db.refresh(candidate_location)
    db.refresh(complaint)

    # 10. Generate Real-time Alert if high/critical risk
    if risk_score >= 61:
        alert_title = f"{risk_level}: Predicted ATM Cash Extraction at {candidate_location.name}"
        alert_type = "Critical Risk Location" if risk_score >= 81 else "Imminent Withdrawal"
        await create_alert(
            db=db,
            title=alert_title,
            alert_type=alert_type,
            location_id=candidate_location.id,
            location_name=candidate_location.name,
            state=candidate_location.state,
            district=candidate_location.district,
            risk_score=risk_score,
            severity=risk_level,
            amount_at_risk=complaint.transaction_amount,
            recipient="Law Enforcement Agencies",
            channel="SMS + Dashboard",
        )

    explanation_text = (
        f"Algorithm identifies {candidate_location.name} in {candidate_location.district} "
        f"as probable cash withdrawal node with {confidence}% confidence based on "
        f"Layer-1 mule telemetry, velocity of ₹{complaint.transaction_amount:,.0f} debit, and {distance_km}km proximity."
    )

    return {
        "complaint_id": complaint.id,
        "risk_score": risk_score,
        "risk_level": risk_level,
        "confidence_score": confidence,
        "location": candidate_location,
        "predicted_time_window": candidate_location.predicted_time_window,
        "amount_at_risk": complaint.transaction_amount,
        "model_version": ml_pipeline.current_version,
        "factors": factors,
        "explanation": explanation_text,
    }
