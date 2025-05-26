
import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, Mic, Send, X, Minimize2, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { useNavigate } from 'react-router-dom';

interface Message {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
  isTyping?: boolean;
}

const ChatWidget = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: 'Hi! I\'m your AI cruise assistant. Tell me about your dream vacation and I\'ll help you find the perfect cruise! 🚢',
      isUser: false,
      timestamp: new Date()
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

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
    const query = inputText;
    setInputText('');
    setIsTyping(true);

    // Simulate AI response
    setTimeout(() => {
      const aiResponses = [
        "Great! I found several amazing Caribbean cruises that match your preferences. Let me show you the best options!",
        "Perfect! I've found some wonderful Mediterranean cruises for you. Shall we explore the options?",
        "Excellent choice! Alaska cruises offer breathtaking scenery. I've found some perfect matches for your dates.",
        "I found some fantastic family-friendly cruises with great kids' programs. Let me show you the results!"
      ];

      const randomResponse = aiResponses[Math.floor(Math.random() * aiResponses.length)];
      
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: randomResponse,
        isUser: false,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, aiMessage]);
      setIsTyping(false);
      
      // Navigate to search results after AI response
      setTimeout(() => {
        navigate(`/search?q=${encodeURIComponent(query)}`);
        setIsOpen(false);
      }, 1500);
    }, 1500);
  };

  const handleVoiceInput = () => {
    setIsListening(!isListening);
    // Voice recognition would be implemented here
    if (!isListening) {
      setTimeout(() => {
        setIsListening(false);
        setInputText("I'm looking for a Caribbean cruise for two people in March");
      }, 3000);
    }
  };

  const handleQuickAction = (action: string) => {
    setInputText(action);
  };

  const quickActions = [
    "Find Caribbean cruises",
    "Mediterranean options", 
    "Alaska adventures",
    "Family-friendly cruises"
  ];

  if (!isOpen) {
    return (
      <div className="fixed bottom-6 right-6 z-50">
        <Button
          onClick={() => setIsOpen(true)}
          className="w-16 h-16 rounded-full bg-gradient-to-r from-ocean-blue to-deep-navy hover:from-deep-navy hover:to-ocean-blue text-white shadow-level-3 pulse-glow transition-all duration-300 hover:scale-110"
        >
          <MessageCircle className="w-8 h-8" />
        </Button>
        
        {/* Floating hint for first-time users */}
        <div className="absolute -top-12 -left-20 bg-white px-3 py-2 rounded-lg shadow-level-2 text-sm text-charcoal animate-bounce">
          Ask me anything! 
          <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-full border-4 border-transparent border-t-white"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <Card className={`w-96 shadow-level-4 transition-all duration-300 ${isMinimized ? 'h-16' : 'h-[600px]'}`}>
        {/* Header */}
        <CardHeader className="p-4 bg-gradient-to-r from-ocean-blue to-deep-navy text-white rounded-t-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-seafoam-green rounded-full flex items-center justify-center animate-pulse">
                <span className="text-sm font-bold">AI</span>
              </div>
              <div>
                <div className="font-semibold">Cruise Assistant</div>
                <div className="text-xs text-white/80">Ready to help you find the perfect cruise</div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsMinimized(!isMinimized)}
                className="text-white hover:bg-white/20"
              >
                <Minimize2 className="w-4 h-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsOpen(false)}
                className="text-white hover:bg-white/20"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </CardHeader>

        {!isMinimized && (
          <CardContent className="p-0 flex flex-col h-[calc(600px-80px)]">
            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.isUser ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[80%] px-4 py-3 rounded-2xl ${
                      message.isUser
                        ? 'bg-ocean-blue text-white rounded-br-sm shadow-level-1'
                        : 'bg-light-gray text-charcoal rounded-bl-sm border border-border-gray'
                    }`}
                  >
                    <p className="text-sm leading-relaxed">{message.text}</p>
                    <p className="text-xs opacity-70 mt-2">
                      {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                </div>
              ))}
              
              {isTyping && (
                <div className="flex justify-start">
                  <div className="bg-light-gray text-charcoal px-4 py-3 rounded-2xl rounded-bl-sm border border-border-gray">
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

            {/* Quick Actions */}
            {messages.length === 1 && (
              <div className="px-4 pb-2">
                <div className="text-xs text-slate-gray mb-3 font-medium">Try asking me about:</div>
                <div className="grid grid-cols-2 gap-2">
                  {quickActions.map((action, index) => (
                    <Button
                      key={index}
                      variant="outline"
                      size="sm"
                      className="text-xs h-9 border-ocean-blue/20 text-ocean-blue hover:bg-ocean-blue hover:text-white transition-colors"
                      onClick={() => handleQuickAction(action)}
                    >
                      {action}
                    </Button>
                  ))}
                </div>
              </div>
            )}

            {/* Input */}
            <div className="p-4 border-t border-border-gray bg-pearl-white">
              <div className="flex items-center gap-3">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleVoiceInput}
                  className={`${
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
                  placeholder={isListening ? "🎤 Listening..." : "Describe your perfect cruise..."}
                  className="flex-1 border-border-gray focus:border-ocean-blue"
                  onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                  disabled={isListening}
                />
                <Button
                  onClick={handleSendMessage}
                  disabled={!inputText.trim() || isListening}
                  className="bg-ocean-blue hover:bg-deep-navy text-white disabled:opacity-50"
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
          </CardContent>
        )}
      </Card>
    </div>
  );
};

export default ChatWidget;
