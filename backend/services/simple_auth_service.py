from fastapi import HTTPException, Request, Response
from datetime import datetime, timezone, timedelta
import secrets
import bcrypt
import logging
from typing import Optional, Dict
import re

logger = logging.getLogger(__name__)

class SimpleAuthService:
    def __init__(self, db):
        self.db = db
    
    def validate_email(self, email: str) -> bool:
        """Validate email format"""
        pattern = r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'
        return re.match(pattern, email) is not None
    
    def hash_password(self, password: str) -> str:
        """Hash password using bcrypt"""
        salt = bcrypt.gensalt()
        hashed = bcrypt.hashpw(password.encode('utf-8'), salt)
        return hashed.decode('utf-8')
    
    def verify_password(self, password: str, hashed: str) -> bool:
        """Verify password against hash"""
        return bcrypt.checkpw(password.encode('utf-8'), hashed.encode('utf-8'))
    
    async def register_user(self, email: str, password: str, name: str) -> Dict:
        """Register a new user"""
        try:
            # Validate email format
            if not self.validate_email(email):
                raise HTTPException(status_code=400, detail="Invalid email format")
            
            # Check password strength
            if len(password) < 6:
                raise HTTPException(status_code=400, detail="Password must be at least 6 characters")
            
            # Check if user already exists
            existing_user = await self.db.users.find_one({"email": email})
            if existing_user:
                raise HTTPException(status_code=400, detail="Email already registered")
            
            # Hash password
            hashed_password = self.hash_password(password)
            
            # Create user
            user_doc = {
                "user_id": secrets.token_urlsafe(16),
                "email": email,
                "name": name,
                "password_hash": hashed_password,
                "created_at": datetime.now(timezone.utc),
                "career_analyses": []
            }
            
            await self.db.users.insert_one(user_doc)
            
            # Create session
            session_token = secrets.token_urlsafe(32)
            expires_at = datetime.now(timezone.utc) + timedelta(days=7)
            
            session_doc = {
                "session_token": session_token,
                "user_id": user_doc["user_id"],
                "email": email,
                "name": name,
                "expires_at": expires_at,
                "created_at": datetime.now(timezone.utc)
            }
            
            await self.db.sessions.insert_one(session_doc)
            
            return {
                "session_token": session_token,
                "user": {
                    "id": user_doc["user_id"],
                    "email": email,
                    "name": name,
                    "picture": f"https://ui-avatars.com/api/?name={name}&background=10b981&color=fff"
                }
            }
            
        except HTTPException:
            raise
        except Exception as e:
            logger.error(f"Registration error: {str(e)}")
            raise HTTPException(status_code=500, detail="Registration failed")
    
    async def login_user(self, email: str, password: str) -> Dict:
        """Login user with email and password"""
        try:
            # Find user
            user = await self.db.users.find_one({"email": email})
            if not user:
                raise HTTPException(status_code=401, detail="Invalid email or password")
            
            # Verify password
            if not self.verify_password(password, user["password_hash"]):
                raise HTTPException(status_code=401, detail="Invalid email or password")
            
            # Create session
            session_token = secrets.token_urlsafe(32)
            expires_at = datetime.now(timezone.utc) + timedelta(days=7)
            
            session_doc = {
                "session_token": session_token,
                "user_id": user["user_id"],
                "email": user["email"],
                "name": user["name"],
                "expires_at": expires_at,
                "created_at": datetime.now(timezone.utc)
            }
            
            await self.db.sessions.insert_one(session_doc)
            
            return {
                "session_token": session_token,
                "user": {
                    "id": user["user_id"],
                    "email": user["email"],
                    "name": user["name"],
                    "picture": f"https://ui-avatars.com/api/?name={user['name']}&background=10b981&color=fff"
                }
            }
            
        except HTTPException:
            raise
        except Exception as e:
            logger.error(f"Login error: {str(e)}")
            raise HTTPException(status_code=500, detail="Login failed")
    
    async def get_current_user(self, request: Request) -> Optional[Dict]:
        """Get current user from session token (cookies first, then auth header)"""
        try:
            # Try cookie first
            session_token = request.cookies.get("session_token")
            
            # Fallback to authorization header
            if not session_token:
                auth_header = request.headers.get("authorization")
                if auth_header and auth_header.startswith("Bearer "):
                    session_token = auth_header.split(" ")[1]
            
            if not session_token:
                return None
            
            # Find valid session
            session = await self.db.sessions.find_one({
                "session_token": session_token,
                "expires_at": {"$gt": datetime.now(timezone.utc)}
            })
            
            if not session:
                return None
            
            return {
                "id": session["user_id"],
                "email": session["email"],
                "name": session["name"],
                "picture": f"https://ui-avatars.com/api/?name={session['name']}&background=10b981&color=fff"
            }
            
        except Exception as e:
            logger.error(f"Get current user error: {str(e)}")
            return None
    
    def set_session_cookie(self, response: Response, session_token: str):
        """Set secure session cookie"""
        response.set_cookie(
            key="session_token",
            value=session_token,
            max_age=7 * 24 * 60 * 60,  # 7 days
            path="/",
            secure=False,  # Set to True in production with HTTPS
            httponly=True,
            samesite="lax"
        )
    
    async def logout_user(self, request: Request, response: Response) -> bool:
        """Logout user and clear session"""
        try:
            session_token = request.cookies.get("session_token")
            if not session_token:
                auth_header = request.headers.get("authorization")
                if auth_header and auth_header.startswith("Bearer "):
                    session_token = auth_header.split(" ")[1]
            
            if session_token:
                # Delete session from database
                await self.db.sessions.delete_one({"session_token": session_token})
            
            # Clear cookie
            response.delete_cookie(
                key="session_token",
                path="/",
                secure=False,
                httponly=True,
                samesite="lax"
            )
            
            return True
            
        except Exception as e:
            logger.error(f"Logout error: {str(e)}")
            return False