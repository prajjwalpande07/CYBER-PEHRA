from typing import Optional, Union
from fastapi import APIRouter, Depends, HTTPException, status, Request
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.core.security import verify_password, get_password_hash, create_access_token, decode_token, oauth2_scheme, normalize_role
from app.models.user import User
from app.schemas.auth import UserLogin, UserRegister, UserResponse, Token

router = APIRouter(prefix="/auth", tags=["Authentication"])

def get_current_user(token: Optional[str] = Depends(oauth2_scheme), db: Session = Depends(get_db)) -> Optional[User]:
    if not token:
        # For demonstration and persona switching, return a default LEA officer if unauthenticated
        return db.query(User).filter(User.role == "LEA_OFFICER").first()
    payload = decode_token(token)
    if not payload:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or expired authentication credentials",
            headers={"WWW-Authenticate": "Bearer"},
        )
    user_id = payload.get("sub")
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found")
    return user

@router.post("/register", response_model=UserResponse, status_code=status.HTTP_201_CREATED)
def register(user_in: UserRegister, db: Session = Depends(get_db)):
    existing = db.query(User).filter((User.email == user_in.email) | (User.username == user_in.username)).first()
    if existing:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="User with this email or username already exists."
        )

    user_count = db.query(User).count()
    new_id = f"USR-{user_count + 1:03d}"
    normalized_role = normalize_role(user_in.role)

    user = User(
        id=new_id,
        email=user_in.email,
        username=user_in.username,
        hashed_password=get_password_hash(user_in.password),
        role=normalized_role,
        full_name=user_in.full_name,
        badge_number=user_in.badge_number,
        police_station=user_in.police_station,
        is_active=True,
    )
    db.add(user)
    db.commit()
    db.refresh(user)
    return user

@router.post("/login", response_model=Token)
async def login(
    request: Request,
    db: Session = Depends(get_db)
):
    """
    Supports both JSON body ({ username/email, password }) and form-encoded data (OAuth2 form).
    """
    identifier = None
    password = None

    content_type = request.headers.get("content-type", "")
    if "application/json" in content_type:
        body = await request.json()
        identifier = body.get("username") or body.get("email")
        password = body.get("password")
    else:
        form = await request.form()
        identifier = form.get("username")
        password = form.get("password")

    if not identifier or not password:
        raise HTTPException(status_code=400, detail="Username/email and password required")

    user = db.query(User).filter(
        (User.username == identifier) | (User.email == identifier)
    ).first()

    if not user or not verify_password(password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username/email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )

    access_token = create_access_token(
        data={"sub": user.id, "email": user.email, "role": user.role}
    )
    return {
        "access_token": access_token,
        "token_type": "bearer",
        "user": user,
    }

@router.get("/me", response_model=UserResponse)
def get_me(current_user: User = Depends(get_current_user)):
    if not current_user:
        raise HTTPException(status_code=401, detail="Not authenticated")
    return current_user

@router.post("/refresh", response_model=Token)
def refresh_token(current_user: User = Depends(get_current_user)):
    if not current_user:
        raise HTTPException(status_code=401, detail="Not authenticated")
    new_token = create_access_token(
        data={"sub": current_user.id, "email": current_user.email, "role": current_user.role}
    )
    return {
        "access_token": new_token,
        "token_type": "bearer",
        "user": current_user,
    }
