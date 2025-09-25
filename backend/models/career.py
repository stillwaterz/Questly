from pydantic import BaseModel, Field
from typing import List, Dict, Any
import uuid

class PersonaSection(BaseModel):
    title: str = "Meet Your Future Self"
    description: str

class DayInLifeSection(BaseModel):
    title: str = "A Day in Your Life"
    description: str

class WeekendQuestSection(BaseModel):
    title: str = "Your Weekend Quest"
    description: str

class RealityCheckSection(BaseModel):
    title: str = "The Reality Check"
    description: str

class CareerPath(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    title: str
    persona: PersonaSection
    dayInLife: DayInLifeSection
    weekendQuest: WeekendQuestSection
    realityCheck: RealityCheckSection
    skills: List[str]
    timeToMastery: str
    averageSalary: str

class CareerAnalysisRequest(BaseModel):
    userInput: str

class CareerAnalysisResponse(BaseModel):
    careerPaths: List[CareerPath]