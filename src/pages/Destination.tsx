
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { MapPin, Calendar as CalendarIcon, Clock, MessageCircle, Sparkles, Search, ArrowRight, Ship, Users, Star } from 'lucide-react';
import Header from '@/components/layout/Header';
import FooterSection from '@/components/sections/FooterSection';
import ChatWidget from '@/components/chat/ChatWidget';
import { fetchDestination, fetchCruisesByDestination, fetchCruiseLinesByDestination } from '@/api/mockData';
import type { Destination as DestinationType, CruiseLine, Cruise } from '@/api/mockData';
import type { DateRange } from 'react-day-picker';

const Destination = () => {
  const { destinationId } = useParams<{ destinationId: string }>();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLength, setSelectedLength] = useState('');
  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: new Date(),
    to: new Date(new Date().setMonth(new Date().getMonth() + 3))
  });
  
  // Fetch destination data
  const { data: destination, isLoading: isLoadingDestination } = useQuery({
    queryKey: ['destination', destinationId],
    queryFn: () => fetchDestination(destinationId || ''),
  });
  
  // Fetch cruises for this destination
  const { data: cruises, isLoading: isLoadingCruises } = useQuery({
    queryKey: ['cruisesByDestination', destinationId],
    queryFn: () => fetchCruisesByDestination(destinationId || ''),
  });
  
  // Fetch cruise lines for this destination
  const { data: cruiseLines, isLoading: isLoadingCruiseLines } = useQuery({
    queryKey: ['cruiseLinesByDestination', destinationId],
    queryFn: () => fetchCruiseLinesByDestination(destinationId || ''),
  });

  // Update search query when destination is loaded
  useEffect(() => {
    if (destination) {
      const query = `Find me a ${destination.name} cruise departing in the next 3 months`;
      setSearchQuery(query);
    }
  }, [destination]);

  const handleSearch = () => {
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery)}&destination=${destination?.name}&type=chat`);
    }
  };

  const handleCruiseClick = (cruiseId: number) => {
    navigate(`/cruise/${cruiseId}/book`);
  };

  const lengths = ['3-5 days', '6-7 days', '8-10 days', '11+ days'];

  const updateSearchQuery = () => {
    if (!destination) return;
    
    let parts = [destination.name];
    if (selectedLength) parts.push(`${selectedLength} cruise`);
    if (dateRange?.from) {
      if (dateRange.to) {
        parts.push(`from ${format(dateRange.from, 'MMM dd')} to ${format(dateRange.to, 'MMM dd')}`);
      } else {
        parts.push(`departing ${format(dateRange.from, 'MMM dd')}`);
      }
    }
    
    setSearchQuery(`Find me a ${parts.join(' ')} for 2 people`);
  };

  React.useEffect(() => {
    updateSearchQuery();
  }, [destination, selectedLength, dateRange]);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
    }).format(price);
  };

  const CruiseCard = ({ cruise }: { cruise: Cruise }) => (
    <div 
      className="relative group cursor-pointer bg-white rounded-xl border border-border-gray overflow-hidden shadow-level-1 hover:shadow-level-3 transition-all duration-300 hover:scale-[1.02]"
      onClick={() => handleCruiseClick(cruise.id)}
    >
      <div className="relative aspect-video overflow-hidden">
        <img
          src={cruise.images[0]}
          alt={cruise.shipName}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
        
        <div className="absolute top-3 right-3 bg-ocean-blue text-white px-3 py-1 rounded-full text-sm font-semibold">
          From {formatPrice(cruise.priceFrom)}
        </div>

        {cruise.savings && (
          <div className="absolute top-3 left-3 bg-seafoam-green text-white px-2 py-1 rounded-full text-xs font-medium">
            Save ${cruise.savings}
          </div>
        )}

        {cruise.isPopular && (
          <div className="absolute top-12 left-3 bg-sunset-orange text-white px-2 py-1 rounded-full text-xs font-medium">
            Popular
          </div>
        )}
      </div>

      <div className="p-4">
        <h3 className="text-base font-semibold text-charcoal mb-1">{cruise.shipName}</h3>
        <p className="text-sm text-slate-gray mb-2">{cruise.cruiseLine}</p>

        <div className="flex items-center gap-4 text-sm text-charcoal mb-2">
          <div className="flex items-center gap-1">
            <Calendar className="w-4 h-4 text-slate-gray" />
            <span>{cruise.duration} nights</span>
          </div>
          <div className="flex items-center gap-1">
            <MapPin className="w-4 h-4 text-slate-gray" />
            <span>{cruise.route}</span>
          </div>
        </div>

        <div className="flex items-center gap-2 mb-3">
          <div className="flex items-center gap-1">
            <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
            <span className="text-sm font-medium text-charcoal">{cruise.rating}</span>
          </div>
          <span className="text-sm text-slate-gray">
            ({cruise.reviewCount.toLocaleString()} reviews)
          </span>
        </div>

        <Button className="w-full bg-ocean-blue hover:bg-deep-navy text-white">
          View Details
        </Button>
      </div>
    </div>
  );

  const CruiseLineSection = ({ cruiseLine }: { cruiseLine: CruiseLine }) => {
    const lineCruises = cruises?.filter(c => c.cruiseLineId === cruiseLine.id) || [];
    if (lineCruises.length === 0) return null;
    
    return (
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <img 
              src={cruiseLine.logo} 
              alt={cruiseLine.name} 
              className="w-12 h-12 object-contain rounded-full" 
            />
            <div>
              <h3 className="font-bold text-lg text-charcoal">{cruiseLine.name}</h3>
              <div className="flex items-center gap-2 text-sm">
                <div className="flex items-center">
                  <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  <span className="ml-1 font-medium">{cruiseLine.reviewRating}</span>
                </div>
                <span className="text-slate-gray">({cruiseLine.reviewCount.toLocaleString()} reviews)</span>
              </div>
            </div>
          </div>
          
          <Button variant="outline" className="border-ocean-blue text-ocean-blue hover:bg-ocean-blue hover:text-white">
            View All <ArrowRight className="ml-2 w-4 h-4" />
          </Button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {lineCruises.slice(0, 4).map(cruise => (
            <CruiseCard key={cruise.id} cruise={cruise} />
          ))}
        </div>
      </div>
    );
  };

  if (isLoadingDestination) {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-ocean-blue"></div>
      </div>
    );
  }

  if (!destination) {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Destination not found</h1>
          <Button onClick={() => navigate('/')}>Back to Home</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <Header />
      
      {/* Hero Carousel */}
      <section className="relative pt-16">
        <Carousel className="w-full">
          <CarouselContent>
            {destination.coverImages?.map((image, i) => (
              <CarouselItem key={i} className="w-full">
                <div className="relative h-[60vh] w-full">
                  <img 
                    src={image} 
                    alt={`${destination.name} - Image ${i+1}`} 
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/30"></div>
                  
                  <div className="absolute bottom-0 left-0 right-0 p-6 md:p-12 text-white">
                    <h1 className="text-4xl md:text-5xl font-bold mb-2">{destination.name} Cruises</h1>
                    <p className="text-xl md:text-2xl mb-4">{destination.description}</p>
                    <div className="flex flex-wrap items-center gap-4 text-white/90 text-sm md:text-base">
                      <div className="flex items-center gap-1">
                        <Ship className="w-4 h-4" />
                        <span>{destination.cruiseCount} cruises available</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <MapPin className="w-4 h-4" />
                        <span>Popular ports: {destination.popularPorts.join(', ')}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <CalendarIcon className="w-4 h-4" />
                        <span>Best time to visit: {destination.bestTime}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CarouselItem>
            )) || (
              <CarouselItem key="default" className="w-full">
                <div className="relative h-[60vh] w-full">
                  <img 
                    src={destination.image} 
                    alt={destination.name} 
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/30"></div>
                  
                  <div className="absolute bottom-0 left-0 right-0 p-6 md:p-12 text-white">
                    <h1 className="text-4xl md:text-5xl font-bold mb-2">{destination.name} Cruises</h1>
                    <p className="text-xl md:text-2xl mb-4">{destination.description}</p>
                    <div className="flex flex-wrap items-center gap-4 text-white/90 text-sm md:text-base">
                      <div className="flex items-center gap-1">
                        <Ship className="w-4 h-4" />
                        <span>{destination.cruiseCount} cruises available</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <MapPin className="w-4 h-4" />
                        <span>Popular ports: {destination.popularPorts.join(', ')}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <CalendarIcon className="w-4 h-4" />
                        <span>Best time to visit: {destination.bestTime}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CarouselItem>
            )}
          </CarouselContent>
          <div className="hidden md:block">
            <CarouselPrevious className="left-4" />
            <CarouselNext className="right-4" />
          </div>
        </Carousel>
      </section>

      {/* AI Chat Interface */}
      <section className="py-8 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <div className="bg-white rounded-2xl p-6 shadow-level-2 border border-border-gray">
              <div className="flex items-center justify-center gap-2 mb-4">
                <div className="w-6 h-6 bg-gradient-to-r from-ocean-blue to-seafoam-green rounded-full flex items-center justify-center">
                  <Sparkles className="w-3 h-3 text-white" />
                </div>
                <h2 className="text-lg font-semibold text-charcoal">Find Your Perfect {destination.name} Cruise</h2>
              </div>

              <div className="space-y-4">
                <div className="relative">
                  <Input
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Tell me about your dream cruise..."
                    className="w-full h-12 text-sm pl-4 pr-24 border-2 border-ocean-blue/20 focus:border-ocean-blue rounded-xl bg-white"
                    onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                  />
                  <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                    <Button
                      onClick={handleSearch}
                      size="sm"
                      className="h-8 bg-ocean-blue hover:bg-deep-navy text-white"
                    >
                      <Search className="w-4 h-4 mr-1" />
                      Search
                    </Button>
                  </div>
                </div>

                {/* Filter Options */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {/* Date Range */}
                  <div>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className={cn(
                            "w-full justify-start text-left font-normal",
                            !dateRange?.from && "text-muted-foreground"
                          )}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {dateRange?.from ? (
                            dateRange.to ? (
                              <>
                                {format(dateRange.from, "LLL dd")} - {format(dateRange.to, "LLL dd")}
                              </>
                            ) : (
                              format(dateRange.from, "LLL dd")
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
                      <SelectTrigger>
                        <div className="flex items-center gap-1">
                          <Clock className="w-4 h-4 text-ocean-blue" />
                          <SelectValue placeholder="Cruise Length" />
                        </div>
                      </SelectTrigger>
                      <SelectContent>
                        {lengths.map((length) => (
                          <SelectItem key={length} value={length}>{length}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Chat Button */}
                  <Button 
                    className="bg-ocean-blue hover:bg-deep-navy text-white flex items-center gap-2"
                    onClick={handleSearch}
                  >
                    <MessageCircle className="w-4 h-4" />
                    <span>Start Chat</span>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-8 bg-pearl-white">
        <div className="container mx-auto px-4">
          <Tabs defaultValue="cruises" className="space-y-6">
            <TabsList className="mb-6">
              <TabsTrigger value="cruises">Available Cruises</TabsTrigger>
              <TabsTrigger value="cruise-lines">Cruise Lines</TabsTrigger>
              <TabsTrigger value="ports">Popular Ports</TabsTrigger>
            </TabsList>
            
            <TabsContent value="cruises" className="space-y-6">
              <h2 className="text-2xl font-bold text-charcoal mb-6">Top {destination.name} Cruises</h2>
              
              {isLoadingCruises ? (
                <div className="h-40 flex items-center justify-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-ocean-blue"></div>
                </div>
              ) : cruises && cruises.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {cruises.map(cruise => (
                    <CruiseCard key={cruise.id} cruise={cruise} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 bg-white rounded-lg border border-border-gray">
                  <Ship className="w-12 h-12 mx-auto text-slate-gray mb-4" />
                  <h3 className="text-lg font-medium text-charcoal mb-2">No cruises found</h3>
                  <p className="text-slate-gray">Try adjusting your search criteria</p>
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="cruise-lines">
              <h2 className="text-2xl font-bold text-charcoal mb-6">Cruise Lines Sailing to {destination.name}</h2>
              
              {isLoadingCruiseLines ? (
                <div className="h-40 flex items-center justify-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-ocean-blue"></div>
                </div>
              ) : cruiseLines && cruiseLines.length > 0 ? (
                <div className="space-y-8">
                  {cruiseLines.map(line => (
                    <CruiseLineSection key={line.id} cruiseLine={line} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 bg-white rounded-lg border border-border-gray">
                  <Ship className="w-12 h-12 mx-auto text-slate-gray mb-4" />
                  <h3 className="text-lg font-medium text-charcoal mb-2">No cruise lines found</h3>
                  <p className="text-slate-gray">Try checking back later</p>
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="ports">
              <h2 className="text-2xl font-bold text-charcoal mb-6">Popular Ports in {destination.name}</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {destination.popularPorts.map((port, index) => (
                  <div 
                    key={index}
                    className="bg-white rounded-lg overflow-hidden border border-border-gray shadow-sm hover:shadow-level-2 transition-all"
                  >
                    <div className="h-40 bg-light-gray flex items-center justify-center">
                      <MapPin className="w-12 h-12 text-ocean-blue/30" />
                    </div>
                    <div className="p-4">
                      <h3 className="font-semibold text-lg text-charcoal mb-2">{port}</h3>
                      <p className="text-sm text-slate-gray mb-4">
                        Popular port in {destination.name} with multiple cruise departures
                      </p>
                      <Button variant="outline" className="w-full border-ocean-blue text-ocean-blue hover:bg-ocean-blue hover:text-white">
                        View Port Details
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </section>

      <FooterSection />
      <ChatWidget />
    </div>
  );
};

export default Destination;
