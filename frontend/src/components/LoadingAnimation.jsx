import React, { useState, useEffect } from 'react';
import { Brain, Lightbulb, Target, Sparkles } from 'lucide-react';
import { loadingMessages } from '../data/mock';

const LoadingAnimation = () => {
  const [currentMessageIndex, setCurrentMessageIndex] = useState(0);
  const [dots, setDots] = useState('');

  useEffect(() => {
    const messageInterval = setInterval(() => {
      setCurrentMessageIndex((prev) => (prev + 1) % loadingMessages.length);
    }, 2000);

    const dotsInterval = setInterval(() => {
      setDots((prev) => (prev.length >= 3 ? '' : prev + '.'));
    }, 500);

    return () => {
      clearInterval(messageInterval);
      clearInterval(dotsInterval);
    };
  }, []);

  const icons = [Brain, Lightbulb, Target, Sparkles];
  const IconComponent = icons[currentMessageIndex % icons.length];

  return (
    <div className="flex flex-col items-center justify-center py-16 space-y-8">
      {/* Animated Icon */}
      <div className="relative">
        <div className="absolute inset-0 bg-gradient-to-r from-emerald-400 to-sky-400 rounded-full blur-xl animate-pulse opacity-30"></div>
        <div className="relative bg-gradient-to-br from-emerald-500 to-sky-500 p-6 rounded-full shadow-2xl">
          <IconComponent className="w-12 h-12 text-white animate-bounce" />
        </div>
      </div>

      {/* Loading Message */}
      <div className="text-center space-y-2">
        <h3 className="text-2xl font-semibold text-slate-800">
          {loadingMessages[currentMessageIndex]}{dots}
        </h3>
        <p className="text-slate-600">
          Our AI is analyzing your interests to create your personalized career roadmap
        </p>
      </div>

      {/* Progress Animation */}
      <div className="w-64 h-2 bg-slate-200 rounded-full overflow-hidden">
        <div className="h-full bg-gradient-to-r from-emerald-500 via-sky-500 to-yellow-500 animate-pulse rounded-full"></div>
      </div>

      {/* Floating Elements */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-emerald-400 rounded-full animate-ping opacity-60"></div>
        <div className="absolute top-1/3 right-1/3 w-1 h-1 bg-sky-400 rounded-full animate-ping animation-delay-1000 opacity-60"></div>
        <div className="absolute bottom-1/3 left-1/3 w-1.5 h-1.5 bg-yellow-400 rounded-full animate-ping animation-delay-2000 opacity-60"></div>
      </div>
    </div>
  );
};

export default LoadingAnimation;