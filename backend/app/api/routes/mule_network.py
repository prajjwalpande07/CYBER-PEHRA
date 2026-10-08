from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.schemas.mule import MuleNetworkResponse
from app.services.mule_service import get_full_mule_network, get_account_subgraph

router = APIRouter(prefix="/mule-network", tags=["Mule Network"])

@router.get("", response_model=MuleNetworkResponse)
def get_mule_network_endpoint(db: Session = Depends(get_db)):
    return get_full_mule_network(db)

@router.get("/{account_id}", response_model=MuleNetworkResponse)
def get_account_mule_network(account_id: str, db: Session = Depends(get_db)):
    return get_account_subgraph(db, account_id)

@router.get("/{account_id}/connections", response_model=MuleNetworkResponse)
def get_account_connections(account_id: str, db: Session = Depends(get_db)):
    return get_account_subgraph(db, account_id)
