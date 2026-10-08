from sqlalchemy import Column, String, Float
from datetime import datetime, timezone
from app.core.database import Base

class AlertNotification(Base):
    __tablename__ = "alert_notifications"

    id = Column(String, primary_key=True, index=True)  # e.g. ALT-9042
    title = Column(String, nullable=False)
    type = Column(String, nullable=False)  # Critical Risk Location, High Risk ATM, Suspicious Mule Network, Imminent Withdrawal, Cross-Jurisdiction Activity
    location_id = Column(String, nullable=False)
    location_name = Column(String, nullable=False)
    state = Column(String, index=True, nullable=False)
    district = Column(String, index=True, nullable=False)
    risk_score = Column(Float, nullable=False)
    severity = Column(String, nullable=False)  # LOW, MEDIUM, HIGH, CRITICAL
    timestamp = Column(String, default=lambda: datetime.now(timezone.utc).isoformat())
    recipient = Column(String, nullable=False)  # Law Enforcement Agencies, Banks / Financial Institutions, I4C, Joint Taskforce
    channel = Column(String, nullable=False)  # SMS + Dashboard, Email + API, Direct Terminal, NPCI Urgent Webhook
    status = Column(String, default="Delivered", nullable=False)  # Sent, Delivered, Acknowledged, Action Taken
    amount_at_risk = Column(Float, default=0.0, nullable=False)
