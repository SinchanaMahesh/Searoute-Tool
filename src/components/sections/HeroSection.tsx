
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { MessageCircle, Mic, Search, MapPin, Calendar, Users } from 'lucide-react';

const HeroSection = () => {
  const [isListening, setIsListening] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const handleVoiceSearch = () => {
    setIsListening(!isListening);
    // Voice recognition would be implemented here
  };

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
              Discover Your
              <span className="block bg-gradient-to-r from-seafoam-green to-coral-pink bg-clip-text text-transparent">
                Perfect Cruise
              </span>
            </h1>
            <p className="text-lg md:text-xl text-white/90 max-w-2xl mx-auto leading-relaxed">
              Let AI plan your dream vacation in minutes. From Caribbean adventures to Mediterranean escapes, 
              find the perfect cruise with our intelligent discovery platform.
            </p>
          </div>

          {/* Search Interface */}
          <div className="max-w-4xl mx-auto">
            <div className="bg-white/95 backdrop-blur-md rounded-2xl p-6 md:p-8 shadow-level-3">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 md:gap-6">
                {/* Destination */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-charcoal flex items-center">
                    <MapPin className="w-4 h-4 mr-1 text-ocean-blue" />
                    Destination
                  </label>
                  <Input 
                    placeholder="Caribbean, Mediterranean..."
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
                    className="border-0 bg-light-gray focus:bg-white"
                  />
                </div>
                
                {/* Guests */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-charcoal flex items-center">
                    <Users className="w-4 h-4 mr-1 text-ocean-blue" />
                    Guests
                  </label>
                  <select className="w-full px-3 py-2 bg-light-gray rounded-lg border-0 focus:bg-white focus:outline-none focus:ring-2 focus:ring-ocean-blue">
                    <option>2 Guests</option>
                    <option>3 Guests</option>
                    <option>4 Guests</option>
                    <option>5+ Guests</option>
                  </select>
                </div>
                
                {/* Search Button */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-transparent">Search</label>
                  <Button 
                    className="w-full h-10 bg-ocean-blue hover:bg-deep-navy text-white rounded-lg transition-all duration-200 hover:shadow-glow"
                  >
                    <Search className="w-4 h-4 mr-2" />
                    Search Cruises
                  </Button>
                </div>
              </div>
              
              {/* AI Chat Option */}
              <div className="mt-6 pt-6 border-t border-border-gray">
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                  <span className="text-slate-gray font-medium">Or let AI help you find the perfect cruise:</span>
                  <div className="flex gap-3">
                    <Button 
                      variant="outline"
                      className="border-ocean-blue text-ocean-blue hover:bg-ocean-blue hover:text-white transition-all duration-200"
                      onClick={handleVoiceSearch}
                    >
                      <Mic className={`w-4 h-4 mr-2 ${isListening ? 'recording-pulse text-coral-pink' : ''}`} />
                      {isListening ? 'Listening...' : 'Voice Search'}
                    </Button>
                    <Button 
                      className="bg-sunset-orange hover:bg-orange-600 text-white transition-all duration-200 hover:shadow-glow-orange"
                    >
                      <MessageCircle className="w-4 h-4 mr-2" />
                      Chat with AI
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
              <span>Trusted by 50,000+ travelers</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 bg-seafoam-green rounded-full flex items-center justify-center">
                <span className="text-xs font-bold text-white">✓</span>
              </div>
              <span>Best price guarantee</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 bg-seafoam-green rounded-full flex items-center justify-center">
                <span className="text-xs font-bold text-white">✓</span>
              </div>
              <span>24/7 support</span>
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
