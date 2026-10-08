from typing import List, Optional
from app.schemas.common import BaseSchema

class MuleNodeResponse(BaseSchema):
    id: str
    label: str
    type: str  # victim, mule_l1, mule_l2, shell_firm, atm, branch, crypto_exchange
    bank: str
    account_number: str
    holder: str
    balance: float
    risk_score: float
    flag: str
    x: Optional[float] = None
    y: Optional[float] = None

class MuleEdgeResponse(BaseSchema):
    id: str
    source: str
    target: str
    amount: float
    type: str
    timestamp: str
    hop_level: int

class MuleNetworkResponse(BaseSchema):
    nodes: List[MuleNodeResponse]
    edges: List[MuleEdgeResponse]
