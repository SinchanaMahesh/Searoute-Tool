
import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, Mic, Send, X, Minimize2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader } from '@/components/ui/card';

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
      const aiResponses = [
        "That sounds amazing! I can help you find cruises to the Caribbean. What time of year are you thinking of traveling?",
        "Perfect! I found several Mediterranean cruises that might interest you. Would you prefer a 7-day or 10-day cruise?",
        "Great choice! Alaska cruises are breathtaking. Are you interested in glacier viewing or wildlife watching?",
        "I can definitely help with that! Let me search for family-friendly cruises with kids' clubs and entertainment."
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
          className="w-16 h-16 rounded-full bg-ocean-blue hover:bg-deep-navy text-white shadow-level-3 pulse-glow transition-all duration-300 hover:scale-110"
        >
          <MessageCircle className="w-8 h-8" />
        </Button>
      </div>
    );
  }

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <Card className={`w-96 h-[600px] shadow-level-4 transition-all duration-300 ${isMinimized ? 'h-16' : ''}`}>
        {/* Header */}
        <CardHeader className="p-4 bg-ocean-blue text-white rounded-t-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-seafoam-green rounded-full flex items-center justify-center">
                <span className="text-sm font-bold">AI</span>
              </div>
              <div>
                <div className="font-semibold">Cruise Assistant</div>
                <div className="text-xs text-white/80">Online now</div>
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
                    className={`max-w-[80%] px-4 py-2 rounded-2xl ${
                      message.isUser
                        ? 'bg-ocean-blue text-white rounded-br-sm'
                        : 'bg-light-gray text-charcoal rounded-bl-sm'
                    }`}
                  >
                    <p className="text-sm">{message.text}</p>
                    <p className="text-xs opacity-70 mt-1">
                      {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                </div>
              ))}
              
              {isTyping && (
                <div className="flex justify-start">
                  <div className="bg-light-gray text-charcoal px-4 py-2 rounded-2xl rounded-bl-sm">
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
                <div className="text-xs text-slate-gray mb-2">Quick actions:</div>
                <div className="grid grid-cols-2 gap-2">
                  {quickActions.map((action, index) => (
                    <Button
                      key={index}
                      variant="outline"
                      size="sm"
                      className="text-xs h-8 border-ocean-blue/20 text-ocean-blue hover:bg-ocean-blue hover:text-white"
                      onClick={() => setInputText(action)}
                    >
                      {action}
                    </Button>
                  ))}
                </div>
              </div>
            )}

            {/* Input */}
            <div className="p-4 border-t border-border-gray">
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleVoiceInput}
                  className={`${isListening ? 'bg-coral-pink text-white recording-pulse' : 'text-slate-gray'}`}
                >
                  <Mic className="w-4 h-4" />
                </Button>
                <Input
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  placeholder={isListening ? "Listening..." : "Tell me about your dream cruise..."}
                  className="flex-1"
                  onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                  disabled={isListening}
                />
                <Button
                  onClick={handleSendMessage}
                  disabled={!inputText.trim() || isListening}
                  className="bg-ocean-blue hover:bg-deep-navy text-white"
                >
                  <Send className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        )}
      </Card>
    </div>
  );
};

export default ChatWidget;
