from sqlalchemy import Column, String, Float, Boolean, JSON
from app.core.database import Base

class WithdrawalLocation(Base):
    __tablename__ = "withdrawal_locations"

    id = Column(String, primary_key=True, index=True)  # e.g. LOC-MH-01
    name = Column(String, nullable=False)
    bank_name = Column(String, index=True, nullable=False)
    type = Column(String, nullable=False)  # ATM, Bank Branch, CSP/Kiosk
    state = Column(String, index=True, nullable=False)
    district = Column(String, index=True, nullable=False)
    address = Column(String, nullable=False)
    latitude = Column(Float, nullable=False)
    longitude = Column(Float, nullable=False)
    risk_score = Column(Float, default=0.0, nullable=False)
    risk_level = Column(String, default="LOW", nullable=False)  # LOW, MEDIUM, HIGH, CRITICAL
    predicted_time_window = Column(String, default="Within next 60 - 90 mins", nullable=False)
    amount_at_risk = Column(Float, default=0.0, nullable=False)
    confidence_score = Column(Float, default=85.0, nullable=False)
    status = Column(String, default="Monitoring", nullable=False)  # Monitoring, Alert Sent, Patrol Dispatched, Under Surveillance, Intercepted
    linked_complaint_ids = Column(JSON, default=list)
    linked_mule_accounts = Column(JSON, default=list)
    reasons = Column(JSON, default=list)  # List of dicts: {factor, impact, description, category}
    nearest_police_station = Column(String, nullable=False)
    distance_to_patrol_km = Column(Float, default=1.5, nullable=False)
    cctv_operational = Column(Boolean, default=True, nullable=False)
    cash_reserve = Column(Float, default=500000.0, nullable=False)
    last_anomaly_detected = Column(String, default="Just now")
