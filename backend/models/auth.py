from pydantic import BaseModel
from typing import Optional

class SessionIdRequest(BaseModel):
    session_id: str

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