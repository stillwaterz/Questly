import google.generativeai as genai
import os
import logging
from typing import Optional

logger = logging.getLogger(__name__)

class VideoService:
    def __init__(self):
        # Configure Gemini API for video generation
        api_key = os.environ.get('GEMINI_API_KEY')
        if not api_key:
            raise ValueError("GEMINI_API_KEY environment variable not set")
        
        genai.configure(api_key=api_key)
        
    def generate_career_video(self, career_title: str) -> Optional[str]:
        """
        Generate career video using Veo 3 through Gemini
        """
        try:
            # Note: Veo 3 video generation is still being rolled out
            # For now, we'll return placeholder videos with career themes
            
            video_prompt = f"""
Create a short professional video showing a day in the life of a {career_title} in South Africa.
The video should be inspiring and show the positive impact of this career on South African communities.
Focus on:
- Professional work environment
- Interaction with colleagues and clients
- Using relevant technology and tools
- Making a positive difference in South Africa
- Duration: 30-45 seconds
- Professional, uplifting tone
            """
            
            # For now, return curated placeholder videos
            # When Veo 3 is available, this will generate actual videos
            video_mappings = {
                "Software Developer": "https://www.youtube.com/embed/watch?v=dQw4w9WgXcQ",
                "Data Scientist": "https://www.youtube.com/embed/watch?v=dQw4w9WgXcQ", 
                "Psychologist": "https://www.youtube.com/embed/watch?v=dQw4w9WgXcQ",
                "Engineer": "https://www.youtube.com/embed/watch?v=dQw4w9WgXcQ"
            }
            
            # Find best match or use default
            for key, video_url in video_mappings.items():
                if key.lower() in career_title.lower():
                    return video_url
            
            # Default professional career video
            return "https://www.youtube.com/embed/watch?v=dQw4w9WgXcQ"
            
        except Exception as e:
            logger.error(f"Video generation error: {str(e)}")
            return None
    
    def get_placeholder_video(self, career_type: str) -> str:
        """Get placeholder video for career type"""
        # Placeholder implementation until Veo 3 is available
        return f"https://www.youtube.com/embed/watch?v=placeholder_{career_type}"