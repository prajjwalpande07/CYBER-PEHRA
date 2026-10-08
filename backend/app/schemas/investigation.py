from typing import List, Optional
from app.schemas.common import BaseSchema

class InvestigationCaseCreate(BaseSchema):
    complaint_id: str
    complaint_title: str
    assigned_officer: str
    police_station: str
    location_name: str
    location_id: Optional[str] = None
    risk_level: str
    suspected_account: str
    suspected_mule_name: str
    action_taken: str
    account_freeze_status: Optional[str] = "Requested"
    seizure_status: Optional[str] = "Pending"
    amount_recovered: Optional[float] = 0.0
    evidence_list: Optional[List[str]] = None
    notes: Optional[List[str]] = None
    status: Optional[str] = "Open"

class InvestigationCaseUpdate(BaseSchema):
    assigned_officer: Optional[str] = None
    action_taken: Optional[str] = None
    account_freeze_status: Optional[str] = None
    seizure_status: Optional[str] = None
    amount_recovered: Optional[float] = None
    status: Optional[str] = None
    notes: Optional[List[str]] = None

class InvestigationCaseResponse(BaseSchema):
    id: str
    complaint_id: str
    complaint_title: str
    assigned_officer: str
    police_station: str
    location_name: str
    location_id: Optional[str] = None
    risk_level: str
    suspected_account: str
    suspected_mule_name: str
    action_taken: str
    account_freeze_status: str
    seizure_status: str
    amount_recovered: float
    evidence_list: List[str] = []
    notes: List[str] = []
    status: str
    created_at: str
    updated_at: str

class DispatchActionRequest(BaseSchema):
    location_id: Optional[str] = None
    officer: Optional[str] = None
    notes: Optional[str] = None

class FreezeAccountActionRequest(BaseSchema):
    account_number: str
    amount_to_freeze: Optional[float] = None
    notes: Optional[str] = None

class SeizureActionRequest(BaseSchema):
    amount_seized: float
    notes: Optional[str] = None

class EvidenceResponse(BaseSchema):
    id: str
    case_id: str
    filename: str
    file_type: str
    size: int
    sha256_hash: str
    uploader: str
    timestamp: str
