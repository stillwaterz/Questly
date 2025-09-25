from fastapi import FastAPI, APIRouter, HTTPException, Request, Response, Depends
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pathlib import Path
from pydantic import BaseModel, Field
from typing import List, Optional
import uuid
from datetime import datetime

# Import our models and services
from models.career import CareerAnalysisRequest, CareerAnalysisResponse, CareerPath
from models.auth import SessionIdRequest, AuthResponse, UserProfile, MentorRequest
from services.gemini_service import GeminiService
from services.auth_service import AuthService
from services.video_service import VideoService

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

# Initialize services
try:
    gemini_service = GeminiService()
    auth_service = AuthService(db)
    video_service = VideoService()
    logger = logging.getLogger(__name__)
    logger.info("All services initialized successfully")
except Exception as e:
    logger = logging.getLogger(__name__)
    logger.error(f"Failed to initialize services: {str(e)}")
    gemini_service = None
    auth_service = None
    video_service = None

# Create the main app
app = FastAPI(title="Questly - Career Discovery API")

# Create a router with the /api prefix
api_router = APIRouter(prefix="/api")

# Define Models for existing endpoints
class StatusCheck(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    client_name: str
    timestamp: datetime = Field(default_factory=datetime.utcnow)

class StatusCheckCreate(BaseModel):
    client_name: str

# Existing routes
@api_router.get("/")
async def root():
    return {"message": "Questly API - Empowering South African Career Discovery!"}

@api_router.post("/status", response_model=StatusCheck)
async def create_status_check(input: StatusCheckCreate):
    status_dict = input.dict()
    status_obj = StatusCheck(**status_dict)
    _ = await db.status_checks.insert_one(status_obj.dict())
    return status_obj

@api_router.get("/status", response_model=List[StatusCheck])
async def get_status_checks():
    status_checks = await db.status_checks.find().to_list(1000)
    return [StatusCheck(**status_check) for status_check in status_checks]

# Authentication Routes
@api_router.post("/auth/session", response_model=AuthResponse)
async def process_session(request: SessionIdRequest, response: Response):
    """Process Google OAuth session ID and create user session"""
    if not auth_service:
        raise HTTPException(status_code=503, detail="Authentication service unavailable")
    
    auth_data = await auth_service.process_session_id(request.session_id)
    auth_service.set_session_cookie(response, auth_data["session_token"])
    
    return AuthResponse(
        session_token=auth_data["session_token"],
        user=auth_data["user"]
    )

@api_router.get("/auth/user", response_model=Optional[UserProfile])
async def get_current_user(request: Request):
    """Get current authenticated user"""
    if not auth_service:
        return None
    
    user = await auth_service.get_current_user(request)
    if user:
        return UserProfile(**user)
    return None

@api_router.post("/auth/logout")
async def logout_user(request: Request, response: Response):
    """Logout current user"""
    if not auth_service:
        raise HTTPException(status_code=503, detail="Authentication service unavailable")
    
    success = await auth_service.logout_user(request, response)
    return {"success": success}

# Career Analysis endpoint (enhanced)
@api_router.post("/analyze-career", response_model=CareerAnalysisResponse)
async def analyze_career(request: CareerAnalysisRequest, http_request: Request):
    """
    Analyze user interests and generate personalized career paths using Gemini AI
    """
    try:
        if not gemini_service:
            raise HTTPException(status_code=503, detail="Career analysis service is currently unavailable")
        
        if not request.userInput or len(request.userInput.strip()) < 5:
            raise HTTPException(status_code=400, detail="Please provide more detailed information about your interests")
        
        # Get current user (optional)
        user = None
        if auth_service:
            user = await auth_service.get_current_user(http_request)
        
        # Generate career paths using Gemini
        career_paths_data = gemini_service.analyze_career_interests(request.userInput)
        
        # Add video content to each career
        for career_data in career_paths_data:
            if video_service:
                career_data['videoUrl'] = video_service.generate_career_video(career_data['title'])
        
        # Convert to Pydantic models
        career_paths = []
        for career_data in career_paths_data:
            career_path = CareerPath(**career_data)
            career_paths.append(career_path)
        
        # Save analysis to user profile if authenticated
        if user and career_paths:
            analysis_doc = {
                "user_id": user["id"],
                "input": request.userInput,
                "results": [cp.dict() for cp in career_paths],
                "timestamp": datetime.utcnow()
            }
            await db.career_analyses.insert_one(analysis_doc)
        
        return CareerAnalysisResponse(careerPaths=career_paths)
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error in career analysis: {str(e)}")
        raise HTTPException(status_code=500, detail="An error occurred while analyzing your career interests. Please try again.")

# Mentor matching endpoint
@api_router.post("/request-mentor")
async def request_mentor(request: MentorRequest):
    """Request mentor matching for a specific career"""
    try:
        # Store mentor request
        mentor_doc = {
            "career_title": request.career_title,
            "user_name": request.user_name,
            "user_email": request.user_email,
            "message": request.message,
            "status": "pending",
            "created_at": datetime.utcnow()
        }
        
        await db.mentor_requests.insert_one(mentor_doc)
        
        return {
            "success": True,
            "message": "Your mentor request has been submitted. We'll connect you with a suitable mentor within 24-48 hours."
        }
        
    except Exception as e:
        logger.error(f"Error processing mentor request: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to process mentor request. Please try again.")

# Include the router in the main app
app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)

@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()