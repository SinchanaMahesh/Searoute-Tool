
import React, { useRef } from 'react';
import { Button } from '@/components/ui/button';
import { MapPin, Calendar, Ship, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const DestinationCards = () => {
  const navigate = useNavigate();
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const destinations = [
    {
      name: "Caribbean",
      description: "Tropical paradise with pristine beaches",
      image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600",
      cruiseCount: 147,
      averagePrice: "$899",
      popularPorts: ["Cozumel", "Nassau", "St. Thomas"],
      bestTime: "Year-round",
      duration: "7-14 days",
      type: "vertical"
    },
    {
      name: "Mediterranean",
      description: "Historic cities and stunning coastlines",
      image: "https://images.unsplash.com/photo-1533929736458-ca588d08c8be?w=400",
      cruiseCount: 89,
      averagePrice: "$1,299",
      popularPorts: ["Barcelona", "Rome", "Santorini"],
      bestTime: "Apr-Oct",
      duration: "7-12 days",
      type: "horizontal"
    },
    {
      name: "Alaska",
      description: "Glaciers, wildlife, and breathtaking scenery",
      image: "https://images.unsplash.com/photo-1586861203927-800a5acdcc4d?w=400",
      cruiseCount: 34,
      averagePrice: "$1,599",
      popularPorts: ["Juneau", "Ketchikan", "Skagway"],
      bestTime: "May-Sep",
      duration: "7-14 days",
      type: "horizontal"
    },
    {
      name: "Northern Europe",
      description: "Fjords, capitals, and Viking heritage",
      image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=300",
      cruiseCount: 56,
      averagePrice: "$1,799",
      popularPorts: ["Copenhagen", "Stockholm", "Oslo"],
      bestTime: "May-Sep",
      duration: "7-14 days",
      type: "vertical"
    },
    {
      name: "Asia",
      description: "Ancient cultures and modern marvels",
      image: "https://images.unsplash.com/photo-1549693578-d683be217e58?w=300",
      cruiseCount: 42,
      averagePrice: "$1,399",
      popularPorts: ["Singapore", "Hong Kong", "Tokyo"],
      bestTime: "Oct-Apr",
      duration: "10-16 days",
      type: "horizontal"
    },
    {
      name: "Transatlantic",
      description: "Classic ocean crossing experience",
      image: "https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=400",
      cruiseCount: 18,
      averagePrice: "$999",
      popularPorts: ["Southampton", "New York", "Le Havre"],
      bestTime: "Apr-Nov",
      duration: "6-14 days",
      type: "horizontal"
    },
    {
      name: "Pacific Coast",
      description: "Scenic coastlines and charming cities",
      image: "https://images.unsplash.com/photo-1472396961693-142e6e269027?w=400",
      cruiseCount: 28,
      averagePrice: "$1,199",
      popularPorts: ["San Francisco", "Seattle", "Victoria"],
      bestTime: "Apr-Oct",
      duration: "7-10 days",
      type: "vertical"
    },
    {
      name: "Baltic Sea",
      description: "Historic capitals and medieval charm",
      image: "https://images.unsplash.com/photo-1500375592092-40eb2168fd21?w=400",
      cruiseCount: 39,
      averagePrice: "$1,699",
      popularPorts: ["Stockholm", "Helsinki", "St. Petersburg"],
      bestTime: "May-Sep",
      duration: "7-12 days",
      type: "horizontal"
    },
    {
      name: "British Isles",
      description: "Castles, countryside, and culture",
      image: "https://images.unsplash.com/photo-1465146344425-f00d5f5c8f07?w=400",
      cruiseCount: 31,
      averagePrice: "$1,599",
      popularPorts: ["Edinburgh", "Dublin", "London"],
      bestTime: "May-Sep",
      duration: "7-14 days",
      type: "horizontal"
    }
  ];

  const defaultImage = "https://images.unsplash.com/photo-1500375592092-40eb2168fd21?w=400";

  const handleDestinationClick = (destinationName: string) => {
    navigate(`/destination/${destinationName.toLowerCase().replace(/\s+/g, '-')}`);
  };

  const handleViewAllClick = () => {
    navigate('/search?q=popular destinations&type=browse');
  };

  const scroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const scrollAmount = 320;
      const currentScroll = scrollContainerRef.current.scrollLeft;
      const targetScroll = direction === 'left' 
        ? currentScroll - scrollAmount 
        : currentScroll + scrollAmount;
      
      scrollContainerRef.current.scrollTo({
        left: targetScroll,
        behavior: 'smooth'
      });
    }
  };

  const DestinationCard = ({ destination, isVertical }: { destination: any; isVertical: boolean }) => (
    <div 
      className={`group cursor-pointer flex-shrink-0 ${
        isVertical ? 'w-60' : 'w-72'
      }`}
      onClick={() => handleDestinationClick(destination.name)}
    >
      <div className={`relative overflow-hidden rounded-lg bg-white border border-border-gray hover:shadow-level-3 transition-all duration-300 hover:scale-[1.02] ${
        isVertical ? 'h-72' : 'h-[136px]'
      }`}>
        {/* Image */}
        <div className={`relative ${isVertical ? 'h-44' : 'h-full w-40 float-left'} overflow-hidden`}>
          <img 
            src={destination.image || defaultImage} 
            alt={destination.name}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.src = defaultImage;
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
          
          {/* Price overlay */}
          <div className="absolute top-1 right-1 bg-white/90 backdrop-blur-sm rounded-md px-1 py-0.5">
            <div className="text-xs font-semibold text-charcoal">From {destination.averagePrice}</div>
          </div>

          {/* Title overlay for horizontal cards */}
          {!isVertical && (
            <div className="absolute bottom-1 left-1 text-white">
              <h3 className="font-bold text-sm mb-0.5">{destination.name}</h3>
              <p className="text-xs opacity-90 line-clamp-1">{destination.description}</p>
            </div>
          )}
        </div>

        {/* Content */}
        <div className={`p-2 ${isVertical ? '' : 'ml-40'} flex-1 flex flex-col h-full`}>
          {/* Title for vertical cards */}
          {isVertical && (
            <div className="mb-1">
              <h3 className="font-bold text-base text-charcoal">{destination.name}</h3>
              <p className="text-xs text-slate-gray line-clamp-2">{destination.description}</p>
            </div>
          )}

          <div className={`grid ${isVertical ? 'grid-cols-2' : 'grid-cols-1'} gap-1 mb-1`}>
            <div className="flex items-center gap-1 text-xs">
              <Ship className="w-2 h-2 text-ocean-blue" />
              <span className="text-slate-gray">{destination.cruiseCount} cruises</span>
            </div>
            <div className="flex items-center gap-1 text-xs">
              <Calendar className="w-2 h-2 text-ocean-blue" />
              <span className="text-slate-gray">{destination.bestTime}</span>
            </div>
          </div>

          <div className="mb-1">
            <h4 className="text-xs font-medium text-charcoal mb-0.5">Popular Ports</h4>
            <div className="flex flex-wrap gap-0.5">
              {destination.popularPorts.slice(0, isVertical ? 3 : 2).map((port: string, portIndex: number) => (
                <span 
                  key={portIndex}
                  className="text-xs bg-light-gray text-slate-gray px-1 py-0.5 rounded-full"
                >
                  {port}
                </span>
              ))}
            </div>
          </div>

          <div className="flex items-center justify-between mt-auto">
            <div className="text-xs text-slate-gray">
              {destination.duration} typical
            </div>
            <Button 
              size="sm" 
              className="bg-ocean-blue hover:bg-deep-navy text-white text-xs h-5 px-2"
              onClick={(e) => {
                e.stopPropagation();
                handleDestinationClick(destination.name);
              }}
            >
              Explore
            </Button>
          </div>
        </div>

        {/* Hover overlay */}
        <div className="absolute inset-0 bg-ocean-blue/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-lg"></div>
      </div>
    </div>
  );

  const GroupedCards = ({ startIndex }: { startIndex: number }) => {
    const group = destinations.slice(startIndex, startIndex + 3);
    if (group.length === 0) return null;

    return (
      <div className="flex-shrink-0 flex gap-2">
        {/* Vertical card */}
        <DestinationCard destination={group[0]} isVertical={true} />
        
        {/* Two horizontal cards stacked */}
        <div className="flex flex-col gap-2">
          {group[1] && <DestinationCard destination={group[1]} isVertical={false} />}
          {group[2] && <DestinationCard destination={group[2]} isVertical={false} />}
        </div>
      </div>
    );
  };

  return (
    <section className="py-4 bg-white">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="flex items-center justify-between mb-3">
          <div>
            <h2 className="text-lg font-bold text-charcoal mb-1">Popular Destinations</h2>
            <p className="text-slate-gray text-sm">Discover amazing cruise destinations around the world</p>
          </div>
          <div className="flex items-center gap-2">
            <Button 
              variant="ghost" 
              className="text-ocean-blue hover:text-deep-navy text-sm"
              onClick={handleViewAllClick}
            >
              View All Destinations →
            </Button>
          </div>
        </div>

        <div className="relative group">
          {/* Subtle navigation arrow - right */}
          <div className="absolute right-2 top-1/2 -translate-y-1/2 z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <Button
              variant="ghost"
              size="sm"
              className="w-8 h-8 rounded-full bg-white/80 backdrop-blur-sm border border-gray-200 hover:bg-white shadow-sm"
              onClick={() => scroll('right')}
            >
              <ChevronRight className="w-4 h-4 text-gray-600" />
            </Button>
          </div>

          {/* Scrollable container */}
          <div 
            ref={scrollContainerRef}
            className="flex gap-4 overflow-x-auto scrollbar-hide scroll-smooth"
          >
            {Array.from({ length: Math.ceil(destinations.length / 3) }).map((_, index) => (
              <GroupedCards key={index} startIndex={index * 3} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default DestinationCards;
