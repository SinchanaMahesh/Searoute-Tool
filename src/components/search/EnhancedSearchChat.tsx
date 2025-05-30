
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

    // Simulate AI response
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
    <div className="h-full flex flex-col bg-white min-h-0">
      {/* Compact Chat Header */}
      <div className="p-2 border-b border-border-gray bg-gradient-to-r from-ocean-blue to-deep-navy text-white flex-shrink-0">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4" />
          <h3 className="font-medium text-sm">AI Assistant</h3>
        </div>
      </div>

      {/* Compact Quick Filters */}
      <div className="px-2 py-1 border-b border-border-gray bg-light-gray flex-shrink-0">
        <div className="flex flex-wrap gap-1">
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

      {/* Chat Messages - Use flex-1 with overflow */}
      <div className="flex-1 overflow-y-auto p-2 space-y-2 min-h-0">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[85%] p-2 rounded-lg text-xs ${
                message.type === 'user'
                  ? 'bg-ocean-blue text-white ml-2'
                  : 'bg-light-gray text-charcoal mr-2'
              }`}
            >
              {message.content}
            </div>
          </div>
        ))}
        
        {isTyping && (
          <div className="flex justify-start">
            <div className="bg-light-gray text-charcoal p-2 rounded-lg text-xs mr-2">
              <div className="flex gap-1">
                <div className="w-1 h-1 bg-slate-gray rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                <div className="w-1 h-1 bg-slate-gray rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                <div className="w-1 h-1 bg-slate-gray rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Section - Always visible at bottom */}
      <div className="border-t border-border-gray bg-white flex-shrink-0 p-2">
        <div className="flex gap-2 items-center">
          <div className="flex-1">
            <Input
              value={currentMessage}
              onChange={(e) => setCurrentMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Ask about cruises..."
              className="text-xs h-8"
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
            className="bg-ocean-blue hover:bg-deep-navy text-white px-2 h-8"
          >
            <Send className="w-3 h-3" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default EnhancedSearchChat;
