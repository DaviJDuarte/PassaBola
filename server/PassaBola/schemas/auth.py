from datetime import date
from typing import Optional
from pydantic import BaseModel, EmailStr, Field

from models.user import PositionEnum

class SignupIn(BaseModel):
    name: str = Field(..., min_length=1)
    email: EmailStr
    phone_number: Optional[str] = None
    document: Optional[str] = None
    password: str = Field(..., min_length=6)
    birth_date: Optional[date] = None
    position: Optional[PositionEnum] = None

class LoginIn(BaseModel):
    email: EmailStr
    password: str

class TokenOut(BaseModel):
    access_token: str
    token_type: str = "bearer"

class UserOut(BaseModel):
    id: int
    name: Optional[str] = None
    email: EmailStr
    phone_number: Optional[str] = None
    document: Optional[str] = None
    birth_date: Optional[date] = None
    admin: Optional[bool] = False
    position: Optional[PositionEnum] = None

    class Config:
        from_attributes = True