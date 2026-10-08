from typing import Optional, Dict, Any
from app.schemas.common import BaseSchema

class OfficerFeedbackCreate(BaseSchema):
    case_id: str
    officer_name: str
    badge_number: str
    outcome: str  # Arrest, Account Frozen, Cash Withdrawal Prevented, False Positive, No Action
    prediction_accuracy: int  # 1-5
    risk_score_validated: bool = True
    comments: str
    additional_evidence: Optional[str] = ""

class OfficerFeedbackResponse(BaseSchema):
    id: str
    case_id: str
    officer_name: str
    badge_number: str
    outcome: str
    prediction_accuracy: int
    risk_score_validated: bool
    comments: str
    additional_evidence: str
    timestamp: str
    used_in_model_training: bool

class FeedbackStatisticsResponse(BaseSchema):
    total_feedback: int
    average_accuracy: float
    outcomes_breakdown: Dict[str, int]
    used_in_training_count: int
    validation_rate: float
