
import React, { useState, useRef, useEffect } from 'react';
import { Send, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import VoiceInput from './VoiceInput';

interface QuickFilter {
  label: string;
  action: () => void;
}

interface EnhancedSearchChatProps {
  initialQuery?: string;
  searchType?: string;
  resultCount: number;
  quickFilters: QuickFilter[];
}

interface ChatMessage {
  id: string;
  type: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

const EnhancedSearchChat = ({ initialQuery = '', searchType = 'chat', resultCount, quickFilters }: EnhancedSearchChatProps) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [currentMessage, setCurrentMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Initialize chat with welcome message
  useEffect(() => {
    const welcomeMessage: ChatMessage = {
      id: 'welcome',
      type: 'assistant',
      content: initialQuery 
        ? `I found ${resultCount} cruises based on your search "${initialQuery}". Let me know if you'd like to refine your search or ask about specific cruise details!`
        : `Welcome! I'm here to help you find the perfect cruise. I can search by destination, dates, cruise lines, or any specific preferences you have.`,
      timestamp: new Date()
    };
    setMessages([welcomeMessage]);
  }, [initialQuery, resultCount]);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async () => {
    if (!currentMessage.trim()) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      type: 'user',
      content: currentMessage,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setCurrentMessage('');
    setIsTyping(true);

    // Simulate AI response with more contextual responses
    setTimeout(() => {
      const responses = [
        "I can help you filter these results. What's most important to you - price, destination, or ship amenities?",
        "Let me refine your search. Are you looking for a specific cruise line or departure port?",
        "I can show you cruises with the best value. Would you like to see family-friendly options or adult-only experiences?",
        "Based on your preferences, I can recommend cruises with excellent ratings and reviews.",
        "I noticed you're interested in that route. Would you like to see similar itineraries or different departure dates?",
        "That's a great choice! I can help you compare prices across different sailing dates for the same itinerary."
      ];

      const aiResponse: ChatMessage = {
        id: (Date.now() + 1).toString(),
        type: 'assistant',
        content: responses[Math.floor(Math.random() * responses.length)],
        timestamp: new Date()
      };

      setMessages(prev => [...prev, aiResponse]);
      setIsTyping(false);
    }, 1500);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleQuickFilter = (filter: QuickFilter) => {
    filter.action();
    const filterMessage: ChatMessage = {
      id: Date.now().toString(),
      type: 'user',
      content: `Applied filter: ${filter.label}`,
      timestamp: new Date()
    };
    setMessages(prev => [...prev, filterMessage]);
  };

  const handleVoiceTranscript = (transcript: string) => {
    setCurrentMessage(transcript);
  };

  return (
    <div className="h-full flex flex-col bg-white">
      {/* Chat Header */}
      <div className="p-3 border-b border-border-gray bg-gradient-to-r from-ocean-blue to-deep-navy text-white flex-shrink-0">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4" />
          <h3 className="font-medium text-sm">Cruise Assistant</h3>
        </div>
        <p className="text-xs text-blue-100 mt-1">Ask me anything about cruises, destinations, or booking</p>
      </div>

      {/* Quick Filters */}
      <div className="p-3 border-b border-border-gray bg-light-gray flex-shrink-0">
        <div className="flex flex-wrap gap-2">
          {quickFilters.slice(0, 3).map((filter, index) => (
            <button
              key={index}
              onClick={() => handleQuickFilter(filter)}
              className="text-xs px-2 py-1 bg-white border border-border-gray rounded-full hover:bg-ocean-blue hover:text-white transition-colors"
            >
              {filter.label}
            </button>
          ))}
        </div>
      </div>

      {/* Chat Messages - Flexible with proper scrolling */}
      <div className="flex-1 overflow-y-auto p-3 space-y-3 min-h-0">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[80%] p-2 rounded-lg text-sm ${
                message.type === 'user'
                  ? 'bg-ocean-blue text-white ml-4'
                  : 'bg-light-gray text-charcoal mr-4'
              }`}
            >
              {message.content}
            </div>
          </div>
        ))}
        
        {isTyping && (
          <div className="flex justify-start">
            <div className="bg-light-gray text-charcoal p-2 rounded-lg text-sm mr-4">
              <div className="flex gap-1">
                <div className="w-2 h-2 bg-slate-gray rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                <div className="w-2 h-2 bg-slate-gray rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                <div className="w-2 h-2 bg-slate-gray rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Chat Input - Fixed at bottom */}
      <div className="p-3 border-t border-border-gray bg-white flex-shrink-0">
        <div className="flex gap-2 items-end">
          <div className="flex-1">
            <Input
              value={currentMessage}
              onChange={(e) => setCurrentMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Ask about cruises, destinations, or dates..."
              className="text-sm"
              disabled={isTyping}
            />
          </div>
          <VoiceInput 
            onTranscript={handleVoiceTranscript}
            isDisabled={isTyping}
          />
          <Button
            onClick={handleSendMessage}
            disabled={!currentMessage.trim() || isTyping}
            size="sm"
            className="bg-ocean-blue hover:bg-deep-navy text-white px-3"
          >
            <Send className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default EnhancedSearchChat;
