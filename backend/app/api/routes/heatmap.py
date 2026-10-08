from typing import Optional, List
from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.models.location import WithdrawalLocation
from app.schemas.location import GeoJSONFeatureCollection, GeoJSONFeature, GeoJSONGeometry

router = APIRouter(prefix="/heatmap", tags=["Risk Heatmap"])

@router.get("", response_model=GeoJSONFeatureCollection)
def get_heatmap_geojson(
    state: Optional[str] = Query(None),
    district: Optional[str] = Query(None),
    risk_level: Optional[str] = Query(None),
    date_from: Optional[str] = Query(None),
    date_to: Optional[str] = Query(None),
    db: Session = Depends(get_db)
):
    query = db.query(WithdrawalLocation)

    if state and state != "ALL":
        query = query.filter(WithdrawalLocation.state == state)
    if district and district != "ALL":
        query = query.filter(WithdrawalLocation.district == district)
    if risk_level and risk_level != "ALL":
        query = query.filter(WithdrawalLocation.risk_level == risk_level)

    locations = query.all()

    features: List[GeoJSONFeature] = []
    for loc in locations:
        recommended_action = (
            "Dispatch Quick Response Team (QRT) Patrol immediately"
            if loc.risk_score >= 85
            else "Deploy physical & CCTV perimeter surveillance"
            if loc.risk_score >= 65
            else "Maintain routine continuous monitoring"
        )

        properties = {
            "id": loc.id,
            "name": loc.name,
            "location": loc.name,
            "bank_name": loc.bank_name,
            "bankName": loc.bank_name,
            "location_type": loc.type,
            "type": loc.type,
            "state": loc.state,
            "district": loc.district,
            "address": loc.address,
            "latitude": loc.latitude,
            "longitude": loc.longitude,
            "risk_score": loc.risk_score,
            "riskScore": loc.risk_score,
            "risk_level": loc.risk_level,
            "riskLevel": loc.risk_level,
            "predicted_time": loc.predicted_time_window,
            "predictedTimeWindow": loc.predicted_time_window,
            "amount_at_risk": loc.amount_at_risk,
            "amountAtRisk": loc.amount_at_risk,
            "confidence_score": loc.confidence_score,
            "confidenceScore": loc.confidence_score,
            "status": loc.status,
            "recommended_action": recommended_action,
            "nearest_police_station": loc.nearest_police_station,
            "distance_to_patrol_km": loc.distance_to_patrol_km,
            "cctv_operational": loc.cctv_operational,
            "cash_reserve": loc.cash_reserve,
            "reasons": loc.reasons or [],
        }

        features.append(
            GeoJSONFeature(
                type="Feature",
                geometry=GeoJSONGeometry(
                    type="Point",
                    coordinates=[loc.longitude, loc.latitude]  # GeoJSON is [lon, lat]
                ),
                properties=properties
            )
        )

    return GeoJSONFeatureCollection(
        type="FeatureCollection",
        features=features
    )
