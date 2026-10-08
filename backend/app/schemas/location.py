from typing import List, Optional, Dict, Any
from pydantic import BaseModel
from app.schemas.common import BaseSchema

class RiskFactor(BaseSchema):
    factor: str
    impact: float
    description: str
    category: str  # mule, temporal, spatial, transactional, network

class WithdrawalLocationCreate(BaseSchema):
    name: str
    bank_name: str
    type: str
    state: str
    district: str
    address: str
    latitude: float
    longitude: float
    risk_score: float
    risk_level: str
    predicted_time_window: str
    amount_at_risk: float
    confidence_score: float
    status: str
    nearest_police_station: str
    distance_to_patrol_km: float
    cctv_operational: bool
    cash_reserve: float
    linked_complaint_ids: Optional[List[str]] = None
    linked_mule_accounts: Optional[List[str]] = None
    reasons: Optional[List[RiskFactor]] = None

class WithdrawalLocationResponse(BaseSchema):
    id: str
    name: str
    bank_name: str
    type: str
    state: str
    district: str
    address: str
    latitude: float
    longitude: float
    risk_score: float
    risk_level: str
    predicted_time_window: str
    amount_at_risk: float
    confidence_score: float
    status: str
    nearest_police_station: str
    distance_to_patrol_km: float
    cctv_operational: bool
    cash_reserve: float
    last_anomaly_detected: Optional[str] = None
    linked_complaint_ids: List[str] = []
    linked_mule_accounts: List[str] = []
    reasons: List[RiskFactor] = []

# GeoJSON Schemas for Leaflet Heatmap
class GeoJSONGeometry(BaseModel):
    type: str = "Point"
    coordinates: List[float]  # [longitude, latitude]

class GeoJSONFeature(BaseModel):
    type: str = "Feature"
    geometry: GeoJSONGeometry
    properties: Dict[str, Any]

class GeoJSONFeatureCollection(BaseModel):
    type: str = "FeatureCollection"
    features: List[GeoJSONFeature]
