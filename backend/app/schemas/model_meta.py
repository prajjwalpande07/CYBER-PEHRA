from typing import Optional, List
from app.schemas.common import BaseSchema

class ModelMetricsResponse(BaseSchema):
    version: str
    accuracy: float
    precision: float
    recall: float
    f1_score: float
    false_positive_rate: float
    predictions_today: int
    successful_predictions: int
    last_retrained: str
    training_samples: int
    status: str

class RetrainResponse(BaseSchema):
    status: str
    previous_version: str
    new_version: str
    metrics: ModelMetricsResponse
    feedback_samples_ingested: int
    message: str
