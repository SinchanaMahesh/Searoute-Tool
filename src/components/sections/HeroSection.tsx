
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
    <section className="relative h-[78vh] flex items-center justify-center overflow-hidden pt-16">
      {/* Original gradient background */}
      <div className="absolute inset-0">
        <div className="w-full h-full bg-gradient-to-br from-ocean-blue via-deep-navy to-sunset-orange relative">
          <div className="absolute inset-0 bg-gradient-to-br from-ocean-blue/80 via-deep-navy/60 to-sunset-orange/80"></div>
          <div className="absolute inset-0 bg-white/5"></div>
        </div>
      </div>

      {/* Content */}
      <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
        <div className="space-y-4 animate-fade-in">
          {/* Main Headline */}
          <div className="space-y-3">
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white leading-tight">
              <span className="block bg-gradient-to-r from-seafoam-green to-coral-pink bg-clip-text text-transparent">
                Discover Your Perfect
              </span>
              <span className="block bg-gradient-to-r from-seafoam-green to-coral-pink bg-clip-text text-transparent">
                Cruise Experience
              </span>
            </h1>
            <p className="text-base md:text-lg text-white/90 max-w-2xl mx-auto leading-relaxed">
              Describe your dream vacation in your own words. We will find the perfect cruise, 
              flights, and hotels - all in one conversation.
            </p>
          </div>

          {/* Primary AI Chat Interface */}
          <div className="max-w-3xl mx-auto">
            <div className="bg-white/95 backdrop-blur-md rounded-2xl p-4 shadow-level-3">
              {/* AI Chat Header */}
              <div className="flex items-center justify-center gap-2 mb-3">
                <div className="w-5 h-5 bg-gradient-to-r from-ocean-blue to-seafoam-green rounded-full flex items-center justify-center">
                  <Sparkles className="w-3 h-3 text-white" />
                </div>
                <h2 className="text-sm font-semibold text-charcoal">Cruise Assistant</h2>
              </div>

              {/* Main Chat Input */}
              <div className="space-y-3">
                <div className="relative">
                  <Input
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder={isListening ? "🎤 Listening..." : "Tell me about your dream cruise..."}
                    className="w-full h-12 text-sm pl-4 pr-24 border-2 border-ocean-blue/20 focus:border-ocean-blue rounded-xl bg-white"
                    onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                    disabled={isListening}
                  />
                  <div className="absolute right-3 top-1/2 transform -translate-y-1/2 flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleVoiceSearch}
                      className={`h-6 w-6 ${
                        isListening 
                          ? 'bg-coral-pink text-white recording-pulse border-coral-pink' 
                          : 'text-slate-gray border-border-gray hover:border-ocean-blue'
                      } transition-all duration-200`}
                    >
                      <Mic className="w-3 h-3" />
                    </Button>
                    <Button
                      onClick={handleSearch}
                      disabled={!searchQuery.trim() || isListening}
                      size="sm"
                      className="h-6 bg-ocean-blue hover:bg-deep-navy text-white disabled:opacity-50 text-xs px-3"
                    >
                      <Search className="w-3 h-3 mr-1" />
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
                            height: Math.random() * 15 + 8 + 'px',
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
                      className="text-xs h-6 px-3 border-ocean-blue/20 text-ocean-blue hover:bg-ocean-blue hover:text-white transition-colors"
                      onClick={() => setSearchQuery(prompt)}
                    >
                      {prompt}
                    </Button>
                  ))}
                </div>

                {/* Filter Options */}
                <div className="grid grid-cols-3 gap-3 pt-2 border-t border-ocean-blue/20">
                  {/* Destination */}
                  <div>
                    <Select value={selectedDestination} onValueChange={setSelectedDestination}>
                      <SelectTrigger className="h-8 text-xs">
                        <div className="flex items-center gap-1">
                          <MapPin className="w-3 h-3 text-ocean-blue" />
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
                            "h-8 w-full justify-start text-left font-normal text-xs",
                            !dateRange?.from && "text-muted-foreground"
                          )}
                        >
                          <CalendarIcon className="w-3 h-3 text-ocean-blue mr-1" />
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
                      <SelectTrigger className="h-8 text-xs">
                        <div className="flex items-center gap-1">
                          <Clock className="w-3 h-3 text-ocean-blue" />
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
          <div className="flex flex-wrap justify-center items-center gap-4 text-white/70 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-seafoam-green rounded-full flex items-center justify-center">
                <span className="text-xs font-bold text-white">✓</span>
              </div>
              <span>Personalized search powered by AI</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-seafoam-green rounded-full flex items-center justify-center">
                <span className="text-xs font-bold text-white">✓</span>
              </div>
              <span>50,000+ happy travelers</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-seafoam-green rounded-full flex items-center justify-center">
                <span className="text-xs font-bold text-white">✓</span>
              </div>
              <span>Best price guarantee</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
