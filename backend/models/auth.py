from pydantic import BaseModel, EmailStr
from typing import Optional

class UserRegister(BaseModel):
    email: EmailStr
    password: str
    name: str

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class AuthResponse(BaseModel):
    session_token: str
    user: dict

class UserProfile(BaseModel):
    id: str
    email: str
    name: str
    picture: str

class MentorRequest(BaseModel):
    career_title: str
    user_name: str
    user_email: str
    message: str