import google.generativeai as genai
import os
import json
import logging
from typing import List, Dict, Any

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
                    max_output_tokens=8000,
                )
            )
            
            # Parse the response
            career_data = self._parse_gemini_response(response.text)
            return career_data
            
        except Exception as e:
            logger.error(f"Error analyzing career interests: {str(e)}")
            # Return fallback mock data in case of API failure
            return self._get_fallback_careers(user_input)
    
    def _build_career_analysis_prompt(self, user_input: str) -> str:
        """
        Build a comprehensive prompt for career analysis
        """
        return f"""
You are an expert career counselor and AI advisor. Based on the user's interests and passions, generate 2-3 personalized career paths that align with their stated interests.

User Input: "{user_input}"

For each career path, create a detailed analysis with the following sections:

1. **Career Title**: A specific, realistic job title
2. **Persona Section**: "Meet Your Future Self" - Create a vivid persona with a specific name, age, company, and achievement story that shows impact and success
3. **Day in Life**: "A Day in Your Life" - Detailed hour-by-hour schedule showing what a typical workday looks like
4. **Weekend Quest**: "Your Weekend Quest" - A specific, actionable project they can do this weekend to start building relevant skills
5. **Reality Check**: "The Reality Check" - Honest assessment of challenges, education requirements, competition, and realistic salary expectations
6. **Key Skills**: List 4-6 essential skills needed
7. **Time to Mastery**: Realistic timeline to become proficient
8. **Average Salary Range**: Current market salary range

**Important Guidelines:**
- Make personas feel real and inspiring with specific names, companies, and achievements
- Include specific companies, tools, and technologies where relevant
- Weekend quests should be immediately actionable for a high school student
- Reality checks should be honest about challenges while remaining encouraging
- Salary ranges should be accurate for 2024-2025 market
- Focus on emerging trends and future opportunities in each field

**Response Format:**
Return your response as a valid JSON array with exactly this structure:

[
  {{
    "id": "unique-id-1",
    "title": "Career Title",
    "persona": {{
      "title": "Meet Your Future Self",
      "description": "Detailed persona story with name, company, age, and specific achievements"
    }},
    "dayInLife": {{
      "title": "A Day in Your Life", 
      "description": "Hour-by-hour detailed schedule of a typical workday"
    }},
    "weekendQuest": {{
      "title": "Your Weekend Quest",
      "description": "Specific actionable project for this weekend with clear steps"
    }},
    "realityCheck": {{
      "title": "The Reality Check",
      "description": "Honest assessment of challenges, requirements, and expectations"
    }},
    "skills": ["Skill 1", "Skill 2", "Skill 3", "Skill 4"],
    "timeToMastery": "X-Y years",
    "averageSalary": "$X,XXX - $X,XXX"
  }}
]

Generate 2-3 career paths that best match the user's interests. Make each one distinct and compelling.
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
    
    def _get_fallback_careers(self, user_input: str) -> List[Dict[str, Any]]:
        """
        Provide fallback career suggestions if API fails
        """
        return [
            {
                "id": "fallback-1",
                "title": "Technology Consultant",
                "persona": {
                    "title": "Meet Your Future Self",
                    "description": "You're Jordan Kim, a 29-year-old Senior Technology Consultant at Deloitte. You help Fortune 500 companies modernize their technology infrastructure and digital processes. Your recent project saved a retail client $2M annually through automation."
                },
                "dayInLife": {
                    "title": "A Day in Your Life",
                    "description": "8:00 AM: Review client requirements and project updates. 9:30 AM: Client video call discussing system architecture. 11:00 AM: Collaborate with development team on solutions. 1:00 PM: Lunch and networking. 2:30 PM: Technical documentation and analysis. 4:00 PM: Stakeholder presentation on recommendations. 6:00 PM: Research emerging technologies and trends."
                },
                "weekendQuest": {
                    "title": "Your Weekend Quest",
                    "description": "Create a simple business process automation using tools like Zapier or Microsoft Power Automate. Choose a repetitive task (like organizing emails or social media posting) and automate it. Document your process and share it on LinkedIn to start building your consulting portfolio."
                },
                "realityCheck": {
                    "title": "The Reality Check",
                    "description": "Technology consulting requires strong analytical and communication skills, plus continuous learning as technologies evolve rapidly. Entry-level positions often involve significant travel and long hours during project implementations. However, salaries start around $75,000-$95,000 with rapid growth potential."
                },
                "skills": ["Problem Solving", "Communication", "Technical Analysis", "Project Management"],
                "timeToMastery": "3-4 years",
                "averageSalary": "$85,000 - $150,000"
            }
        ]