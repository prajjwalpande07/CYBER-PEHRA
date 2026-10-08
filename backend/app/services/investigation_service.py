import random
from datetime import datetime, timezone
from sqlalchemy.orm import Session
from app.models.investigation import InvestigationCase
from app.models.location import WithdrawalLocation
from app.services.audit_service import append_block

def dispatch_team(
    db: Session,
    case_id: str,
    location_id: str = None,
    officer: str = "OFFICER_LEA",
    notes_text: str = None,
) -> InvestigationCase:
    inv = db.query(InvestigationCase).filter(InvestigationCase.id == case_id).first()
    if not inv:
        return None

    now_iso = datetime.now(timezone.utc).isoformat()
    now_str = datetime.now().strftime("%I:%M:%S %p")
    note = f"{now_str} - Quick Response Team (QRT) Patrol unit dispatched to target perimeter."
    if notes_text:
        note += f" Notes: {notes_text}"

    inv.status = "Team Dispatched"
    inv.action_taken = "Quick Response Team (QRT) Patrol unit dispatched to intercept suspect."
    inv_notes = list(inv.notes or [])
    inv_notes.append(note)
    inv.notes = inv_notes
    inv.updated_at = now_iso

    # If location is provided or linked, update location status
    loc_id = location_id or inv.location_id
    if loc_id:
        loc = db.query(WithdrawalLocation).filter(WithdrawalLocation.id == loc_id).first()
        if loc:
            loc.status = "Patrol Dispatched"

    db.commit()
    db.refresh(inv)

    append_block(
        db=db,
        action="QRT_TEAM_DISPATCHED",
        officer=officer,
        case_id=case_id,
        payload_summary=f"Ground intervention QRT team deployed to intercept cash runner for Case {case_id}."
    )

    return inv

def freeze_account(
    db: Session,
    case_id: str,
    account_number: str,
    amount_to_freeze: float = None,
    officer: str = "BANK_NODAL_OFFICER",
    notes_text: str = None,
) -> InvestigationCase:
    inv = db.query(InvestigationCase).filter(InvestigationCase.id == case_id).first()
    if not inv:
        return None

    recovered = amount_to_freeze if amount_to_freeze and amount_to_freeze > 0 else 450000.0
    now_iso = datetime.now(timezone.utc).isoformat()
    now_str = datetime.now().strftime("%I:%M:%S %p")
    note = f"{now_str} - Section 102 CrPC debit freeze enforced on account {account_number}. Preserved ₹{recovered:,.0f}."
    if notes_text:
        note += f" Details: {notes_text}"

    inv.account_freeze_status = "Frozen (Sec 102 CrPC)"
    inv.amount_recovered = (inv.amount_recovered or 0.0) + recovered
    inv_notes = list(inv.notes or [])
    inv_notes.append(note)
    inv.notes = inv_notes
    inv.updated_at = now_iso

    db.commit()
    db.refresh(inv)

    append_block(
        db=db,
        action="SECTION_102_FREEZE_ENFORCED",
        officer=officer,
        case_id=case_id,
        payload_summary=f"Account {account_number} debit-blocked under Sec 102 CrPC. Preserved ₹{recovered:,.0f}."
    )

    return inv

def record_seizure(
    db: Session,
    case_id: str,
    amount_seized: float,
    officer: str = "OFFICER_LEA",
    notes_text: str = None,
) -> InvestigationCase:
    inv = db.query(InvestigationCase).filter(InvestigationCase.id == case_id).first()
    if not inv:
        return None

    now_iso = datetime.now(timezone.utc).isoformat()
    now_str = datetime.now().strftime("%I:%M:%S %p")
    note = f"{now_str} - Physical cash seizure executed on suspect runner: ₹{amount_seized:,.0f}."
    if notes_text:
        note += f" Details: {notes_text}"

    inv.seizure_status = "Cash Seized"
    inv.amount_recovered = (inv.amount_recovered or 0.0) + amount_seized
    inv_notes = list(inv.notes or [])
    inv_notes.append(note)
    inv.notes = inv_notes
    inv.updated_at = now_iso

    db.commit()
    db.refresh(inv)

    append_block(
        db=db,
        action="EVIDENCE_CASH_SEIZED",
        officer=officer,
        case_id=case_id,
        payload_summary=f"Seized ₹{amount_seized:,.0f} in cash from runner at ATM vestibule for Case {case_id}."
    )

    return inv

def complete_case(
    db: Session,
    case_id: str,
    officer: str = "OFFICER_LEA"
) -> InvestigationCase:
    inv = db.query(InvestigationCase).filter(InvestigationCase.id == case_id).first()
    if not inv:
        return None

    now_iso = datetime.now(timezone.utc).isoformat()
    inv.status = "Intervention Completed"
    inv.updated_at = now_iso
    db.commit()
    db.refresh(inv)

    append_block(
        db=db,
        action="INVESTIGATION_COMPLETED",
        officer=officer,
        case_id=case_id,
        payload_summary=f"Case {case_id} intervention officially concluded and signed off."
    )

    return inv
