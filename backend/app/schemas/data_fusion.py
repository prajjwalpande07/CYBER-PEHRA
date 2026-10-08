from typing import List, Optional
from app.schemas.common import BaseSchema

class DataFusionSourceResponse(BaseSchema):
    id: str
    name: str
    code: str
    category: str
    records_received: int
    records_processed: int
    last_sync: str
    data_quality: float
    status: str
    description: str

class DataFusionRunResponse(BaseSchema):
    status: str
    sources_synced: int
    new_records_fused: int
    data_quality_avg: float
    message: str
