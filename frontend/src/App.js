import React, { useState, useEffect } from 'react';
import './App.css';
import Navbar from './components/Navbar';
import AboutSection from './components/AboutSection';
import ContactSection from './components/ContactSection';
import VoiceInput from './components/VoiceInput';
import LoadingAnimation from './components/LoadingAnimation';
import CareerCard from './components/CareerCard';
import { Button } from './components/ui/button';
import { ArrowLeft, Compass, Sparkles } from 'lucide-react';
import { Toaster } from './components/ui/toaster';
import authService from './services/authService';
import axios from 'axios';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

function App() {
  const [currentInput, setCurrentInput] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [careerPaths, setCareerPaths] = useState([]);
  const [showResults, setShowResults] = useState(false);
  const [error, setError] = useState(null);
  const [user, setUser] = useState(null);
  const [currentSection, setCurrentSection] = useState('home');
  const [isAuthLoading, setIsAuthLoading] = useState(true);

  useEffect(() => {
    initializeAuth();
  }, []);

  const initializeAuth = async () => {
    setIsAuthLoading(true);
    
    try {
      // Check for existing session
      const user = await authService.getCurrentUser();
      if (user) {
        setUser(user);
      }
    } catch (error) {
      console.error('Failed to get current user:', error);
    }
    
    setIsAuthLoading(false);
  };

  const handleInputChange = (input) => {
    setCurrentInput(input);
    setError(null);
  };

  const handleSubmit = async (input) => {
    setIsProcessing(true);
    setShowResults(false);
    setError(null);
    
    try {
      const response = await axios.post(`${API}/analyze-career`, {
        userInput: input
      });
      
      setCareerPaths(response.data.careerPaths);
      setShowResults(true);
    } catch (err) {
      console.error('Career analysis error:', err);
      setError(err.response?.data?.detail || 'Failed to analyze career interests. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleStartOver = () => {
    setCurrentInput('');
    setCareerPaths([]);
    setShowResults(false);
    setIsProcessing(false);
    setError(null);
    setCurrentSection('home');
  };

  const handleLogin = (userData) => {
    setUser(userData);
  };

  const handleLogout = () => {
    setUser(null);
  };

  const renderCurrentSection = () => {
    switch(currentSection) {
      case 'about':
        return <AboutSection />;
      case 'contact':
        return <ContactSection />;
      default:
        return renderHomeSection();
    }
  };

  const renderHomeSection = () => {
    return (
      <main className="max-w-6xl mx-auto px-4">
        {!showResults && !isProcessing && (
          <>
            {/* Hero Section */}
            <div className="text-center py-16">
              <div className="flex items-center justify-center gap-3 mb-6">
                <div className="p-4 bg-gradient-to-br from-emerald-500 to-sky-500 rounded-2xl shadow-lg">
                  <Compass className="w-12 h-12 text-white" />
                </div>
                <div>
                  <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-emerald-600 via-sky-600 to-yellow-600 bg-clip-text text-transparent">
                    Questly
                  </h1>
                  <p className="text-lg text-slate-600 -mt-2">Career Discovery for Africa</p>
                </div>
                <Sparkles className="w-12 h-12 text-yellow-500" />
              </div>
              
              <h2 className="text-2xl md:text-3xl font-bold text-slate-800 mb-4">
                Discover Your Future in 60 Seconds
              </h2>
              <p className="text-xl text-slate-600 max-w-3xl mx-auto mb-8">
                Get personalized career guidance with South African qualifications, APS requirements, 
                and pathways designed for African success stories.
              </p>

              {user && (
                <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-4 mb-8 max-w-md mx-auto">
                  <p className="text-emerald-700">
                    Welcome back, <span className="font-semibold">{user.name}</span>! 
                    Ready to explore new career possibilities?
                  </p>
                </div>
              )}
            </div>

            <VoiceInput 
              onInputChange={handleInputChange}
              onSubmit={handleSubmit}
              isProcessing={isProcessing}
            />
            
            {/* Error Message */}
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-center mt-8">
                <p className="text-red-700">{error}</p>
                <Button
                  onClick={() => setError(null)}
                  variant="outline"
                  size="sm"
                  className="mt-2"
                >
                  Try Again
                </Button>
              </div>
            )}
            
            {/* Example prompts */}
            <div className="text-center mt-8">
              <p className="text-sm text-slate-500 mb-4">Try something like:</p>
              <div className="flex flex-wrap justify-center gap-2">
                {[
                  "I love helping people and psychology",
                  "I'm passionate about technology and coding", 
                  "I want to start my own business in Africa",
                  "I enjoy creative design and problem-solving"
                ].map((example, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setCurrentInput(example);
                      handleSubmit(example);
                    }}
                    className="text-xs hover:bg-slate-100 border-slate-300"
                  >
                    "{example}"
                  </Button>
                ))}
              </div>
            </div>
          </>
        )}

        {isProcessing && <LoadingAnimation />}

        {showResults && careerPaths.length > 0 && (
          <div className="space-y-8 py-8">
            {/* Back Button */}
            <div className="flex justify-between items-center">
              <Button
                onClick={handleStartOver}
                variant="outline"
                className="flex items-center gap-2"
              >
                <ArrowLeft className="w-4 h-4" />
                Explore Different Interests
              </Button>
              <div className="text-right">
                <p className="text-sm text-slate-600">
                  Based on: <span className="font-medium">"{currentInput}"</span>
                </p>
              </div>
            </div>

            {/* Results Header */}
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-slate-800 mb-2">
                Your Personalized South African Career Paths
              </h2>
              <p className="text-slate-600">
                We've identified {careerPaths.length} career{careerPaths.length > 1 ? 's' : ''} that align with your interests and the African market
              </p>
            </div>

            {/* Career Cards */}
            <div className="space-y-12">
              {careerPaths.map((career, index) => (
                <CareerCard key={career.id} career={career} index={index} />
              ))}
            </div>

            {/* Footer CTA */}
            <div className="text-center py-8">
              <Button
                onClick={handleStartOver}
                size="lg"
                className="bg-gradient-to-r from-emerald-500 to-sky-500 hover:from-emerald-600 hover:to-sky-600 text-white shadow-lg hover:shadow-xl transition-all duration-200"
              >
                Discover More Career Paths
              </Button>
            </div>
          </div>
        )}
      </main>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50">
      <Navbar 
        user={user} 
        onLogin={handleLogin} 
        onLogout={handleLogout}
        currentSection={currentSection}
        onSectionChange={setCurrentSection}
      />
      
      <div className="pt-4">
        {renderCurrentSection()}
      </div>

      {/* Footer */}
      <footer className="text-center mt-16 pt-8 border-t border-slate-200 bg-slate-50">
        <div className="max-w-6xl mx-auto px-4 py-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="w-8 h-8 bg-gradient-to-br from-emerald-500 to-sky-500 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold">Q</span>
            </div>
            <span className="text-xl font-bold text-slate-800">Questly</span>
          </div>
          <p className="text-sm text-slate-500 mb-2">
            Empowering African students to discover their career potential
          </p>
          <p className="text-xs text-slate-400">
            © 2025 Questly. Proudly South African. Built for Africa's future leaders.
          </p>
        </div>
      </footer>

      <Toaster />
    </div>
  );
}

export default App;