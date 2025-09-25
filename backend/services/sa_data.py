# South African educational data and institutions

SA_INSTITUTIONS = {
    "universities": [
        {
            "name": "University of Cape Town (UCT)",
            "location": "Cape Town, Western Cape",
            "type": "Public Research University",
            "strengths": ["Medicine", "Engineering", "Business", "Law", "Sciences"]
        },
        {
            "name": "University of the Witwatersrand (Wits)",
            "location": "Johannesburg, Gauteng", 
            "type": "Public Research University",
            "strengths": ["Engineering", "Medicine", "Mining", "Business", "Humanities"]
        },
        {
            "name": "Stellenbosch University",
            "location": "Stellenbosch, Western Cape",
            "type": "Public Research University", 
            "strengths": ["Engineering", "Agriculture", "Business", "Medicine", "Sciences"]
        },
        {
            "name": "University of Pretoria (UP)",
            "location": "Pretoria, Gauteng",
            "type": "Public Research University",
            "strengths": ["Engineering", "Veterinary Science", "Law", "Medicine", "Agriculture"]
        },
        {
            "name": "Rhodes University",
            "location": "Makhanda, Eastern Cape",
            "type": "Public University",
            "strengths": ["Journalism", "Law", "Sciences", "Pharmacy", "Commerce"]
        },
        {
            "name": "University of KwaZulu-Natal (UKZN)",
            "location": "Durban/Pietermaritzburg, KZN",
            "type": "Public University",
            "strengths": ["Medicine", "Engineering", "Law", "Agriculture", "Management"]
        }
    ],
    "tvet_colleges": [
        {
            "name": "Central Johannesburg TVET College",
            "location": "Johannesburg, Gauteng",
            "type": "TVET College",
            "strengths": ["Engineering Studies", "Business Studies", "Information Technology", "Tourism"]
        },
        {
            "name": "False Bay TVET College", 
            "location": "Cape Town, Western Cape",
            "type": "TVET College",
            "strengths": ["Engineering", "Business", "Hospitality", "Information Technology"]
        },
        {
            "name": "Durban University of Technology (DUT)",
            "location": "Durban, KwaZulu-Natal",
            "type": "University of Technology",
            "strengths": ["Engineering", "Applied Sciences", "Management", "Arts & Design"]
        }
    ]
}

CAREER_SUBJECTS_MAP = {
    "Software Developer": {
        "essential": ["Mathematics", "Information Technology", "Physical Sciences"],
        "recommended": ["English Home Language", "Life Sciences", "Technical Mathematics"],
        "aps_range": "35-45",
        "min_aps": 35
    },
    "Data Scientist": {
        "essential": ["Mathematics", "Physical Sciences", "Information Technology"],
        "recommended": ["English Home Language", "Mathematical Literacy", "Life Sciences"],
        "aps_range": "40-50",
        "min_aps": 40
    },
    "Clinical Psychologist": {
        "essential": ["English Home Language", "Life Sciences", "Mathematics"],
        "recommended": ["History", "Geography", "Life Orientation"],
        "aps_range": "45-55",
        "min_aps": 45
    },
    "Mechanical Engineer": {
        "essential": ["Mathematics", "Physical Sciences", "Engineering Graphics & Design"],
        "recommended": ["English Home Language", "Technical Mathematics", "Information Technology"],
        "aps_range": "40-50", 
        "min_aps": 40
    },
    "Medical Doctor": {
        "essential": ["Mathematics", "Physical Sciences", "Life Sciences"],
        "recommended": ["English Home Language", "Afrikaans/Other Language"],
        "aps_range": "50-60",
        "min_aps": 50
    },
    "Business Analyst": {
        "essential": ["Mathematics", "English Home Language", "Information Technology"],
        "recommended": ["Accounting", "Business Studies", "Economics"],
        "aps_range": "35-45",
        "min_aps": 35
    }
}

APS_EXPLANATION = """
**APS (Admission Point Score) System:**
- Life Orientation + 6 best subjects (excluding LO)
- Each subject graded 1-7, maximum 600 points total
- Most universities require minimum 30+ APS
- Competitive programmes need 40-60 APS
- Calculate: Add your final matric marks for 7 subjects
"""

def get_institutions_for_career(career_title: str):
    """Get relevant SA institutions for a career path"""
    career_lower = career_title.lower()
    
    if "engineer" in career_lower or "developer" in career_lower or "data scientist" in career_lower:
        return [
            {
                "institution": "University of the Witwatersrand (Wits)",
                "programme": "Bachelor of Science in Engineering/Computer Science", 
                "duration": "4 years",
                "aps_required": "42+",
                "location": "Johannesburg, Gauteng"
            },
            {
                "institution": "University of Cape Town (UCT)",
                "programme": "Bachelor of Science in Computer Science/Engineering",
                "duration": "4 years", 
                "aps_required": "45+",
                "location": "Cape Town, Western Cape"
            },
            {
                "institution": "Central Johannesburg TVET College",
                "programme": "National Diploma in Information Technology",
                "duration": "3 years",
                "aps_required": "30+",
                "location": "Johannesburg, Gauteng"
            }
        ]
    
    elif "psychologist" in career_lower or "counselor" in career_lower:
        return [
            {
                "institution": "University of Cape Town (UCT)",
                "programme": "Bachelor of Social Science in Psychology",
                "duration": "3 years + Honours + Masters + Internship (7-8 years total)",
                "aps_required": "40+", 
                "location": "Cape Town, Western Cape"
            },
            {
                "institution": "University of the Witwatersrand (Wits)",
                "programme": "Bachelor of Arts in Psychology",
                "duration": "3 years + Honours + Masters + Internship (7-8 years total)",
                "aps_required": "38+",
                "location": "Johannesburg, Gauteng"
            }
        ]
    
    elif "medical" in career_lower or "doctor" in career_lower:
        return [
            {
                "institution": "University of Cape Town (UCT)",
                "programme": "Bachelor of Medicine and Bachelor of Surgery (MBChB)",
                "duration": "6 years",
                "aps_required": "50+",
                "location": "Cape Town, Western Cape"
            },
            {
                "institution": "University of the Witwatersrand (Wits)",
                "programme": "Bachelor of Medicine and Bachelor of Surgery (MBChB)", 
                "duration": "6 years",
                "aps_required": "52+",
                "location": "Johannesburg, Gauteng"
            }
        ]
    
    else:
        return [
            {
                "institution": "University of Pretoria (UP)",
                "programme": "Relevant Bachelor's Degree",
                "duration": "3-4 years",
                "aps_required": "35+",
                "location": "Pretoria, Gauteng"
            },
            {
                "institution": "Stellenbosch University", 
                "programme": "Relevant Bachelor's Degree",
                "duration": "3-4 years",
                "aps_required": "38+",
                "location": "Stellenbosch, Western Cape"
            }
        ]

def get_subjects_for_career(career_title: str):
    """Get subject recommendations for a career"""
    career_lower = career_title.lower()
    
    # Find best match in CAREER_SUBJECTS_MAP
    for career_key, subjects in CAREER_SUBJECTS_MAP.items():
        if career_key.lower() in career_lower or any(word in career_lower for word in career_key.lower().split()):
            return subjects
    
    # Default recommendations
    return {
        "essential": ["Mathematics", "English Home Language", "Physical Sciences"],
        "recommended": ["Information Technology", "Life Sciences", "Accounting"],
        "aps_range": "35-45",
        "min_aps": 35
    }