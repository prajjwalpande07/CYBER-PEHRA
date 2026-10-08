from typing import List
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.models.data_fusion import DataFusionSource
from app.schemas.data_fusion import DataFusionSourceResponse, DataFusionRunResponse
from app.services.fusion_service import run_fusion_sync

router = APIRouter(tags=["Data Fusion"])

@router.get("/data-sources", response_model=List[DataFusionSourceResponse])
def get_data_sources(db: Session = Depends(get_db)):
    return db.query(DataFusionSource).all()

@router.post("/data-fusion/run", response_model=DataFusionRunResponse)
def trigger_data_fusion(db: Session = Depends(get_db)):
    return run_fusion_sync(db)

@router.get("/data-fusion/status")
def get_data_fusion_status(db: Session = Depends(get_db)):
    sources = db.query(DataFusionSource).all()
    total_received = sum(s.records_received for s in sources)
    total_processed = sum(s.records_processed for s in sources)
    avg_quality = round(sum(s.data_quality for s in sources) / max(1, len(sources)), 1)

    return {
        "status": "OPTIMAL",
        "total_sources": len(sources),
        "total_records_received": total_received,
        "total_records_processed": total_processed,
        "average_quality": avg_quality,
        "sources": sources,
    }
