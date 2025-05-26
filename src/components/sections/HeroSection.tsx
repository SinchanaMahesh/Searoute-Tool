
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { MessageCircle, Mic, Search, MapPin, Calendar, Users, Sparkles } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const HeroSection = () => {
  const [isListening, setIsListening] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [destination, setDestination] = useState('');
  const [departureDate, setDepartureDate] = useState('');
  const [guests, setGuests] = useState('2');
  const navigate = useNavigate();

  const handleVoiceSearch = () => {
    setIsListening(!isListening);
    if (!isListening) {
      setTimeout(() => {
        setIsListening(false);
        setSearchQuery("I'm looking for a Caribbean cruise for two people in March");
      }, 3000);
    }
  };

  const handleChatSearch = () => {
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery)}&type=chat`);
    }
  };

  const handleTraditionalSearch = () => {
    const searchParams = new URLSearchParams();
    if (destination) searchParams.append('destination', destination);
    if (departureDate) searchParams.append('departure', departureDate);
    if (guests) searchParams.append('guests', guests);
    searchParams.append('type', 'traditional');
    
    navigate(`/search?${searchParams.toString()}`);
  };

  const quickPrompts = [
    "Find me a Caribbean cruise for 2 people",
    "Mediterranean cruise with balcony",
    "Family cruise with kids activities",
    "Last minute cruise deals"
  ];

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background with animated cruise ship */}
      <div className="absolute inset-0 bg-gradient-to-br from-ocean-blue via-deep-navy to-sunset-orange">
        <div className="absolute inset-0 bg-black/20"></div>
        {/* Animated cruise ship silhouette */}
        <div className="absolute bottom-20 left-10 cruise-float opacity-30">
          <div className="w-32 h-16 bg-white rounded-t-lg relative">
            <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 w-2 h-8 bg-white rounded"></div>
            <div className="absolute -top-6 left-1/3 w-1 h-6 bg-white rounded"></div>
            <div className="absolute -top-6 right-1/3 w-1 h-6 bg-white rounded"></div>
          </div>
        </div>
        {/* Floating elements */}
        <div className="absolute top-1/4 right-1/4 w-3 h-3 bg-seafoam-green rounded-full cruise-float opacity-60"></div>
        <div className="absolute top-1/3 left-1/4 w-2 h-2 bg-coral-pink rounded-full cruise-float opacity-40" style={{animationDelay: '2s'}}></div>
        <div className="absolute bottom-1/3 right-1/3 w-4 h-4 bg-sunset-orange rounded-full cruise-float opacity-50" style={{animationDelay: '4s'}}></div>
      </div>

      {/* Content */}
      <div className="relative z-10 text-center px-4 max-w-6xl mx-auto">
        <div className="space-y-8 animate-fade-in">
          {/* Main Headline */}
          <div className="space-y-4">
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white leading-tight">
              Plan Your
              <span className="block bg-gradient-to-r from-seafoam-green to-coral-pink bg-clip-text text-transparent">
                Perfect Cruise
              </span>
              <span className="block text-2xl md:text-3xl lg:text-4xl font-medium mt-2">
                Just Ask Our AI
              </span>
            </h1>
            <p className="text-lg md:text-xl text-white/90 max-w-2xl mx-auto leading-relaxed">
              Describe your dream vacation in your own words. Our AI will find the perfect cruise, 
              flights, and hotels - all in one conversation.
            </p>
          </div>

          {/* Primary AI Chat Interface */}
          <div className="max-w-4xl mx-auto">
            <div className="bg-white/95 backdrop-blur-md rounded-2xl p-6 md:p-8 shadow-level-3">
              {/* AI Chat Header */}
              <div className="flex items-center justify-center gap-3 mb-6">
                <div className="w-10 h-10 bg-gradient-to-r from-ocean-blue to-seafoam-green rounded-full flex items-center justify-center">
                  <Sparkles className="w-5 h-5 text-white" />
                </div>
                <h2 className="text-xl font-semibold text-charcoal">AI Cruise Assistant</h2>
              </div>

              {/* Main Chat Input */}
              <div className="space-y-4">
                <div className="relative">
                  <Input
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder={isListening ? "🎤 Listening..." : "Tell me about your dream cruise... (e.g., 'Find me a 7-day Caribbean cruise for 2 adults leaving from Miami in March')"}
                    className="w-full h-16 text-lg pl-6 pr-32 border-2 border-ocean-blue/20 focus:border-ocean-blue rounded-xl bg-white"
                    onKeyPress={(e) => e.key === 'Enter' && handleChatSearch()}
                    disabled={isListening}
                  />
                  <div className="absolute right-3 top-1/2 transform -translate-y-1/2 flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleVoiceSearch}
                      className={`${
                        isListening 
                          ? 'bg-coral-pink text-white recording-pulse border-coral-pink' 
                          : 'text-slate-gray border-border-gray hover:border-ocean-blue'
                      } transition-all duration-200`}
                    >
                      <Mic className="w-4 h-4" />
                    </Button>
                    <Button
                      onClick={handleChatSearch}
                      disabled={!searchQuery.trim() || isListening}
                      className="bg-ocean-blue hover:bg-deep-navy text-white disabled:opacity-50"
                    >
                      <MessageCircle className="w-4 h-4 mr-2" />
                      Search
                    </Button>
                  </div>
                </div>

                {/* Voice feedback */}
                {isListening && (
                  <div className="flex items-center justify-center">
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

                {/* Quick Prompts */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {quickPrompts.map((prompt, index) => (
                    <Button
                      key={index}
                      variant="outline"
                      className="text-left h-auto p-4 border-ocean-blue/20 text-ocean-blue hover:bg-ocean-blue hover:text-white transition-colors justify-start"
                      onClick={() => setSearchQuery(prompt)}
                    >
                      <MessageCircle className="w-4 h-4 mr-3 flex-shrink-0" />
                      <span className="text-sm">{prompt}</span>
                    </Button>
                  ))}
                </div>
              </div>

              {/* Traditional Search - Always Visible */}
              <div className="mt-8 pt-6 border-t border-border-gray">
                <div className="text-center mb-4">
                  <h3 className="text-lg font-medium text-charcoal mb-2">Or search traditionally</h3>
                  <p className="text-sm text-slate-gray">Use our classic search form</p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  {/* Destination */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-charcoal flex items-center">
                      <MapPin className="w-4 h-4 mr-1 text-ocean-blue" />
                      Destination
                    </label>
                    <Input 
                      placeholder="Caribbean, Mediterranean..."
                      value={destination}
                      onChange={(e) => setDestination(e.target.value)}
                      className="border-0 bg-light-gray focus:bg-white"
                    />
                  </div>
                  
                  {/* Dates */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-charcoal flex items-center">
                      <Calendar className="w-4 h-4 mr-1 text-ocean-blue" />
                      Departure
                    </label>
                    <Input 
                      type="date"
                      value={departureDate}
                      onChange={(e) => setDepartureDate(e.target.value)}
                      className="border-0 bg-light-gray focus:bg-white"
                    />
                  </div>
                  
                  {/* Guests */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-charcoal flex items-center">
                      <Users className="w-4 h-4 mr-1 text-ocean-blue" />
                      Guests
                    </label>
                    <select 
                      value={guests}
                      onChange={(e) => setGuests(e.target.value)}
                      className="w-full px-3 py-2 bg-light-gray rounded-lg border-0 focus:bg-white focus:outline-none focus:ring-2 focus:ring-ocean-blue"
                    >
                      <option value="1">1 Guest</option>
                      <option value="2">2 Guests</option>
                      <option value="3">3 Guests</option>
                      <option value="4">4 Guests</option>
                      <option value="5+">5+ Guests</option>
                    </select>
                  </div>
                  
                  {/* Search Button */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-transparent">Search</label>
                    <Button 
                      onClick={handleTraditionalSearch}
                      className="w-full h-10 bg-sunset-orange hover:bg-orange-600 text-white rounded-lg transition-all duration-200"
                    >
                      <Search className="w-4 h-4 mr-2" />
                      Search
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Trust Indicators */}
          <div className="flex flex-wrap justify-center items-center gap-8 text-white/70 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 bg-seafoam-green rounded-full flex items-center justify-center">
                <span className="text-xs font-bold text-white">✓</span>
              </div>
              <span>AI-powered personalized search</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 bg-seafoam-green rounded-full flex items-center justify-center">
                <span className="text-xs font-bold text-white">✓</span>
              </div>
              <span>50,000+ happy travelers</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 bg-seafoam-green rounded-full flex items-center justify-center">
                <span className="text-xs font-bold text-white">✓</span>
              </div>
              <span>Best price guarantee</span>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-white/70 animate-bounce">
        <div className="w-6 h-10 border-2 border-white/50 rounded-full flex justify-center">
          <div className="w-1 h-3 bg-white/70 rounded-full mt-2"></div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
