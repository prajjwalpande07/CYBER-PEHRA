from sqlalchemy import Column, String, Integer
from datetime import datetime, timezone
from app.core.database import Base

class BlockchainBlock(Base):
    __tablename__ = "blockchain_blocks"

    block_id = Column(Integer, primary_key=True, index=True)
    timestamp = Column(String, default=lambda: datetime.now(timezone.utc).isoformat())
    action = Column(String, nullable=False)
    officer = Column(String, nullable=False)
    case_id = Column(String, nullable=False)
    hash = Column(String, nullable=False)
    previous_hash = Column(String, nullable=False)
    status = Column(String, default="CONFIRMED", nullable=False)  # CONFIRMED, IMMUTABLE
    payload_summary = Column(String, nullable=False)
