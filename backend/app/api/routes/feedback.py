import random
from typing import List
from datetime import datetime, timezone
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.models.feedback import OfficerFeedbackRecord
from app.models.investigation import InvestigationCase
from app.schemas.feedback import OfficerFeedbackCreate, OfficerFeedbackResponse, FeedbackStatisticsResponse
from app.services.audit_service import append_block

router = APIRouter(prefix="/feedback", tags=["Officer Feedback"])

@router.post("", response_model=OfficerFeedbackResponse, status_code=status.HTTP_201_CREATED)
def submit_feedback(
    feedback_in: OfficerFeedbackCreate,
    db: Session = Depends(get_db)
):
    feedback_id = f"FB-{random.randint(510, 799)}"
    now_iso = datetime.now(timezone.utc).isoformat()

    record = OfficerFeedbackRecord(
        id=feedback_id,
        case_id=feedback_in.case_id,
        officer_name=feedback_in.officer_name,
        badge_number=feedback_in.badge_number,
        outcome=feedback_in.outcome,
        prediction_accuracy=feedback_in.prediction_accuracy,
        risk_score_validated=feedback_in.risk_score_validated,
        comments=feedback_in.comments,
        additional_evidence=feedback_in.additional_evidence or "",
        timestamp=now_iso,
        used_in_model_training=False,
    )
    db.add(record)

    # Update corresponding investigation status if present
    inv = db.query(InvestigationCase).filter(InvestigationCase.id == feedback_in.case_id).first()
    if inv:
        if feedback_in.outcome in ("Arrest", "Cash Withdrawal Prevented"):
            inv.status = "Intervention Completed"
            if feedback_in.outcome == "Arrest":
                inv.seizure_status = "Cash Seized"
        elif feedback_in.outcome == "False Positive":
            inv.status = "Closed"

        inv_notes = list(inv.notes or [])
        now_time = datetime.now().strftime("%I:%M:%S %p")
        inv_notes.append(
            f"{now_time} - Field Officer Feedback submitted by {feedback_in.officer_name} "
            f"({feedback_in.badge_number}): Outcome = {feedback_in.outcome}."
        )
        inv.notes = inv_notes
        inv.updated_at = now_iso

    append_block(
        db=db,
        action="OFFICER_FEEDBACK_RECORDED",
        officer=feedback_in.officer_name,
        case_id=feedback_in.case_id,
        payload_summary=(
            f"Ground truth outcome: {feedback_in.outcome}. Accuracy rating: {feedback_in.prediction_accuracy}/5. "
            f"Training buffer queued for model retraining."
        )
    )

    db.commit()
    db.refresh(record)
    return record

@router.get("", response_model=List[OfficerFeedbackResponse])
def get_feedback_records(db: Session = Depends(get_db)):
    return db.query(OfficerFeedbackRecord).order_by(OfficerFeedbackRecord.timestamp.desc()).all()

@router.get("/statistics", response_model=FeedbackStatisticsResponse)
def get_feedback_statistics(db: Session = Depends(get_db)):
    records = db.query(OfficerFeedbackRecord).all()
    total = len(records)
    if total == 0:
        return FeedbackStatisticsResponse(
            total_feedback=0,
            average_accuracy=0.0,
            outcomes_breakdown={},
            used_in_training_count=0,
            validation_rate=0.0,
        )

    avg_acc = round(sum(r.prediction_accuracy for r in records) / total, 2)
    breakdown = {}
    for r in records:
        breakdown[r.outcome] = breakdown.get(r.outcome, 0) + 1

    used_count = sum(1 for r in records if r.used_in_model_training)
    validated_count = sum(1 for r in records if r.risk_score_validated)
    val_rate = round((validated_count / total) * 100, 1)

    return FeedbackStatisticsResponse(
        total_feedback=total,
        average_accuracy=avg_acc,
        outcomes_breakdown=breakdown,
        used_in_training_count=used_count,
        validation_rate=val_rate,
    )
