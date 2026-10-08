from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.models.alert import AlertNotification
from app.models.complaint import Complaint
from app.models.investigation import InvestigationCase
from app.schemas.alert import AlertNotificationResponse
from app.schemas.complaint import ComplaintResponse
from app.schemas.investigation import InvestigationCaseResponse
from app.services.investigation_service import freeze_account

router = APIRouter(prefix="/banks", tags=["Bank & FI Portal"])

class FreezeStatusUpdate(BaseModel):
    status: str = "Frozen (Sec 102 CrPC)"
    amount_frozen: Optional[float] = None
    notes: Optional[str] = None

@router.get("/alerts", response_model=List[AlertNotificationResponse])
def get_bank_alerts(db: Session = Depends(get_db)):
    return (
        db.query(AlertNotification)
        .filter(AlertNotification.recipient.in_(["Banks / Financial Institutions", "Joint Taskforce"]))
        .order_by(AlertNotification.timestamp.desc())
        .all()
    )

@router.get("/suspicious-transactions", response_model=List[ComplaintResponse])
def get_suspicious_transactions(db: Session = Depends(get_db)):
    return (
        db.query(Complaint)
        .filter(Complaint.risk_level.in_(["CRITICAL", "HIGH"]))
        .order_by(Complaint.transaction_amount.desc())
        .limit(25)
        .all()
    )

@router.get("/freeze-requests", response_model=List[InvestigationCaseResponse])
def get_freeze_requests(db: Session = Depends(get_db)):
    return (
        db.query(InvestigationCase)
        .filter(InvestigationCase.account_freeze_status.in_(["Requested", "Frozen (Sec 102 CrPC)", "Lien Placed"]))
        .order_by(InvestigationCase.updated_at.desc())
        .all()
    )

@router.patch("/freeze-requests/{case_id}", response_model=InvestigationCaseResponse)
def update_freeze_request(
    case_id: str,
    update_in: FreezeStatusUpdate,
    db: Session = Depends(get_db)
):
    inv = db.query(InvestigationCase).filter(InvestigationCase.id == case_id).first()
    if not inv:
        raise HTTPException(status_code=404, detail=f"Case '{case_id}' not found.")

    res = freeze_account(
        db=db,
        case_id=case_id,
        account_number=inv.suspected_account,
        amount_to_freeze=update_in.amount_frozen,
        officer="BANK_NODAL_DESK",
        notes_text=update_in.notes or "Debit lien placed via Core Banking System (CBS)."
    )
    return res
