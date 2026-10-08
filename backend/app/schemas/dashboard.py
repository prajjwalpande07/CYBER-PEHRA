from typing import List, Dict, Any, Optional
from app.schemas.common import BaseSchema
from app.schemas.alert import AlertNotificationResponse
from app.schemas.location import WithdrawalLocationResponse

class TrendDataPoint(BaseSchema):
    date: str
    complaints: int
    predicted_locations: int

class RiskDistribution(BaseSchema):
    critical: int
    high: int
    medium: int
    low: int

class SystemHealth(BaseSchema):
    status: str
    uptime: str
    ai_engine: str
    fusion_grid: str
    blockchain_ledger: str
    active_connections: int

class DashboardOverviewResponse(BaseSchema):
    total_complaints: int
    high_risk_complaints: int
    predicted_locations_count: int
    active_alerts_count: int
    cases_under_investigation: int
    total_funds_at_risk: float
    complaint_trend: List[TrendDataPoint]
    risk_distribution: RiskDistribution
    top_predicted_locations: List[WithdrawalLocationResponse]
    recent_alerts: List[AlertNotificationResponse]
    system_health: SystemHealth
