from fastapi import FastAPI, APIRouter, HTTPException
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pathlib import Path
from pydantic import BaseModel, Field
from typing import List
import uuid
from datetime import datetime

# Import our new models and services
from models.career import CareerAnalysisRequest, CareerAnalysisResponse
from services.gemini_service import GeminiService

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

# Initialize Gemini service
try:
    gemini_service = GeminiService()
    logger = logging.getLogger(__name__)
    logger.info("Gemini service initialized successfully")
except Exception as e:
    logger = logging.getLogger(__name__)
    logger.error(f"Failed to initialize Gemini service: {str(e)}")
    gemini_service = None

# Create the main app without a prefix
app = FastAPI(title="AI Career Pathfinder API")

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
    return {"message": "AI Career Pathfinder API - Ready to discover your future!"}

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

# New Career Analysis endpoint
@api_router.post("/analyze-career", response_model=CareerAnalysisResponse)
async def analyze_career(request: CareerAnalysisRequest):
    """
    Analyze user interests and generate personalized career paths using Gemini AI
    """
    try:
        if not gemini_service:
            raise HTTPException(status_code=503, detail="Career analysis service is currently unavailable")
        
        if not request.userInput or len(request.userInput.strip()) < 5:
            raise HTTPException(status_code=400, detail="Please provide more detailed information about your interests")
        
        # Generate career paths using Gemini
        career_paths_data = gemini_service.analyze_career_interests(request.userInput)
        
        # Convert to Pydantic models
        career_paths = []
        for career_data in career_paths_data:
            career_path = CareerPath(**career_data)
            career_paths.append(career_path)
        
        return CareerAnalysisResponse(careerPaths=career_paths)
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error in career analysis: {str(e)}")
        raise HTTPException(status_code=500, detail="An error occurred while analyzing your career interests. Please try again.")

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