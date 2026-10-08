from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.models.location import WithdrawalLocation
from app.schemas.location import WithdrawalLocationResponse
from app.services.audit_service import append_block

router = APIRouter(prefix="/locations", tags=["Withdrawal Locations"])

@router.get("", response_model=List[WithdrawalLocationResponse])
def get_locations(
    state: Optional[str] = Query(None),
    district: Optional[str] = Query(None),
    risk_level: Optional[str] = Query(None),
    loc_type: Optional[str] = Query(None, alias="type"),
    sort_by: Optional[str] = Query("risk", pattern="^(risk|amount|confidence)$"),
    db: Session = Depends(get_db)
):
    query = db.query(WithdrawalLocation)

    if state and state != "ALL":
        query = query.filter(WithdrawalLocation.state == state)
    if district and district != "ALL":
        query = query.filter(WithdrawalLocation.district == district)
    if risk_level and risk_level != "ALL":
        query = query.filter(WithdrawalLocation.risk_level == risk_level)
    if loc_type and loc_type != "ALL":
        query = query.filter(WithdrawalLocation.type == loc_type)

    if sort_by == "risk":
        query = query.order_by(WithdrawalLocation.risk_score.desc())
    elif sort_by == "amount":
        query = query.order_by(WithdrawalLocation.amount_at_risk.desc())
    elif sort_by == "confidence":
        query = query.order_by(WithdrawalLocation.confidence_score.desc())

    return query.all()

@router.get("/predicted", response_model=List[WithdrawalLocationResponse])
def get_predicted_locations(db: Session = Depends(get_db)):
    return (
        db.query(WithdrawalLocation)
        .order_by(WithdrawalLocation.risk_score.desc())
        .limit(10)
        .all()
    )

@router.get("/high-risk", response_model=List[WithdrawalLocationResponse])
def get_high_risk_locations(db: Session = Depends(get_db)):
    return (
        db.query(WithdrawalLocation)
        .filter(WithdrawalLocation.risk_score >= 61)
        .order_by(WithdrawalLocation.risk_score.desc())
        .all()
    )

@router.get("/{location_id}", response_model=WithdrawalLocationResponse)
def get_location_detail(location_id: str, db: Session = Depends(get_db)):
    loc = db.query(WithdrawalLocation).filter(WithdrawalLocation.id == location_id).first()
    if not loc:
        raise HTTPException(status_code=404, detail=f"Location '{location_id}' not found.")
    return loc

@router.post("/{location_id}/surveillance", response_model=WithdrawalLocationResponse)
def mark_surveillance_endpoint(location_id: str, db: Session = Depends(get_db)):
    loc = db.query(WithdrawalLocation).filter(WithdrawalLocation.id == location_id).first()
    if not loc:
        raise HTTPException(status_code=404, detail=f"Location '{location_id}' not found.")

    loc.status = "Under Surveillance"
    db.commit()
    db.refresh(loc)

    append_block(
        db=db,
        action="ATM_SURVEILLANCE_FLAGGED",
        officer="SURVEILLANCE_GRID_LEA",
        case_id=location_id,
        payload_summary=f"Physical and CCTV surveillance activated on {loc.name} ({location_id})."
    )

    return loc
