from sqlalchemy import Column, String, Float, Integer
from app.core.database import Base

class MuleNode(Base):
    __tablename__ = "mule_nodes"

    id = Column(String, primary_key=True, index=True)
    label = Column(String, nullable=False)
    type = Column(String, nullable=False)  # victim, mule_l1, mule_l2, shell_firm, atm, branch, crypto_exchange
    bank = Column(String, nullable=False)
    account_number = Column(String, nullable=False)
    holder = Column(String, nullable=False)
    balance = Column(Float, default=0.0, nullable=False)
    risk_score = Column(Float, default=0.0, nullable=False)
    flag = Column(String, default="Active", nullable=False)
    x = Column(Float, nullable=True)
    y = Column(Float, nullable=True)

class MuleEdge(Base):
    __tablename__ = "mule_edges"

    id = Column(String, primary_key=True, index=True)
    source = Column(String, index=True, nullable=False)
    target = Column(String, index=True, nullable=False)
    amount = Column(Float, nullable=False)
    type = Column(String, nullable=False)  # UPI Transfer, IMPS/NEFT, ATM Cash-Out, P2P Crypto, Cheque Clearance
    timestamp = Column(String, nullable=False)
    hop_level = Column(Integer, default=1, nullable=False)
