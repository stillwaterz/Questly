import React, { useState, useRef } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Mic, MicOff } from 'lucide-react';

const VoiceInput = ({ onInputChange, onSubmit, isProcessing }) => {
  const [input, setInput] = useState('');
  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef(null);

  const startVoiceInput = () => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      alert('Speech recognition is not supported in your browser. Please use text input.');
      return;
    }

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = 'en-US';

    recognition.onstart = () => {
      setIsListening(true);
    };

    recognition.onresult = (event) => {
      let finalTranscript = '';
      let interimTranscript = '';

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcript = event.results[i][0].transcript;
        if (event.results[i].isFinal) {
          finalTranscript += transcript;
        } else {
          interimTranscript += transcript;
        }
      }

      const fullTranscript = finalTranscript || interimTranscript;
      setInput(fullTranscript);
      onInputChange(fullTranscript);
    };

    recognition.onerror = (event) => {
      console.error('Speech recognition error:', event.error);
      setIsListening(false);
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognitionRef.current = recognition;
    recognition.start();
  };

  const stopVoiceInput = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
    setIsListening(false);
  };

  const handleInputChange = (e) => {
    const value = e.target.value;
    setInput(value);
    onInputChange(value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (input.trim() && !isProcessing) {
      onSubmit(input.trim());
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-2xl mx-auto space-y-4">
      <div className="relative">
        <Input
          type="text"
          value={input}
          onChange={handleInputChange}
          placeholder="Tell us about your passions and interests..."
          className="pr-16 h-14 text-lg border-2 border-slate-200 focus:border-emerald-400 focus:ring-emerald-400/20"
          disabled={isProcessing}
        />
        <Button
          type="button"
          onClick={isListening ? stopVoiceInput : startVoiceInput}
          disabled={isProcessing}
          variant="ghost"
          size="icon"
          className={`absolute right-2 top-2 h-10 w-10 rounded-full transition-all duration-200 ${
            isListening 
              ? 'bg-red-100 text-red-600 hover:bg-red-200' 
              : 'bg-sky-100 text-sky-600 hover:bg-sky-200'
          }`}
        >
          {isListening ? <MicOff className="h-5 w-5" /> : <Mic className="h-5 w-5" />}
        </Button>
      </div>
      
      {isListening && (
        <p className="text-sm text-sky-600 animate-pulse flex items-center justify-center gap-2">
          <span className="inline-block w-2 h-2 bg-red-500 rounded-full animate-ping"></span>
          Listening... speak your interests and passions
        </p>
      )}
      
      <Button
        type="submit"
        disabled={!input.trim() || isProcessing}
        className="w-full h-12 text-lg font-medium bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white shadow-lg hover:shadow-xl transition-all duration-200"
      >
        {isProcessing ? 'Discovering Your Future...' : 'Find My Career Path'}
      </Button>
    </form>
  );
};

export default VoiceInput;