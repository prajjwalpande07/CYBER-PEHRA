import random
from typing import List, Optional
from datetime import datetime, timezone
from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.models.complaint import Complaint
from app.models.data_fusion import DataFusionSource
from app.schemas.complaint import ComplaintCreate, ComplaintUpdate, ComplaintStatusUpdate, ComplaintResponse
from app.utils.masking import mask_account_number, mask_phone_number
from app.services.audit_service import append_block
from app.services.prediction_service import run_prediction_for_complaint

router = APIRouter(prefix="/complaints", tags=["Complaints"])

@router.post("", response_model=ComplaintResponse, status_code=status.HTTP_201_CREATED)
async def create_complaint(
    complaint_in: ComplaintCreate,
    db: Session = Depends(get_db)
):
    # Generate unique ID
    new_id = f"CP-2026-{random.randint(8960, 9999)}"
    now_iso = datetime.now(timezone.utc).isoformat()
    ncrp_ref = complaint_in.ncrp_ref or f"NCRP-2026-IND-{random.randint(10000, 99999)}"

    # Account and phone number formatting
    masked_phone = mask_phone_number(complaint_in.contact_number)

    complaint = Complaint(
        id=new_id,
        ncrp_ref=ncrp_ref,
        victim_name=complaint_in.victim_name,
        contact_number=masked_phone,
        complaint_type=complaint_in.complaint_type,
        transaction_id=complaint_in.transaction_id,
        transaction_amount=complaint_in.transaction_amount,
        transaction_time=complaint_in.transaction_time or now_iso,
        bank=complaint_in.bank,
        account_info=complaint_in.account_info,
        suspected_account=complaint_in.suspected_account,
        transaction_location=complaint_in.transaction_location,
        state=complaint_in.state,
        district=complaint_in.district,
        latitude=complaint_in.latitude,
        longitude=complaint_in.longitude,
        complaint_description=complaint_in.complaint_description,
        evidence_upload=complaint_in.evidence_upload,
        status="Pending Review",
        risk_score=0.0,
        risk_level="LOW",
        created_at=now_iso,
    )
    db.add(complaint)
    db.commit()
    db.refresh(complaint)

    # Update Data fusion source counters
    srcs = db.query(DataFusionSource).filter(DataFusionSource.id.in_(["DFS-01", "DFS-03"])).all()
    for s in srcs:
        s.records_received += 1
        s.records_processed += 1
        s.last_sync = "Just now"
    db.commit()

    # Blockchain Audit Block
    append_block(
        db=db,
        action="COMPLAINT_REGISTERED_NCRP",
        officer="OFFICER_LEA_PORTAL",
        case_id=new_id,
        payload_summary=f"New {complaint.complaint_type} complaint registered. Amount: ₹{complaint.transaction_amount:,.0f}"
    )

    # Run Prediction workflow automatically
    try:
        await run_prediction_for_complaint(db, complaint.id)
        db.refresh(complaint)
    except Exception as e:
        print(f"Prediction pipeline deferred on complaint {complaint.id}: {e}")

    return complaint

@router.get("", response_model=List[ComplaintResponse])
def get_complaints(
    search: Optional[str] = Query(None),
    complaint_type: Optional[str] = Query(None, alias="type"),
    state: Optional[str] = Query(None),
    district: Optional[str] = Query(None),
    risk_level: Optional[str] = Query(None),
    status: Optional[str] = Query(None),
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=500),
    db: Session = Depends(get_db)
):
    query = db.query(Complaint)

    if complaint_type and complaint_type != "ALL":
        query = query.filter(Complaint.complaint_type == complaint_type)
    if state and state != "ALL":
        query = query.filter(Complaint.state == state)
    if district and district != "ALL":
        query = query.filter(Complaint.district == district)
    if risk_level and risk_level != "ALL":
        query = query.filter(Complaint.risk_level == risk_level)
    if status and status != "ALL":
        query = query.filter(Complaint.status == status)

    if search:
        s = f"%{search.lower()}%"
        query = query.filter(
            (Complaint.id.ilike(s)) |
            (Complaint.ncrp_ref.ilike(s)) |
            (Complaint.victim_name.ilike(s)) |
            (Complaint.suspected_account.ilike(s)) |
            (Complaint.district.ilike(s)) |
            (Complaint.transaction_id.ilike(s))
        )

    # Sort newest first
    query = query.order_by(Complaint.created_at.desc())
    return query.offset(skip).limit(limit).all()

@router.get("/{complaint_id}", response_model=ComplaintResponse)
def get_complaint(complaint_id: str, db: Session = Depends(get_db)):
    complaint = db.query(Complaint).filter(Complaint.id == complaint_id).first()
    if not complaint:
        raise HTTPException(status_code=404, detail=f"Complaint '{complaint_id}' not found.")
    return complaint

@router.put("/{complaint_id}", response_model=ComplaintResponse)
def update_complaint(
    complaint_id: str,
    complaint_in: ComplaintUpdate,
    db: Session = Depends(get_db)
):
    complaint = db.query(Complaint).filter(Complaint.id == complaint_id).first()
    if not complaint:
        raise HTTPException(status_code=404, detail=f"Complaint '{complaint_id}' not found.")

    for field, val in complaint_in.model_dump(exclude_unset=True).items():
        if val is not None:
            setattr(complaint, field, val)

    db.commit()
    db.refresh(complaint)
    return complaint

@router.patch("/{complaint_id}/status", response_model=ComplaintResponse)
def patch_complaint_status(
    complaint_id: str,
    status_in: ComplaintStatusUpdate,
    db: Session = Depends(get_db)
):
    complaint = db.query(Complaint).filter(Complaint.id == complaint_id).first()
    if not complaint:
        raise HTTPException(status_code=404, detail=f"Complaint '{complaint_id}' not found.")

    complaint.status = status_in.status
    db.commit()
    db.refresh(complaint)

    append_block(
        db=db,
        action="COMPLAINT_STATUS_UPDATED",
        officer="OFFICER_LEA",
        case_id=complaint_id,
        payload_summary=f"Complaint {complaint_id} status updated to {status_in.status}."
    )
    return complaint
