from typing import Optional
from app.schemas.common import BaseSchema

class AlertNotificationCreate(BaseSchema):
    title: str
    type: str
    location_id: str
    location_name: str
    state: str
    district: str
    risk_score: float
    severity: str
    recipient: str
    channel: str
    status: Optional[str] = "Delivered"
    amount_at_risk: float

class AlertNotificationResponse(BaseSchema):
    id: str
    title: str
    type: str
    location_id: str
    location_name: str
    state: str
    district: str
    risk_score: float
    severity: str
    timestamp: str
    recipient: str
    channel: str
    status: str
    amount_at_risk: float

class AlertStatusUpdate(BaseSchema):
    status: str
