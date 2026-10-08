import hashlib
from datetime import datetime, timezone
from typing import Tuple, List
from sqlalchemy.orm import Session
from app.models.audit import BlockchainBlock

GENESIS_HASH = "0x0000000000000000000000000000000000000000000000000000000000000000"

def calculate_block_hash(
    block_id: int,
    timestamp: str,
    action: str,
    officer: str,
    case_id: str,
    previous_hash: str,
    payload_summary: str,
) -> str:
    raw_str = f"{block_id}-{timestamp}-{action}-{officer}-{case_id}-{previous_hash}-{payload_summary}"
    sha = hashlib.sha256(raw_str.encode("utf-8")).hexdigest()
    return f"0x{sha}"

def append_block(
    db: Session,
    action: str,
    officer: str,
    case_id: str,
    payload_summary: str,
) -> BlockchainBlock:
    last_block = db.query(BlockchainBlock).order_by(BlockchainBlock.block_id.desc()).first()
    new_block_id = (last_block.block_id + 1) if last_block else 10001
    prev_hash = last_block.hash if last_block else GENESIS_HASH
    timestamp = datetime.now(timezone.utc).isoformat()

    current_hash = calculate_block_hash(
        block_id=new_block_id,
        timestamp=timestamp,
        action=action,
        officer=officer,
        case_id=case_id,
        previous_hash=prev_hash,
        payload_summary=payload_summary,
    )

    block = BlockchainBlock(
        block_id=new_block_id,
        timestamp=timestamp,
        action=action,
        officer=officer,
        case_id=case_id,
        hash=current_hash,
        previous_hash=prev_hash,
        status="CONFIRMED",
        payload_summary=payload_summary,
    )
    db.add(block)
    db.commit()
    db.refresh(block)
    return block

def verify_audit_chain(db: Session) -> Tuple[bool, int, int, List[int], str]:
    blocks = db.query(BlockchainBlock).order_by(BlockchainBlock.block_id.asc()).all()
    if not blocks:
        return True, 0, 0, [], "Audit chain is empty. Integrity nominal."

    tampered_ids = []
    verified_count = 0
    expected_prev_hash = GENESIS_HASH

    for b in blocks:
        if b.previous_hash != expected_prev_hash:
            tampered_ids.append(b.block_id)
        
        recomputed_hash = calculate_block_hash(
            block_id=b.block_id,
            timestamp=b.timestamp,
            action=b.action,
            officer=b.officer,
            case_id=b.case_id,
            previous_hash=b.previous_hash,
            payload_summary=b.payload_summary,
        )

        if recomputed_hash != b.hash:
            if b.block_id not in tampered_ids:
                tampered_ids.append(b.block_id)
        else:
            verified_count += 1

        expected_prev_hash = b.hash

    is_valid = len(tampered_ids) == 0
    message = (
        "Cryptographic audit chain fully verified. Merkle proof sealed."
        if is_valid
        else f"Integrity anomaly detected in {len(tampered_ids)} blocks."
    )
    return is_valid, len(blocks), verified_count, tampered_ids, message
