from sqlalchemy import Column, String, Float, Text, DateTime
from datetime import datetime, timezone
from app.core.database import Base

class Complaint(Base):
    __tablename__ = "complaints"

    id = Column(String, primary_key=True, index=True)  # e.g. CP-2026-8941
    ncrp_ref = Column(String, index=True, nullable=False)  # e.g. NCRP-2026-MHA-98214
    victim_name = Column(String, nullable=False)
    contact_number = Column(String, nullable=False)
    complaint_type = Column(String, nullable=False)
    transaction_id = Column(String, index=True, nullable=False)
    transaction_amount = Column(Float, nullable=False)
    transaction_time = Column(String, nullable=False)
    bank = Column(String, nullable=False)
    account_info = Column(String, nullable=False)
    suspected_account = Column(String, index=True, nullable=False)
    transaction_location = Column(String, nullable=False)
    state = Column(String, index=True, nullable=False)
    district = Column(String, index=True, nullable=False)
    latitude = Column(Float, nullable=False)
    longitude = Column(Float, nullable=False)
    complaint_description = Column(Text, nullable=False)
    evidence_upload = Column(String, nullable=True)
    status = Column(String, default="Pending Review", nullable=False)  # Pending Review, Analyzing, Predicted, Under Investigation, Closed
    risk_score = Column(Float, default=0.0, nullable=False)
    risk_level = Column(String, default="LOW", nullable=False)  # LOW, MEDIUM, HIGH, CRITICAL
    predicted_location_id = Column(String, nullable=True)
    created_at = Column(String, default=lambda: datetime.now(timezone.utc).isoformat())
