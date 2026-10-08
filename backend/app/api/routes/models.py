from typing import List
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.models.model_meta import ModelMetrics
from app.schemas.model_meta import ModelMetricsResponse, RetrainResponse
from app.services.retrain_service import execute_model_retraining

router = APIRouter(prefix="/models", tags=["Model Monitoring & Retraining"])

@router.get("", response_model=List[ModelMetricsResponse])
def get_model_history(db: Session = Depends(get_db)):
    return db.query(ModelMetrics).order_by(ModelMetrics.id.desc()).all()

@router.get("/current", response_model=ModelMetricsResponse)
def get_current_model(db: Session = Depends(get_db)):
    model = db.query(ModelMetrics).filter(ModelMetrics.is_current == True).first()
    if not model:
        model = db.query(ModelMetrics).order_by(ModelMetrics.id.desc()).first()
    if not model:
        raise HTTPException(status_code=404, detail="No active ML model found.")
    return model

@router.get("/metrics", response_model=ModelMetricsResponse)
def get_metrics_endpoint(db: Session = Depends(get_db)):
    return get_current_model(db)

@router.post("/retrain", response_model=RetrainResponse)
def trigger_retraining(db: Session = Depends(get_db)):
    try:
        res = execute_model_retraining(db)
        return res
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Model retraining failed: {e}")
