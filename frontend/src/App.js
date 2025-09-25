import React, { useState } from 'react';
import './App.css';
import VoiceInput from './components/VoiceInput';
import LoadingAnimation from './components/LoadingAnimation';
import CareerCard from './components/CareerCard';
import { Button } from './components/ui/button';
import { getCareerPathsForInput } from './data/mock';
import { ArrowLeft, Compass, Sparkles } from 'lucide-react';

function App() {
  const [currentInput, setCurrentInput] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [careerPaths, setCareerPaths] = useState([]);
  const [showResults, setShowResults] = useState(false);

  const handleInputChange = (input) => {
    setCurrentInput(input);
  };

  const handleSubmit = async (input) => {
    setIsProcessing(true);
    setShowResults(false);
    
    // Simulate AI processing time
    setTimeout(() => {
      const paths = getCareerPathsForInput(input);
      setCareerPaths(paths);
      setIsProcessing(false);
      setShowResults(true);
    }, 3000);
  };

  const handleStartOver = () => {
    setCurrentInput('');
    setCareerPaths([]);
    setShowResults(false);
    setIsProcessing(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <header className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="p-3 bg-gradient-to-br from-emerald-500 to-sky-500 rounded-2xl shadow-lg">
              <Compass className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-emerald-600 via-sky-600 to-yellow-600 bg-clip-text text-transparent">
              AI Career Pathfinder
            </h1>
            <Sparkles className="w-8 h-8 text-yellow-500" />
          </div>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto">
            Discover your personalized career roadmap in under 60 seconds. 
            Tell us your passions, and we'll chart your path to success.
          </p>
        </header>

        {/* Main Content */}
        <main className="max-w-6xl mx-auto">
          {!showResults && !isProcessing && (
            <div className="space-y-8">
              <VoiceInput 
                onInputChange={handleInputChange}
                onSubmit={handleSubmit}
                isProcessing={isProcessing}
              />
              
              {/* Example prompts */}
              <div className="text-center">
                <p className="text-sm text-slate-500 mb-4">Try saying something like:</p>
                <div className="flex flex-wrap justify-center gap-2">
                  {[
                    "I love helping people and solving problems",
                    "I'm interested in technology and coding", 
                    "I want to start my own business someday",
                    "I enjoy creative design and user experience"
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
            </div>
          )}

          {isProcessing && <LoadingAnimation />}

          {showResults && careerPaths.length > 0 && (
            <div className="space-y-8">
              {/* Back Button */}
              <div className="flex justify-between items-center">
                <Button
                  onClick={handleStartOver}
                  variant="outline"
                  className="flex items-center gap-2"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Try Different Interests
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
                  Your Personalized Career Paths
                </h2>
                <p className="text-slate-600">
                  We've identified {careerPaths.length} career{careerPaths.length > 1 ? 's' : ''} that align with your interests
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
                  Explore More Career Paths
                </Button>
              </div>
            </div>
          )}
        </main>

        {/* Footer */}
        <footer className="text-center mt-16 pt-8 border-t border-slate-200">
          <p className="text-sm text-slate-500">
            Powered by AI • Designed for your future success
          </p>
        </footer>
      </div>
    </div>
  );
}

export default App;