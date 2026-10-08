from typing import List
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.models.audit import BlockchainBlock
from app.schemas.audit import BlockchainBlockResponse, AuditVerifyResponse
from app.services.audit_service import verify_audit_chain

router = APIRouter(prefix="/audit", tags=["Cryptographic Audit Ledger"])

@router.get("", response_model=List[BlockchainBlockResponse])
def get_audit_trail(db: Session = Depends(get_db)):
    return db.query(BlockchainBlock).order_by(BlockchainBlock.block_id.asc()).all()

@router.get("/verify", response_model=AuditVerifyResponse)
def verify_audit_endpoint(db: Session = Depends(get_db)):
    is_valid, total, verified, tampered_ids, msg = verify_audit_chain(db)
    return AuditVerifyResponse(
        is_valid=is_valid,
        total_blocks=total,
        verified_blocks=verified,
        tampered_block_ids=tampered_ids,
        message=msg,
    )
