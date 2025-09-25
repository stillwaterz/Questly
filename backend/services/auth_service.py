from fastapi import HTTPException, Request, Response
from datetime import datetime, timezone, timedelta
import secrets
import requests
import logging
from typing import Optional, Dict

logger = logging.getLogger(__name__)

class AuthService:
    def __init__(self, db):
        self.db = db
        self.auth_url = "https://demobackend.emergentagent.com/auth/v1/env/oauth/session-data"
    
    async def process_session_id(self, session_id: str) -> Dict:
        """Process session_id from Google OAuth and get user data"""
        try:
            headers = {"X-Session-ID": session_id}
            response = requests.get(self.auth_url, headers=headers, timeout=10)
            
            if response.status_code != 200:
                raise HTTPException(status_code=400, detail="Invalid session ID")
            
            user_data = response.json()
            
            # Create session token
            session_token = secrets.token_urlsafe(32)
            expires_at = datetime.now(timezone.utc) + timedelta(days=7)
            
            # Store session in database
            session_doc = {
                "session_token": session_token,
                "user_id": user_data["id"],
                "email": user_data["email"],
                "name": user_data["name"],
                "picture": user_data["picture"],
                "expires_at": expires_at,
                "created_at": datetime.now(timezone.utc)
            }
            
            await self.db.sessions.insert_one(session_doc)
            
            # Check if user exists, if not create
            existing_user = await self.db.users.find_one({"email": user_data["email"]})
            if not existing_user:
                user_doc = {
                    "user_id": user_data["id"],
                    "email": user_data["email"],
                    "name": user_data["name"],
                    "picture": user_data["picture"],
                    "created_at": datetime.now(timezone.utc),
                    "career_analyses": []
                }
                await self.db.users.insert_one(user_doc)
            
            return {
                "session_token": session_token,
                "user": {
                    "id": user_data["id"],
                    "email": user_data["email"],
                    "name": user_data["name"],
                    "picture": user_data["picture"]
                }
            }
            
        except requests.RequestException as e:
            logger.error(f"Auth service error: {str(e)}")
            raise HTTPException(status_code=500, detail="Authentication service unavailable")
        except Exception as e:
            logger.error(f"Session processing error: {str(e)}")
            raise HTTPException(status_code=500, detail="Failed to process authentication")
    
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
                "picture": session["picture"]
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
            secure=True,
            httponly=True,
            samesite="none"
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
                secure=True,
                httponly=True,
                samesite="none"
            )
            
            return True
            
        except Exception as e:
            logger.error(f"Logout error: {str(e)}")
            return False