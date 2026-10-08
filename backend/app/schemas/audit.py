from typing import List, Optional
from app.schemas.common import BaseSchema

class BlockchainBlockCreate(BaseSchema):
    action: str
    officer: str
    case_id: str
    payload_summary: str

class BlockchainBlockResponse(BaseSchema):
    block_id: int
    timestamp: str
    action: str
    officer: str
    case_id: str
    hash: str
    previous_hash: str
    status: str
    payload_summary: str

class AuditVerifyResponse(BaseSchema):
    is_valid: bool
    total_blocks: int
    verified_blocks: int
    tampered_block_ids: List[int] = []
    message: str
