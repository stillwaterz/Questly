# AI Career Pathfinder - Backend Integration Contracts

## API Contracts

### 1. Career Analysis Endpoint
**POST /api/analyze-career**

**Request:**
```json
{
  "userInput": "string - User's passions and interests"
}
```

**Response:**
```json
{
  "careerPaths": [
    {
      "id": "string",
      "title": "string", 
      "persona": {
        "title": "Meet Your Future Self",
        "description": "string - AI generated persona story"
      },
      "dayInLife": {
        "title": "A Day in Your Life",
        "description": "string - AI generated daily routine"
      },
      "weekendQuest": {
        "title": "Your Weekend Quest", 
        "description": "string - AI generated actionable project"
      },
      "realityCheck": {
        "title": "The Reality Check",
        "description": "string - AI generated honest expectations"
      },
      "skills": ["array of required skills"],
      "timeToMastery": "string - time estimate",
      "averageSalary": "string - salary range"
    }
  ]
}
```

## Mock Data to Replace

### Current Mock Implementation:
- **File**: `/app/frontend/src/data/mock.js`
  - `mockCareerPaths` object with predefined career data
  - `getCareerPathsForInput()` function that matches keywords
  - `loadingMessages` array

### Backend Implementation Plan:

1. **Gemini API Integration**
   - Use Google Gemini API with provided key: `AIzaSyAPZuha38p0wl-JZel4aTN33KbYyDksK0U`
   - Engineer comprehensive prompt for career analysis
   - Generate 2-3 relevant career paths based on user input

2. **Prompt Engineering Strategy**
   - Analyze user interests and passions
   - Generate realistic personas with specific names and companies
   - Create detailed day-in-life scenarios
   - Provide actionable weekend projects for skill development
   - Include honest reality checks about challenges and expectations
   - Suggest relevant skills and career timeline

3. **Database Models** (Optional for MVP)
   - User sessions for tracking analysis history
   - Career analysis cache for performance

## Frontend & Backend Integration

### Changes Required in Frontend:

1. **Replace Mock API Calls**
   - Update `VoiceInput.jsx` and `App.js` to call real backend endpoint
   - Remove dependency on `mock.js` 
   - Handle API loading states and errors

2. **API Integration Points**
   - Replace `getCareerPathsForInput()` with actual API call to `/api/analyze-career`
   - Maintain same data structure for seamless component integration
   - Add proper error handling for API failures

3. **Environment Variables**
   - Backend: Store Gemini API key in `.env` file
   - Frontend: Use existing `REACT_APP_BACKEND_URL` for API calls

### Implementation Flow:

1. **Backend Setup**
   - Install Google Generative AI library
   - Create Gemini service class
   - Build career analysis endpoint with engineered prompts
   - Add error handling and validation

2. **Frontend Updates**
   - Replace mock data calls with real API calls
   - Update loading and error states
   - Maintain existing UI/UX experience

3. **Testing & Validation**
   - Test with various input types (technology, healthcare, business, creative)
   - Validate response format matches existing component structure
   - Ensure consistent 2-3 career path generation

## Success Criteria

✅ **Backend**: Real Gemini API generates contextual career analysis  
✅ **Frontend**: Seamless transition from mock to real data  
✅ **User Experience**: Same fast, intuitive interface with real AI insights  
✅ **Quality**: Rich, personalized career guidance in under 60 seconds