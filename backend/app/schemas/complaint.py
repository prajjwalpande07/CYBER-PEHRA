from typing import Optional, List
from app.schemas.common import BaseSchema

class ComplaintCreate(BaseSchema):
    ncrp_ref: Optional[str] = None
    victim_name: str
    contact_number: str
    complaint_type: str
    transaction_id: str
    transaction_amount: float
    transaction_time: str
    bank: str
    account_info: str
    suspected_account: str
    transaction_location: str
    state: str
    district: str
    latitude: float
    longitude: float
    complaint_description: str
    evidence_upload: Optional[str] = None
    status: Optional[str] = "Pending Review"
    risk_score: Optional[float] = 0.0
    risk_level: Optional[str] = "LOW"
    predicted_location_id: Optional[str] = None

class ComplaintUpdate(BaseSchema):
    status: Optional[str] = None
    risk_score: Optional[float] = None
    risk_level: Optional[str] = None
    predicted_location_id: Optional[str] = None
    complaint_description: Optional[str] = None

class ComplaintStatusUpdate(BaseSchema):
    status: str

class ComplaintResponse(BaseSchema):
    id: str
    ncrp_ref: str
    victim_name: str
    contact_number: str
    complaint_type: str
    transaction_id: str
    transaction_amount: float
    transaction_time: str
    bank: str
    account_info: str
    suspected_account: str
    transaction_location: str
    state: str
    district: str
    latitude: float
    longitude: float
    complaint_description: str
    evidence_upload: Optional[str] = None
    status: str
    risk_score: float
    risk_level: str
    predicted_location_id: Optional[str] = None
    created_at: str
