from sqlalchemy import Column, String, Float, JSON
from datetime import datetime, timezone
from app.core.database import Base

class InvestigationCase(Base):
    __tablename__ = "investigation_cases"

    id = Column(String, primary_key=True, index=True)  # e.g. INV-7731
    complaint_id = Column(String, index=True, nullable=False)
    complaint_title = Column(String, nullable=False)
    assigned_officer = Column(String, nullable=False)
    police_station = Column(String, nullable=False)
    location_name = Column(String, nullable=False)
    location_id = Column(String, nullable=True)
    risk_level = Column(String, nullable=False)
    suspected_account = Column(String, nullable=False)
    suspected_mule_name = Column(String, nullable=False)
    action_taken = Column(String, nullable=False)
    account_freeze_status = Column(String, default="Requested", nullable=False)  # None, Requested, Frozen (Sec 102 CrPC), Lien Placed
    seizure_status = Column(String, default="Pending", nullable=False)  # Pending, Cash Seized, No Seizure, Asset Frozen
    amount_recovered = Column(Float, default=0.0, nullable=False)
    evidence_list = Column(JSON, default=list)
    notes = Column(JSON, default=list)
    status = Column(String, default="Open", nullable=False)  # Open, Team Dispatched, Surveillance Active, Intervention Completed, Closed
    created_at = Column(String, default=lambda: datetime.now(timezone.utc).isoformat())
    updated_at = Column(String, default=lambda: datetime.now(timezone.utc).isoformat())
