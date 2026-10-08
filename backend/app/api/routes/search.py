from typing import Optional
from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.models.complaint import Complaint
from app.models.location import WithdrawalLocation
from app.models.investigation import InvestigationCase
from app.schemas.search import SearchResponse

router = APIRouter(prefix="/search", tags=["Global Search"])

@router.get("", response_model=SearchResponse)
def search_global(
    q: Optional[str] = Query("", alias="q"),
    limit: int = Query(10, ge=1, le=50),
    db: Session = Depends(get_db)
):
    query_str = q.strip().lower() if q else ""

    if not query_str:
        complaints = db.query(Complaint).limit(3).all()
        locations = db.query(WithdrawalLocation).limit(3).all()
        investigations = db.query(InvestigationCase).limit(3).all()
        return SearchResponse(
            query="",
            total_matches=len(complaints) + len(locations) + len(investigations),
            complaints=complaints,
            locations=locations,
            investigations=investigations,
        )

    s = f"%{query_str}%"
    complaints = (
        db.query(Complaint)
        .filter(
            (Complaint.id.ilike(s)) |
            (Complaint.ncrp_ref.ilike(s)) |
            (Complaint.victim_name.ilike(s)) |
            (Complaint.transaction_id.ilike(s)) |
            (Complaint.suspected_account.ilike(s)) |
            (Complaint.complaint_type.ilike(s)) |
            (Complaint.state.ilike(s)) |
            (Complaint.district.ilike(s))
        )
        .limit(limit)
        .all()
    )

    locations = (
        db.query(WithdrawalLocation)
        .filter(
            (WithdrawalLocation.id.ilike(s)) |
            (WithdrawalLocation.name.ilike(s)) |
            (WithdrawalLocation.bank_name.ilike(s)) |
            (WithdrawalLocation.address.ilike(s)) |
            (WithdrawalLocation.district.ilike(s)) |
            (WithdrawalLocation.state.ilike(s))
        )
        .limit(limit)
        .all()
    )

    investigations = (
        db.query(InvestigationCase)
        .filter(
            (InvestigationCase.id.ilike(s)) |
            (InvestigationCase.complaint_id.ilike(s)) |
            (InvestigationCase.complaint_title.ilike(s)) |
            (InvestigationCase.assigned_officer.ilike(s)) |
            (InvestigationCase.suspected_account.ilike(s)) |
            (InvestigationCase.police_station.ilike(s)) |
            (InvestigationCase.location_name.ilike(s))
        )
        .limit(limit)
        .all()
    )

    total = len(complaints) + len(locations) + len(investigations)
    return SearchResponse(
        query=query_str,
        total_matches=total,
        complaints=complaints,
        locations=locations,
        investigations=investigations,
    )
