from sqlalchemy import Column, String, Integer, Boolean, Text
from datetime import datetime, timezone
from app.core.database import Base

class OfficerFeedbackRecord(Base):
    __tablename__ = "officer_feedback_records"

    id = Column(String, primary_key=True, index=True)  # e.g. FB-511
    case_id = Column(String, index=True, nullable=False)
    officer_name = Column(String, nullable=False)
    badge_number = Column(String, nullable=False)
    outcome = Column(String, nullable=False)  # Arrest, Account Frozen, Cash Withdrawal Prevented, False Positive, No Action
    prediction_accuracy = Column(Integer, nullable=False)  # 1-5
    risk_score_validated = Column(Boolean, default=True, nullable=False)
    comments = Column(Text, nullable=False)
    additional_evidence = Column(Text, nullable=False)
    timestamp = Column(String, default=lambda: datetime.now(timezone.utc).isoformat())
    used_in_model_training = Column(Boolean, default=False, nullable=False)
