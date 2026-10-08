from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.models.alert import AlertNotification
from app.schemas.alert import AlertNotificationCreate, AlertNotificationResponse, AlertStatusUpdate
from app.services.alert_service import create_alert, acknowledge_alert

router = APIRouter(prefix="/alerts", tags=["Alerts"])

@router.get("", response_model=List[AlertNotificationResponse])
def get_alerts(
    alert_type: Optional[str] = Query(None, alias="type"),
    recipient: Optional[str] = Query(None),
    status: Optional[str] = Query(None),
    limit: int = Query(50, ge=1, le=200),
    db: Session = Depends(get_db)
):
    query = db.query(AlertNotification)
    if alert_type and alert_type != "ALL":
        query = query.filter(AlertNotification.type == alert_type)
    if recipient and recipient != "ALL":
        query = query.filter(AlertNotification.recipient == recipient)
    if status and status != "ALL":
        query = query.filter(AlertNotification.status == status)

    return query.order_by(AlertNotification.timestamp.desc()).limit(limit).all()

@router.post("", response_model=AlertNotificationResponse, status_code=status.HTTP_201_CREATED)
async def post_alert(alert_in: AlertNotificationCreate, db: Session = Depends(get_db)):
    alert = await create_alert(
        db=db,
        title=alert_in.title,
        alert_type=alert_in.type,
        location_id=alert_in.location_id,
        location_name=alert_in.location_name,
        state=alert_in.state,
        district=alert_in.district,
        risk_score=alert_in.risk_score,
        severity=alert_in.severity,
        amount_at_risk=alert_in.amount_at_risk,
        recipient=alert_in.recipient,
        channel=alert_in.channel,
    )
    return alert

@router.get("/live", response_model=List[AlertNotificationResponse])
def get_live_alerts(db: Session = Depends(get_db)):
    return (
        db.query(AlertNotification)
        .order_by(AlertNotification.timestamp.desc())
        .limit(10)
        .all()
    )

@router.get("/{alert_id}", response_model=AlertNotificationResponse)
def get_alert_detail(alert_id: str, db: Session = Depends(get_db)):
    alert = db.query(AlertNotification).filter(AlertNotification.id == alert_id).first()
    if not alert:
        raise HTTPException(status_code=404, detail=f"Alert '{alert_id}' not found.")
    return alert

@router.patch("/{alert_id}/acknowledge", response_model=AlertNotificationResponse)
def acknowledge_alert_endpoint(alert_id: str, db: Session = Depends(get_db)):
    alert = acknowledge_alert(db=db, alert_id=alert_id)
    if not alert:
        raise HTTPException(status_code=404, detail=f"Alert '{alert_id}' not found.")
    return alert

@router.patch("/{alert_id}/status", response_model=AlertNotificationResponse)
def update_alert_status(
    alert_id: str,
    status_in: AlertStatusUpdate,
    db: Session = Depends(get_db)
):
    alert = db.query(AlertNotification).filter(AlertNotification.id == alert_id).first()
    if not alert:
        raise HTTPException(status_code=404, detail=f"Alert '{alert_id}' not found.")
    alert.status = status_in.status
    db.commit()
    db.refresh(alert)
    return alert
