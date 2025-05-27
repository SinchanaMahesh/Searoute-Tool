
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
import type { DateRange } from 'react-day-picker';

const HeroSection = () => {
  const [isListening, setIsListening] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDestination, setSelectedDestination] = useState('');
  const [selectedLength, setSelectedLength] = useState('');
  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: new Date(),
    to: new Date(new Date().setMonth(new Date().getMonth() + 3))
  });
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
    if (dateRange?.from) {
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
      {/* Background with AI-generated cruise collage */}
      <div className="absolute inset-0">
        <img 
          src="https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=1920&h=1080&fit=crop&crop=center"
          alt="Ocean cruise destination collage"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-ocean-blue/80 via-deep-navy/70 to-sunset-orange/60"></div>
        <div className="absolute inset-0 bg-black/30"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
        <div className="space-y-6 animate-fade-in">
          {/* Main Headline */}
          <div className="space-y-3">
            <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold text-white leading-tight">
              <span className="block bg-gradient-to-r from-seafoam-green to-coral-pink bg-clip-text text-transparent">
                Discover Your Perfect Human Experience
              </span>
            </h1>
            <p className="text-base md:text-lg text-white/90 max-w-2xl mx-auto leading-relaxed">
              Describe your dream vacation in your own words. We will find the perfect cruise, 
              flights, and hotels - all in one conversation.
            </p>
          </div>

          {/* Primary AI Chat Interface */}
          <div className="max-w-3xl mx-auto">
            <div className="bg-white/95 backdrop-blur-md rounded-2xl p-5 shadow-level-3">
              {/* AI Chat Header */}
              <div className="flex items-center justify-center gap-3 mb-4">
                <div className="w-8 h-8 bg-gradient-to-r from-ocean-blue to-seafoam-green rounded-full flex items-center justify-center">
                  <Sparkles className="w-4 h-4 text-white" />
                </div>
                <h2 className="text-lg font-semibold text-charcoal">Cruise Assistant</h2>
              </div>

              {/* Main Chat Input */}
              <div className="space-y-3">
                <div className="relative">
                  <Input
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder={isListening ? "🎤 Listening..." : "Tell me about your dream cruise..."}
                    className="w-full h-14 text-base pl-5 pr-28 border-2 border-ocean-blue/20 focus:border-ocean-blue rounded-xl bg-white"
                    onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                    disabled={isListening}
                  />
                  <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex gap-1">
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
                      size="sm"
                      className="bg-ocean-blue hover:bg-deep-navy text-white disabled:opacity-50"
                    >
                      <Search className="w-4 h-4 mr-1" />
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
                      className="text-xs h-7 px-3 border-ocean-blue/20 text-ocean-blue hover:bg-ocean-blue hover:text-white transition-colors"
                      onClick={() => setSearchQuery(prompt)}
                    >
                      {prompt}
                    </Button>
                  ))}
                </div>

                {/* Filter Options */}
                <div className="grid grid-cols-3 gap-3 pt-3 border-t border-ocean-blue/20">
                  {/* Destination */}
                  <div>
                    <Select value={selectedDestination} onValueChange={setSelectedDestination}>
                      <SelectTrigger className="h-9">
                        <div className="flex items-center gap-2">
                          <MapPin className="w-4 h-4 text-ocean-blue" />
                          <SelectValue placeholder="Destination" />
                        </div>
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
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className={cn(
                            "h-9 w-full justify-start text-left font-normal",
                            !dateRange?.from && "text-muted-foreground"
                          )}
                        >
                          <CalendarIcon className="w-4 h-4 text-ocean-blue mr-2" />
                          {dateRange?.from ? (
                            dateRange.to ? (
                              <>
                                {format(dateRange.from, "MMM dd")} - {format(dateRange.to, "MMM dd")}
                              </>
                            ) : (
                              format(dateRange.from, "MMM dd")
                            )
                          ) : (
                            <span>Dates</span>
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
                    <Select value={selectedLength} onValueChange={setSelectedLength}>
                      <SelectTrigger className="h-9">
                        <div className="flex items-center gap-2">
                          <Clock className="w-4 h-4 text-ocean-blue" />
                          <SelectValue placeholder="Length" />
                        </div>
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
          <div className="flex flex-wrap justify-center items-center gap-6 text-white/70 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-5 h-5 bg-seafoam-green rounded-full flex items-center justify-center">
                <span className="text-xs font-bold text-white">✓</span>
              </div>
              <span>Personalized search powered by AI</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-5 h-5 bg-seafoam-green rounded-full flex items-center justify-center">
                <span className="text-xs font-bold text-white">✓</span>
              </div>
              <span>50,000+ happy travelers</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-5 h-5 bg-seafoam-green rounded-full flex items-center justify-center">
                <span className="text-xs font-bold text-white">✓</span>
              </div>
              <span>Best price guarantee</span>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 text-white/70 animate-bounce">
        <div className="w-5 h-8 border-2 border-white/50 rounded-full flex justify-center">
          <div className="w-1 h-2 bg-white/70 rounded-full mt-1"></div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
