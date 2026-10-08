from typing import List
from app.schemas.common import BaseSchema
from app.schemas.complaint import ComplaintResponse
from app.schemas.location import WithdrawalLocationResponse
from app.schemas.investigation import InvestigationCaseResponse

class SearchResponse(BaseSchema):
    query: str
    total_matches: int
    complaints: List[ComplaintResponse]
    locations: List[WithdrawalLocationResponse]
    investigations: List[InvestigationCaseResponse]
