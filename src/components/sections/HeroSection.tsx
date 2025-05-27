
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { MessageCircle, Mic, Search, Sparkles, CalendarIcon, MapPin, Clock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';

const HeroSection = () => {
  const [isListening, setIsListening] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDestination, setSelectedDestination] = useState('');
  const [selectedLength, setSelectedLength] = useState('');
  const [dateRange, setDateRange] = useState<{from?: Date; to?: Date}>({});
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

  const handleSearch = () => {
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery)}&type=chat`);
    }
  };

  const updateSearchQuery = () => {
    let parts = [];
    if (selectedDestination) parts.push(selectedDestination);
    if (selectedLength) parts.push(`${selectedLength} cruise`);
    if (dateRange.from) {
      if (dateRange.to) {
        parts.push(`from ${format(dateRange.from, 'MMM dd')} to ${format(dateRange.to, 'MMM dd')}`);
      } else {
        parts.push(`departing ${format(dateRange.from, 'MMM dd')}`);
      }
    }
    
    if (parts.length > 0) {
      setSearchQuery(`Find me a ${parts.join(' ')} for 2 people`);
    }
  };

  React.useEffect(() => {
    updateSearchQuery();
  }, [selectedDestination, selectedLength, dateRange]);

  const quickPrompts = [
    "Caribbean cruise for 2",
    "Mediterranean with balcony",
    "Family cruise with kids",
    "Last minute deals"
  ];

  const destinations = ['Caribbean', 'Mediterranean', 'Alaska', 'Northern Europe', 'Asia', 'Transatlantic'];
  const lengths = ['3-5 days', '6-7 days', '8-10 days', '11+ days'];

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
      <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
        <div className="space-y-8 animate-fade-in">
          {/* Main Headline */}
          <div className="space-y-4">
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white leading-tight">
              <span className="block bg-gradient-to-r from-seafoam-green to-coral-pink bg-clip-text text-transparent">
                Discover Your Perfect
              </span>
              <span className="block bg-gradient-to-r from-seafoam-green to-coral-pink bg-clip-text text-transparent">
                Human Experience
              </span>
            </h1>
            <p className="text-lg md:text-xl text-white/90 max-w-2xl mx-auto leading-relaxed">
              Describe your dream vacation in your own words. We will find the perfect cruise, 
              flights, and hotels - all in one conversation.
            </p>
          </div>

          {/* Primary AI Chat Interface */}
          <div className="max-w-3xl mx-auto">
            <div className="bg-white/95 backdrop-blur-md rounded-2xl p-6 shadow-level-3">
              {/* AI Chat Header */}
              <div className="flex items-center justify-center gap-3 mb-6">
                <div className="w-10 h-10 bg-gradient-to-r from-ocean-blue to-seafoam-green rounded-full flex items-center justify-center">
                  <Sparkles className="w-5 h-5 text-white" />
                </div>
                <h2 className="text-xl font-semibold text-charcoal">Cruise Assistant</h2>
              </div>

              {/* Main Chat Input */}
              <div className="space-y-4">
                <div className="relative">
                  <Input
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder={isListening ? "🎤 Listening..." : "Tell me about your dream cruise..."}
                    className="w-full h-16 text-lg pl-6 pr-32 border-2 border-ocean-blue/20 focus:border-ocean-blue rounded-xl bg-white"
                    onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
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
                      onClick={handleSearch}
                      disabled={!searchQuery.trim() || isListening}
                      className="bg-ocean-blue hover:bg-deep-navy text-white disabled:opacity-50"
                    >
                      <Search className="w-4 h-4 mr-2" />
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
                <div className="flex flex-wrap justify-center gap-2">
                  {quickPrompts.map((prompt, index) => (
                    <Button
                      key={index}
                      variant="outline"
                      size="sm"
                      className="text-xs h-8 px-3 border-ocean-blue/20 text-ocean-blue hover:bg-ocean-blue hover:text-white transition-colors"
                      onClick={() => setSearchQuery(prompt)}
                    >
                      {prompt}
                    </Button>
                  ))}
                </div>

                {/* Filter Options */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t border-ocean-blue/20">
                  {/* Destination */}
                  <div>
                    <label className="text-sm font-medium text-charcoal mb-2 flex items-center gap-2">
                      <MapPin className="w-4 h-4" />
                      Destination
                    </label>
                    <Select value={selectedDestination} onValueChange={setSelectedDestination}>
                      <SelectTrigger className="h-10">
                        <SelectValue placeholder="Select destination" />
                      </SelectTrigger>
                      <SelectContent>
                        {destinations.map((dest) => (
                          <SelectItem key={dest} value={dest}>{dest}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Date Range */}
                  <div>
                    <label className="text-sm font-medium text-charcoal mb-2 flex items-center gap-2">
                      <CalendarIcon className="w-4 h-4" />
                      Date Range
                    </label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className={cn(
                            "h-10 w-full justify-start text-left font-normal",
                            !dateRange?.from && "text-muted-foreground"
                          )}
                        >
                          {dateRange?.from ? (
                            dateRange.to ? (
                              <>
                                {format(dateRange.from, "LLL dd")} - {format(dateRange.to, "LLL dd")}
                              </>
                            ) : (
                              format(dateRange.from, "LLL dd, y")
                            )
                          ) : (
                            <span>Pick dates</span>
                          )}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          initialFocus
                          mode="range"
                          defaultMonth={dateRange?.from}
                          selected={dateRange}
                          onSelect={setDateRange}
                          numberOfMonths={2}
                          className="pointer-events-auto"
                        />
                      </PopoverContent>
                    </Popover>
                  </div>

                  {/* Length */}
                  <div>
                    <label className="text-sm font-medium text-charcoal mb-2 flex items-center gap-2">
                      <Clock className="w-4 h-4" />
                      Length
                    </label>
                    <Select value={selectedLength} onValueChange={setSelectedLength}>
                      <SelectTrigger className="h-10">
                        <SelectValue placeholder="Select length" />
                      </SelectTrigger>
                      <SelectContent>
                        {lengths.map((length) => (
                          <SelectItem key={length} value={length}>{length}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
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
              <span>Personalized search powered by AI</span>
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
