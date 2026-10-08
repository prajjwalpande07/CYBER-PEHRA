from sqlalchemy import Column, String, Integer, Float
from datetime import datetime, timezone
from app.core.database import Base

class DataFusionSource(Base):
    __tablename__ = "data_fusion_sources"

    id = Column(String, primary_key=True, index=True)  # e.g. DFS-01
    name = Column(String, nullable=False)
    code = Column(String, nullable=False)
    category = Column(String, nullable=False)
    records_received = Column(Integer, default=0, nullable=False)
    records_processed = Column(Integer, default=0, nullable=False)
    last_sync = Column(String, default="Just now", nullable=False)
    data_quality = Column(Float, default=98.5, nullable=False)
    status = Column(String, default="OPTIMAL", nullable=False)  # ACTIVE, SYNCING, OPTIMAL, DEGRADED
    description = Column(String, nullable=False)
