from pydantic import BaseModel, EmailStr, Field
from datetime import datetime
from typing import Optional
from .models import ReadingStatus


class UserCreate(BaseModel):
    full_name: str
    email: EmailStr
    password: str


class UserOut(BaseModel):
    id: int
    full_name: str
    email: EmailStr
    created_at: datetime

    class Config:
        from_attributes = True


class LoginRequest(BaseModel):
    email: EmailStr
    password: str


class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"


class BookCreate(BaseModel):
    title: str
    author: str
    genre: Optional[str] = None
    status: ReadingStatus = ReadingStatus.por_leer
    rating: Optional[int] = Field(default=None, ge=1, le=5)
    notes: Optional[str] = None


class BookUpdate(BaseModel):
    title: Optional[str] = None
    author: Optional[str] = None
    genre: Optional[str] = None
    status: Optional[ReadingStatus] = None
    rating: Optional[int] = Field(default=None, ge=1, le=5)
    notes: Optional[str] = None


class BookOut(BaseModel):
    id: int
    title: str
    author: str
    genre: Optional[str]
    status: ReadingStatus
    rating: Optional[int]
    notes: Optional[str]
    created_at: datetime

    class Config:
        from_attributes = True
