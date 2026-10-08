from typing import Optional
from pydantic import BaseModel
from app.schemas.common import BaseSchema

class UserLogin(BaseModel):
    username: Optional[str] = None
    email: Optional[str] = None
    password: str

class UserRegister(BaseModel):
    email: str
    username: str
    password: str
    full_name: str
    role: str = "LEA_OFFICER"
    badge_number: Optional[str] = None
    police_station: Optional[str] = None

class UserResponse(BaseSchema):
    id: str
    email: str
    username: str
    role: str
    full_name: str
    badge_number: Optional[str] = None
    police_station: Optional[str] = None
    is_active: bool

class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: UserResponse
