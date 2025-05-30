
import React, { useState, useEffect } from 'react';
import { Mic, MicOff } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface VoiceInputProps {
  onTranscript: (text: string) => void;
  isDisabled?: boolean;
}

const VoiceInput = ({ onTranscript, isDisabled = false }: VoiceInputProps) => {
  const [isListening, setIsListening] = useState(false);
  const [recognition, setRecognition] = useState<any>(null);
  const [isSupported, setIsSupported] = useState(false);

  useEffect(() => {
    // Check if Speech Recognition is supported
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    
    if (SpeechRecognition) {
      setIsSupported(true);
      const recognitionInstance = new SpeechRecognition();
      
      recognitionInstance.continuous = false;
      recognitionInstance.interimResults = false;
      recognitionInstance.lang = 'en-US';
      
      recognitionInstance.onstart = () => {
        setIsListening(true);
      };
      
      recognitionInstance.onend = () => {
        setIsListening(false);
      };
      
      recognitionInstance.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        onTranscript(transcript);
      };
      
      recognitionInstance.onerror = (event: any) => {
        console.error('Speech recognition error:', event.error);
        setIsListening(false);
      };
      
      setRecognition(recognitionInstance);
    }

    return () => {
      if (recognition) {
        recognition.abort();
      }
    };
  }, [onTranscript]);

  const toggleListening = () => {
    if (!recognition || isDisabled) return;

    if (isListening) {
      recognition.stop();
    } else {
      recognition.start();
    }
  };

  if (!isSupported) {
    return null; // Don't render if speech recognition is not supported
  }

  return (
    <div className="flex flex-col items-center">
      <Button
        variant="outline"
        size="sm"
        onClick={toggleListening}
        disabled={isDisabled}
        className={`${
          isListening 
            ? 'bg-coral-pink text-white border-coral-pink hover:bg-coral-pink/90' 
            : 'text-slate-gray border-border-gray hover:border-ocean-blue hover:text-ocean-blue'
        } transition-all duration-200`}
      >
        {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
      </Button>
      
      {/* Voice feedback visualization */}
      {isListening && (
        <div className="mt-2 flex items-center gap-1">
          {Array.from({ length: 5 }).map((_, i) => (
            <div
              key={i}
              className="w-1 bg-coral-pink rounded-full animate-pulse"
              style={{
                height: Math.random() * 12 + 8 + 'px',
                animationDelay: i * 0.1 + 's',
                animationDuration: '0.5s'
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default VoiceInput;
