import random
from datetime import datetime, timezone
from sqlalchemy.orm import Session
from app.models.alert import AlertNotification
from app.core.websocket_manager import manager
from app.services.audit_service import append_block

async def create_alert(
    db: Session,
    title: str,
    alert_type: str,
    location_id: str,
    location_name: str,
    state: str,
    district: str,
    risk_score: float,
    severity: str,
    amount_at_risk: float,
    recipient: str = "Law Enforcement Agencies",
    channel: str = "SMS + Dashboard",
) -> AlertNotification:
    alert_id = f"ALT-{random.randint(9060, 9999)}"
    now_iso = datetime.now(timezone.utc).isoformat()

    alert = AlertNotification(
        id=alert_id,
        title=title,
        type=alert_type,
        location_id=location_id,
        location_name=location_name,
        state=state,
        district=district,
        risk_score=risk_score,
        severity=severity,
        timestamp=now_iso,
        recipient=recipient,
        channel=channel,
        status="Delivered",
        amount_at_risk=amount_at_risk,
    )
    db.add(alert)
    db.commit()
    db.refresh(alert)

    # Push to connected WebSocket clients
    toast_type = "critical" if severity == "CRITICAL" else "warning" if severity == "HIGH" else "info"
    payload = {
        "event": "NEW_ALERT",
        "alert": {
            "id": alert.id,
            "title": alert.title,
            "type": alert.type,
            "locationId": alert.location_id,
            "locationName": alert.location_name,
            "state": alert.state,
            "district": alert.district,
            "riskScore": alert.risk_score,
            "severity": alert.severity,
            "timestamp": alert.timestamp,
            "recipient": alert.recipient,
            "channel": alert.channel,
            "status": alert.status,
            "amountAtRisk": alert.amount_at_risk,
        },
        "toast": {
            "title": alert.title,
            "message": f"Tactical Alert: Imminent cash-out extraction flagged at {alert.location_name} ({alert.district}). Amount: ₹{alert.amount_at_risk:,.0f}",
            "type": toast_type,
        }
    }
    await manager.broadcast(payload)

    return alert

def acknowledge_alert(db: Session, alert_id: str, officer: str = "OFFICER_LEA") -> AlertNotification:
    alert = db.query(AlertNotification).filter(AlertNotification.id == alert_id).first()
    if alert:
        alert.status = "Acknowledged"
        db.commit()
        db.refresh(alert)
        append_block(
            db=db,
            action="ALERT_ACKNOWLEDGED",
            officer=officer,
            case_id=alert_id,
            payload_summary=f"Stakeholder acknowledged high-priority intervention alert {alert_id} for {alert.location_name}."
        )
    return alert
