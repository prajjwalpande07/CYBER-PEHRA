from sqlalchemy import Column, Integer, String, Float, Boolean
from datetime import datetime, timezone
from app.core.database import Base

class ModelMetrics(Base):
    __tablename__ = "model_metrics"

    id = Column(Integer, primary_key=True, autoincrement=True)
    version = Column(String, unique=True, index=True, nullable=False)  # e.g. v2.4.1
    accuracy = Column(Float, nullable=False)
    precision = Column(Float, nullable=False)
    recall = Column(Float, nullable=False)
    f1_score = Column(Float, nullable=False)
    false_positive_rate = Column(Float, nullable=False)
    predictions_today = Column(Integer, default=0, nullable=False)
    successful_predictions = Column(Integer, default=0, nullable=False)
    last_retrained = Column(String, default=lambda: datetime.now(timezone.utc).isoformat())
    training_samples = Column(Integer, default=1000, nullable=False)
    status = Column(String, default="OPTIMAL", nullable=False)  # OPTIMAL, RETRAINING, EVALUATING
    is_current = Column(Boolean, default=True, nullable=False)
