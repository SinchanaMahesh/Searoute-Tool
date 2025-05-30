
import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, Mic, Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface Message {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
  isTyping?: boolean;
}

interface QuickFilter {
  label: string;
  action: () => void;
}

interface SearchResultsChatProps {
  initialQuery: string;
  searchType: string;
  resultCount: number;
  quickFilters?: QuickFilter[];
}

const SearchResultsChat = ({ initialQuery, searchType, resultCount, quickFilters = [] }: SearchResultsChatProps) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Initialize chat with search query
    if (initialQuery) {
      const userMessage: Message = {
        id: '1',
        text: initialQuery,
        isUser: true,
        timestamp: new Date()
      };
      
      const aiMessage: Message = {
        id: '2',
        text: `Great! I found ${resultCount} cruises matching your search. You can see them on the right, and their routes are displayed on the map above. Would you like me to help you narrow down the options or find something more specific?`,
        isUser: false,
        timestamp: new Date()
      };

      setMessages([userMessage, aiMessage]);
    } else {
      const welcomeMessage: Message = {
        id: '1',
        text: `Welcome! I can help you find the perfect cruise from our ${resultCount} available options. What would you like to know about these cruises?`,
        isUser: false,
        timestamp: new Date()
      };
      setMessages([welcomeMessage]);
    }
  }, [initialQuery, resultCount]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async () => {
    if (!inputText.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputText,
      isUser: true,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputText('');
    setIsTyping(true);

    // Simulate AI response
    setTimeout(() => {
      const responses = [
        "I can help you filter these results. What's most important to you - price, destination, or ship amenities?",
        "Let me refine your search. Are you looking for a specific cruise line or departure port?",
        "I can show you cruises with the best value. Would you like to see family-friendly options or adult-only experiences?",
        "Based on your preferences, I can recommend cruises with the best ratings and reviews."
      ];

      const randomResponse = responses[Math.floor(Math.random() * responses.length)];
      
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: randomResponse,
        isUser: false,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, aiMessage]);
      setIsTyping(false);
    }, 1500);
  };

  const handleVoiceInput = () => {
    setIsListening(!isListening);
    if (!isListening) {
      setTimeout(() => {
        setIsListening(false);
        setInputText("Show me cruises under $1000 with family activities");
      }, 3000);
    }
  };

  return (
    <div className="h-full flex flex-col bg-white">
      {/* Chat Header */}
      <div className="flex-shrink-0 p-2 border-b border-border-gray bg-gradient-to-r from-ocean-blue to-deep-navy text-white">
        <div className="flex items-center gap-2">
          <MessageCircle className="w-4 h-4" />
          <div className="font-medium text-sm">Refine your search</div>
        </div>
      </div>

      {/* Input Area - MOVED TO TOP */}
      <div className="flex-shrink-0 p-3 border-b border-border-gray bg-pearl-white">
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleVoiceInput}
            className={`flex-shrink-0 ${
              isListening 
                ? 'bg-coral-pink text-white recording-pulse border-coral-pink' 
                : 'text-slate-gray border-border-gray hover:border-ocean-blue'
            } transition-all duration-200`}
          >
            <Mic className="w-4 h-4" />
          </Button>
          <Input
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder={isListening ? "🎤 Listening..." : "Ask about these cruises..."}
            className="flex-1 border-border-gray focus:border-ocean-blue text-sm"
            onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
            disabled={isListening}
          />
          <Button
            onClick={handleSendMessage}
            disabled={!inputText.trim() || isListening}
            className="flex-shrink-0 bg-ocean-blue hover:bg-deep-navy text-white disabled:opacity-50"
            size="sm"
          >
            <Send className="w-4 h-4" />
          </Button>
        </div>
        
        {/* Voice feedback */}
        {isListening && (
          <div className="mt-2 flex items-center justify-center">
            <div className="flex space-x-1">
              {Array.from({ length: 5 }).map((_, i) => (
                <div
                  key={i}
                  className="w-1 bg-coral-pink rounded-full animate-pulse"
                  style={{
                    height: Math.random() * 20 + 10 + 'px',
                    animationDelay: i * 0.1 + 's'
                  }}
                />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Quick Filters */}
      {quickFilters.length > 0 && (
        <div className="flex-shrink-0 px-3 py-2 border-b border-border-gray bg-pearl-white">
          <div className="text-xs text-slate-gray mb-2 font-medium">Quick filters:</div>
          <div className="flex flex-wrap gap-1">
            {quickFilters.map((filter, index) => (
              <Button
                key={index}
                variant="outline"
                size="sm"
                className="text-xs h-7 border-ocean-blue/30 text-ocean-blue hover:bg-ocean-blue hover:text-white transition-colors"
                onClick={filter.action}
              >
                {filter.label}
              </Button>
            ))}
          </div>
        </div>
      )}

      {/* Messages - Now takes remaining space */}
      <div className="flex-1 overflow-y-auto p-3 space-y-3 min-h-0">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.isUser ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[80%] px-3 py-2 rounded-2xl ${
                message.isUser
                  ? 'bg-ocean-blue text-white rounded-br-sm shadow-level-1'
                  : 'bg-light-gray text-charcoal rounded-bl-sm border border-border-gray'
              }`}
            >
              <p className="text-sm leading-relaxed">{message.text}</p>
              <p className="text-xs opacity-70 mt-1">
                {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </p>
            </div>
          </div>
        ))}
        
        {isTyping && (
          <div className="flex justify-start">
            <div className="bg-light-gray text-charcoal px-3 py-2 rounded-2xl rounded-bl-sm border border-border-gray">
              <div className="flex space-x-1">
                <div className="w-2 h-2 bg-slate-gray rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-slate-gray rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                <div className="w-2 h-2 bg-slate-gray rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>
    </div>
  );
};

export default SearchResultsChat;
