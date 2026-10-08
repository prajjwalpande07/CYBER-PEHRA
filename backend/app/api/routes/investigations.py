import random
from typing import List, Optional
from datetime import datetime, timezone
from fastapi import APIRouter, Depends, HTTPException, Query, UploadFile, File, Form, status
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.models.investigation import InvestigationCase
from app.models.evidence import EvidenceRecord
from app.schemas.investigation import (
    InvestigationCaseCreate,
    InvestigationCaseUpdate,
    InvestigationCaseResponse,
    DispatchActionRequest,
    FreezeAccountActionRequest,
    SeizureActionRequest,
    EvidenceResponse,
)
from app.services.investigation_service import dispatch_team, freeze_account, record_seizure, complete_case
from app.services.audit_service import append_block
from app.utils.file_storage import save_evidence_file

router = APIRouter(prefix="/investigations", tags=["Investigations"])

@router.get("", response_model=List[InvestigationCaseResponse])
def get_investigations(
    status: Optional[str] = Query(None),
    risk_level: Optional[str] = Query(None),
    db: Session = Depends(get_db)
):
    query = db.query(InvestigationCase)
    if status and status != "ALL":
        query = query.filter(InvestigationCase.status == status)
    if risk_level and risk_level != "ALL":
        query = query.filter(InvestigationCase.risk_level == risk_level)
    return query.order_by(InvestigationCase.updated_at.desc()).all()

@router.post("", response_model=InvestigationCaseResponse, status_code=status.HTTP_201_CREATED)
def create_investigation(
    case_in: InvestigationCaseCreate,
    db: Session = Depends(get_db)
):
    case_id = f"INV-{random.randint(7750, 7999)}"
    now_iso = datetime.now(timezone.utc).isoformat()

    inv = InvestigationCase(
        id=case_id,
        complaint_id=case_in.complaint_id,
        complaint_title=case_in.complaint_title,
        assigned_officer=case_in.assigned_officer,
        police_station=case_in.police_station,
        location_name=case_in.location_name,
        location_id=case_in.location_id,
        risk_level=case_in.risk_level,
        suspected_account=case_in.suspected_account,
        suspected_mule_name=case_in.suspected_mule_name,
        action_taken=case_in.action_taken,
        account_freeze_status=case_in.account_freeze_status or "Requested",
        seizure_status=case_in.seizure_status or "Pending",
        amount_recovered=case_in.amount_recovered or 0.0,
        evidence_list=case_in.evidence_list or [],
        notes=case_in.notes or [],
        status=case_in.status or "Open",
        created_at=now_iso,
        updated_at=now_iso,
    )
    db.add(inv)
    db.commit()
    db.refresh(inv)

    append_block(
        db=db,
        action="INVESTIGATION_DOSSIER_OPENED",
        officer=inv.assigned_officer,
        case_id=case_id,
        payload_summary=f"Opened investigation {case_id} for complaint {inv.complaint_id}."
    )
    return inv

@router.get("/{case_id}", response_model=InvestigationCaseResponse)
def get_investigation_detail(case_id: str, db: Session = Depends(get_db)):
    inv = db.query(InvestigationCase).filter(InvestigationCase.id == case_id).first()
    if not inv:
        raise HTTPException(status_code=404, detail=f"Case '{case_id}' not found.")
    return inv

@router.put("/{case_id}", response_model=InvestigationCaseResponse)
def update_investigation(
    case_id: str,
    update_in: InvestigationCaseUpdate,
    db: Session = Depends(get_db)
):
    inv = db.query(InvestigationCase).filter(InvestigationCase.id == case_id).first()
    if not inv:
        raise HTTPException(status_code=404, detail=f"Case '{case_id}' not found.")

    for field, val in update_in.model_dump(exclude_unset=True).items():
        if val is not None:
            setattr(inv, field, val)

    inv.updated_at = datetime.now(timezone.utc).isoformat()
    db.commit()
    db.refresh(inv)
    return inv

@router.post("/{case_id}/dispatch", response_model=InvestigationCaseResponse)
def post_dispatch(
    case_id: str,
    req: Optional[DispatchActionRequest] = None,
    db: Session = Depends(get_db)
):
    location_id = req.location_id if req else None
    notes = req.notes if req else None
    officer = req.officer if req and req.officer else "OFFICER_LEA"
    inv = dispatch_team(db=db, case_id=case_id, location_id=location_id, officer=officer, notes_text=notes)
    if not inv:
        raise HTTPException(status_code=404, detail=f"Case '{case_id}' not found.")
    return inv

@router.post("/{case_id}/freeze-account", response_model=InvestigationCaseResponse)
def post_freeze(
    case_id: str,
    req: FreezeAccountActionRequest,
    db: Session = Depends(get_db)
):
    inv = freeze_account(
        db=db,
        case_id=case_id,
        account_number=req.account_number,
        amount_to_freeze=req.amount_to_freeze,
        officer="BANK_NODAL_OFFICER",
        notes_text=req.notes
    )
    if not inv:
        raise HTTPException(status_code=404, detail=f"Case '{case_id}' not found.")
    return inv

@router.post("/{case_id}/seizure", response_model=InvestigationCaseResponse)
def post_seizure(
    case_id: str,
    req: SeizureActionRequest,
    db: Session = Depends(get_db)
):
    inv = record_seizure(
        db=db,
        case_id=case_id,
        amount_seized=req.amount_seized,
        officer="OFFICER_LEA",
        notes_text=req.notes
    )
    if not inv:
        raise HTTPException(status_code=404, detail=f"Case '{case_id}' not found.")
    return inv

@router.post("/{case_id}/complete", response_model=InvestigationCaseResponse)
def post_complete(case_id: str, db: Session = Depends(get_db)):
    inv = complete_case(db=db, case_id=case_id)
    if not inv:
        raise HTTPException(status_code=404, detail=f"Case '{case_id}' not found.")
    return inv

@router.post("/{case_id}/evidence", response_model=EvidenceResponse)
async def upload_evidence(
    case_id: str,
    file: UploadFile = File(...),
    uploader: str = Form("Insp. V. K. Sharma"),
    db: Session = Depends(get_db)
):
    inv = db.query(InvestigationCase).filter(InvestigationCase.id == case_id).first()
    if not inv:
        raise HTTPException(status_code=404, detail=f"Case '{case_id}' not found.")

    filename, safe_path, size, sha256_hash = await save_evidence_file(file, case_id)
    ev_id = f"EV-{random.randint(1000, 9999)}"
    now_iso = datetime.now(timezone.utc).isoformat()

    ev = EvidenceRecord(
        id=ev_id,
        case_id=case_id,
        filename=filename,
        file_type=file.content_type or "application/octet-stream",
        size=size,
        sha256_hash=sha256_hash,
        uploader=uploader,
        timestamp=now_iso,
        storage_path=safe_path,
    )
    db.add(ev)

    # Append to case evidence list
    ev_list = list(inv.evidence_list or [])
    ev_list.append(filename)
    inv.evidence_list = ev_list

    append_block(
        db=db,
        action="EVIDENCE_FILE_UPLOADED",
        officer=uploader,
        case_id=case_id,
        payload_summary=f"Evidence {filename} uploaded (Hash: {sha256_hash[:12]}..., Size: {size} bytes)."
    )

    db.commit()
    db.refresh(ev)
    return ev

@router.get("/{case_id}/evidence", response_model=List[EvidenceResponse])
def get_case_evidence(case_id: str, db: Session = Depends(get_db)):
    return db.query(EvidenceRecord).filter(EvidenceRecord.case_id == case_id).all()
