from typing import List, Optional
from app.schemas.common import BaseSchema
from app.schemas.location import WithdrawalLocationResponse, RiskFactor

class PredictionRunResponse(BaseSchema):
    complaint_id: str
    risk_score: float
    risk_level: str
    confidence_score: float
    location: WithdrawalLocationResponse
    predicted_time_window: str
    amount_at_risk: float
    model_version: str
    factors: List[RiskFactor] = []
    explanation: str

class PredictionExplanationResponse(BaseSchema):
    prediction_id: str
    complaint_id: str
    risk_score: float
    risk_level: str
    factors: List[RiskFactor] = []
    explanation: str
