import google.generativeai as genai
import os
import json
import logging
from typing import List, Dict, Any
from .sa_data import get_institutions_for_career, get_subjects_for_career, APS_EXPLANATION

# Configure logging
logger = logging.getLogger(__name__)

class GeminiService:
    def __init__(self):
        # Configure Gemini API
        api_key = os.environ.get('GEMINI_API_KEY')
        if not api_key:
            raise ValueError("GEMINI_API_KEY environment variable not set")
        
        genai.configure(api_key=api_key)
        self.model = genai.GenerativeModel('gemini-1.5-flash')
        
    def analyze_career_interests(self, user_input: str) -> List[Dict[str, Any]]:
        """
        Analyze user's interests and generate personalized career paths
        """
        try:
            prompt = self._build_career_analysis_prompt(user_input)
            
            response = self.model.generate_content(
                prompt,
                generation_config=genai.types.GenerationConfig(
                    temperature=0.8,
                    top_p=0.9,
                    max_output_tokens=6000,
                )
            )
            
            # Parse the response
            career_data = self._parse_gemini_response(response.text)
            
            # Enhance with SA-specific data
            enhanced_careers = self._enhance_with_sa_data(career_data)
            
            return enhanced_careers
            
        except Exception as e:
            logger.error(f"Error analyzing career interests: {str(e)}")
            # Return fallback mock data in case of API failure
            return self._get_fallback_careers(user_input)
    
    def generate_career_image(self, career_title: str) -> str:
        """
        Generate line art image of Black African professional
        """
        try:
            image_prompt = f"""
Create a professional line art illustration of a Black African person working as a {career_title}. 
The image should be:
- Simple black line art on white background
- Professional and inspiring
- Showing the person engaged in their work
- Minimalist style, suitable for career guidance
- Representing South African professional excellence
            """
            
            response = self.model.generate_content([image_prompt])
            
            # Note: Gemini 1.5 Flash primarily does text generation
            # For actual image generation, we'd need to use a different model or service
            # For now, return placeholder
            return f"https://api.dicebear.com/7.x/personas/svg?seed={career_title.replace(' ', '')}"
            
        except Exception as e:
            logger.error(f"Error generating image: {str(e)}")
            return f"https://api.dicebear.com/7.x/personas/svg?seed={career_title.replace(' ', '')}"
    
    def _build_career_analysis_prompt(self, user_input: str) -> str:
        """
        Build a comprehensive prompt for South African career analysis
        """
        return f"""
You are a South African career counselor specializing in guiding high school students toward successful careers. 
Based on the user's interests, generate 2 personalized career paths relevant to South Africa and Africa.

User Input: "{user_input}"

For each career path, create a CONCISE analysis with these sections:

1. **Career Title**: Specific job title relevant to SA market
2. **Persona**: Brief inspiring story (2-3 sentences) featuring a Black African professional with a South African name, showing their impact and success
3. **Day in Life**: Concise description (2-3 sentences) of a typical workday
4. **Weekend Quest**: Actionable project with a specific YouTube channel or online course link (must include actual working URL)
5. **Reality Check**: Honest 2-sentence assessment of challenges and salary expectations in South African Rand

**Important Guidelines:**
- Use South African names and contexts
- Include salary ranges in South African Rand (R)
- Focus on opportunities available in South Africa and Africa
- Keep responses concise but inspiring
- Weekend Quest MUST include real YouTube links or course URLs
- Highlight transformation and empowerment themes

**Response Format - JSON Array:**

[
  {{
    "id": "unique-id-1",
    "title": "Career Title",
    "persona": {{
      "title": "Meet Your Future Self",
      "description": "2-3 sentence inspiring story with South African name and context"
    }},
    "dayInLife": {{
      "title": "A Day in Your Life",
      "description": "2-3 sentence description of typical workday"
    }},
    "weekendQuest": {{
      "title": "Your Weekend Quest", 
      "description": "Actionable project description with YouTube link: https://youtube.com/watch?v=EXAMPLE or course link"
    }},
    "realityCheck": {{
      "title": "The Reality Check",
      "description": "2 sentence honest assessment with SA Rand salary range"
    }},
    "skills": ["Essential Skill 1", "Essential Skill 2", "Essential Skill 3"],
    "timeToMastery": "X years",
    "averageSalary": "R XXX,XXX - R XXX,XXX"
  }}
]

Generate exactly 2 career paths. Keep each section concise but impactful.
"""

    def _parse_gemini_response(self, response_text: str) -> List[Dict[str, Any]]:
        """
        Parse Gemini's response and extract career data
        """
        try:
            # Find JSON content in the response
            json_start = response_text.find('[')
            json_end = response_text.rfind(']') + 1
            
            if json_start == -1 or json_end == 0:
                raise ValueError("No JSON array found in response")
            
            json_content = response_text[json_start:json_end]
            career_data = json.loads(json_content)
            
            # Validate the structure
            for career in career_data:
                required_fields = ['id', 'title', 'persona', 'dayInLife', 'weekendQuest', 'realityCheck', 'skills', 'timeToMastery', 'averageSalary']
                for field in required_fields:
                    if field not in career:
                        raise ValueError(f"Missing required field: {field}")
            
            return career_data
            
        except (json.JSONDecodeError, ValueError) as e:
            logger.error(f"Error parsing Gemini response: {str(e)}")
            logger.error(f"Response text: {response_text[:500]}...")
            raise
    
    def _enhance_with_sa_data(self, career_data: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
        """
        Enhance career data with South African specific information
        """
        enhanced_careers = []
        
        for career in career_data:
            # Get SA institutions and subjects
            institutions = get_institutions_for_career(career['title'])
            subjects = get_subjects_for_career(career['title'])
            
            # Generate career image
            image_url = self.generate_career_image(career['title'])
            
            enhanced_career = {
                **career,
                'institutions': institutions,
                'subjects': subjects,
                'imageUrl': image_url,
                'apsExplanation': APS_EXPLANATION
            }
            
            enhanced_careers.append(enhanced_career)
        
        return enhanced_careers
    
    def _get_fallback_careers(self, user_input: str) -> List[Dict[str, Any]]:
        """
        Provide fallback career suggestions if API fails
        """
        return [
            {
                "id": "fallback-sa-1",
                "title": "Software Developer",
                "persona": {
                    "title": "Meet Your Future Self",
                    "description": "You're Nomsa Mbeki, a 27-year-old Senior Software Developer at Naspers in Cape Town. You built the mobile banking app used by 2 million South Africans, helping bridge the digital divide and provide financial inclusion across rural communities."
                },
                "dayInLife": {
                    "title": "A Day in Your Life",
                    "description": "9:00 AM: Stand-up meeting with your agile team. 10:00 AM-12:00 PM: Coding new features using React and Node.js. 2:00 PM-5:00 PM: Code reviews and mentoring junior developers from previously disadvantaged backgrounds."
                },
                "weekendQuest": {
                    "title": "Your Weekend Quest",
                    "description": "Build a simple website using HTML, CSS, and JavaScript. Follow this tutorial: https://youtube.com/watch?v=mU6anWqZJcc - FreeCodeCamp's Responsive Web Design course. Upload your project to GitHub Pages."
                },
                "realityCheck": {
                    "title": "The Reality Check",
                    "description": "High demand in SA with starting salaries R300,000-R500,000. Requires dedication to continuous learning as technology evolves rapidly."
                },
                "skills": ["JavaScript", "React", "Python", "Problem Solving"],
                "timeToMastery": "3-4 years",
                "averageSalary": "R400,000 - R800,000",
                "institutions": get_institutions_for_career("Software Developer"),
                "subjects": get_subjects_for_career("Software Developer"),
                "imageUrl": "https://api.dicebear.com/7.x/personas/svg?seed=SoftwareDeveloper",
                "apsExplanation": APS_EXPLANATION
            }
        ]