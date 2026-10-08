from sqlalchemy import Column, String, Integer
from datetime import datetime, timezone
from app.core.database import Base

class EvidenceRecord(Base):
    __tablename__ = "evidence_records"

    id = Column(String, primary_key=True, index=True)
    case_id = Column(String, index=True, nullable=False)
    filename = Column(String, nullable=False)
    file_type = Column(String, nullable=False)
    size = Column(Integer, nullable=False)
    sha256_hash = Column(String, nullable=False)
    uploader = Column(String, nullable=False)
    timestamp = Column(String, default=lambda: datetime.now(timezone.utc).isoformat())
    storage_path = Column(String, nullable=False)
