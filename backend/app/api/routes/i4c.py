from typing import List, Dict, Any
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import func
from app.core.database import get_db
from app.models.alert import AlertNotification
from app.models.complaint import Complaint
from app.models.investigation import InvestigationCase
from app.schemas.common import BaseSchema

router = APIRouter(prefix="/i4c", tags=["I4C National Coordination"])

class StateSummaryItem(BaseSchema):
    state: str
    alerts: int
    total_risk: float
    hot_zone: str
    active_mules: int

class CrossJurisdictionCaseItem(BaseSchema):
    case_id: str
    title: str
    origin: str
    transit_hop: str
    cash_out_target: str
    amount: float
    agencies: List[str]
    status: str

class I4COverviewResponse(BaseSchema):
    national_alert_count: int
    active_interstate_syndicates: int
    participating_states: int
    total_coordinated_funds: float
    joint_operations_active: int

@router.get("/overview", response_model=I4COverviewResponse)
def get_i4c_overview(db: Session = Depends(get_db)):
    alert_count = db.query(AlertNotification).count()
    states_count = db.query(func.count(func.distinct(Complaint.state))).scalar() or 7
    total_funds = db.query(func.sum(Complaint.transaction_amount)).scalar() or 0.0

    return I4COverviewResponse(
        national_alert_count=alert_count,
        active_interstate_syndicates=4,
        participating_states=states_count,
        total_coordinated_funds=total_funds,
        joint_operations_active=8,
    )

@router.get("/state-summary", response_model=List[StateSummaryItem])
def get_state_summary(db: Session = Depends(get_db)):
    return [
        StateSummaryItem(state="Maharashtra", alerts=5, total_risk=3650000.0, hot_zone="Nanded, Pune, Mumbai", active_mules=14),
        StateSummaryItem(state="Karnataka", alerts=3, total_risk=3200000.0, hot_zone="Bengaluru Indiranagar", active_mules=9),
        StateSummaryItem(state="Rajasthan", alerts=4, total_risk=950000.0, hot_zone="Bharatpur, Alwar, Mewat", active_mules=22),
        StateSummaryItem(state="Gujarat", alerts=2, total_risk=1100000.0, hot_zone="Surat Diamond Market", active_mules=7),
        StateSummaryItem(state="Telangana", alerts=2, total_risk=890000.0, hot_zone="Cyberabad Hitec City", active_mules=8),
        StateSummaryItem(state="Jharkhand", alerts=3, total_risk=720000.0, hot_zone="Jamtara Karmatanr", active_mules=35),
        StateSummaryItem(state="Delhi NCR", alerts=2, total_risk=510000.0, hot_zone="Connaught Place, Gurugram", active_mules=11),
    ]

@router.get("/cross-jurisdiction", response_model=List[CrossJurisdictionCaseItem])
def get_cross_jurisdiction_cases(db: Session = Depends(get_db)):
    return [
        CrossJurisdictionCaseItem(
            case_id="I4C-X-901",
            title="Digital Arrest Interstate Syndicate",
            origin="Pune (Maharashtra)",
            transit_hop="Alwar (Rajasthan)",
            cash_out_target="Nanded SBI ATM (Maharashtra)",
            amount=2200000.0,
            agencies=["Maharashtra Cyber", "Rajasthan Police CID", "Kotak Mahindra Nodal"],
            status="Joint Taskforce Active"
        ),
        CrossJurisdictionCaseItem(
            case_id="I4C-X-902",
            title="Fake Institutional IPO Allotment App",
            origin="Bengaluru (Karnataka)",
            transit_hop="Surat Hawala Desk (Gujarat)",
            cash_out_target="Indiranagar ICICI E-Lobby",
            amount=3200000.0,
            agencies=["Karnataka CID", "Gujarat Cyber Cell", "Yes Bank Fraud Desk"],
            status="Escalated to MHA"
        ),
        CrossJurisdictionCaseItem(
            case_id="I4C-X-903",
            title="Mewat Electricity Bill Phishing Wave",
            origin="Jaipur (Rajasthan)",
            transit_hop="Bharatpur Kaman Junction",
            cash_out_target="PNB Bharatpur Highway Kiosk",
            amount=185000.0,
            agencies=["Rajasthan Police", "Haryana Cyber Thana", "Airtel Payments Bank"],
            status="Intervention Coordinated"
        ),
        CrossJurisdictionCaseItem(
            case_id="I4C-X-904",
            title="Part-time Telegram Job Liquidation Matrix",
            origin="New Delhi (Delhi NCR)",
            transit_hop="Deoghar Cyber Cell (Jharkhand)",
            cash_out_target="HDFC Connaught Place ATM",
            amount=460000.0,
            agencies=["Delhi Police IFSO", "Jharkhand CID", "HDFC Risk Control"],
            status="Surveillance Deployed"
        )
    ]
