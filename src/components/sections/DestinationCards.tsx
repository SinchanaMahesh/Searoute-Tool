import React, { useRef, useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { MapPin, Calendar, Ship, ChevronRight, ChevronLeft, ExternalLink } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const DestinationCards = () => {
  const navigate = useNavigate();
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const destinations = [
    {
      id: "caribbean",
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
      id: "mediterranean",
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
      id: "alaska",
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
      id: "northern-europe",
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
      id: "asia",
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
      id: "transatlantic",
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
      id: "pacific-coast",
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
      id: "baltic-sea",
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
      id: "british-isles",
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

  // Check scroll position
  const checkScrollPosition = () => {
    if (scrollContainerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
      setCanScrollLeft(scrollLeft > 0);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 1);
    }
  };

  useEffect(() => {
    const element = scrollContainerRef.current;
    if (element) {
      element.addEventListener('scroll', checkScrollPosition);
      checkScrollPosition(); // Initial check
      
      return () => {
        element.removeEventListener('scroll', checkScrollPosition);
      };
    }
  }, []);

  const handleDestinationClick = (destinationName: string) => {
    navigate(`/destination/${destinationName.toLowerCase().replace(/\s+/g, '-')}`);
  };

  const handleViewAllClick = () => {
    navigate('/search?q=popular destinations&type=browse');
  };

  const scroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const scrollAmount = 384;
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

  const DestinationCard = ({ destination, isVertical }: { destination: any; isVertical: boolean }) => {
    const isHovered = hoveredCard === destination.id;
    
    return (
      <div 
        className={`group cursor-pointer flex-shrink-0 ${
          isVertical ? 'w-96' : 'w-96'
        }`}
        onClick={() => handleDestinationClick(destination.name)}
        onMouseEnter={() => setHoveredCard(destination.id)}
        onMouseLeave={() => setHoveredCard(null)}
      >
        <div className={`relative overflow-hidden rounded-lg bg-white border border-border-gray transition-all duration-300 ${
          isHovered ? 'shadow-level-3 -translate-y-1' : 'shadow-level-1'
        } ${isVertical ? 'h-[480px]' : 'h-[230px]'}`}>
          {/* Image */}
          <div className={`relative ${isVertical ? 'h-64' : 'h-full w-56 float-left'} overflow-hidden`}>
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
            <div className="absolute top-2 right-2 bg-white/90 backdrop-blur-sm rounded-md px-2 py-1">
              <div className="text-sm font-semibold text-charcoal">From {destination.averagePrice}</div>
            </div>

            {/* Hover icon indicator */}
            <div className={`absolute bottom-3 right-3 transition-opacity duration-300 ${
              isHovered ? 'opacity-100' : 'opacity-0'
            }`}>
              <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-md">
                <ExternalLink className="w-4 h-4 text-ocean-blue" />
              </div>
            </div>

            {/* Title overlay for horizontal cards */}
            {!isVertical && (
              <div className="absolute bottom-2 left-2 text-white">
                <h3 className="font-bold text-base mb-1">{destination.name}</h3>
                <p className="text-sm opacity-90 line-clamp-1">{destination.description}</p>
              </div>
            )}
          </div>

          {/* Content */}
          <div className={`p-3 ${isVertical ? '' : 'ml-56'} flex-1 flex flex-col h-full`}>
            {/* Title for vertical cards */}
            {isVertical && (
              <div className="mb-2">
                <h3 className="font-bold text-lg text-charcoal">{destination.name}</h3>
                <p className="text-sm text-slate-gray line-clamp-2">{destination.description}</p>
              </div>
            )}

            <div className={`grid ${isVertical ? 'grid-cols-2' : 'grid-cols-1'} gap-2 mb-2`}>
              <div className="flex items-center gap-2 text-sm">
                <Ship className="w-4 h-4 text-ocean-blue" />
                <span className="text-slate-gray">{destination.cruiseCount} cruises</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Calendar className="w-4 h-4 text-ocean-blue" />
                <span className="text-slate-gray">{destination.bestTime}</span>
              </div>
            </div>

            <div className="mb-2">
              <h4 className="text-sm font-medium text-charcoal mb-1">Popular Ports</h4>
              <div className="flex flex-wrap gap-1">
                {destination.popularPorts.slice(0, isVertical ? 3 : 2).map((port: string, portIndex: number) => (
                  <span 
                    key={portIndex}
                    className="text-xs bg-light-gray text-slate-gray px-2 py-1 rounded-full"
                  >
                    {port}
                  </span>
                ))}
              </div>
            </div>

            <div className="flex items-center justify-between mt-auto">
              <div className="text-sm text-slate-gray">
                {destination.duration} typical
              </div>
            </div>
          </div>

          {/* Hover overlay */}
          <div className={`absolute inset-0 bg-ocean-blue/5 transition-opacity duration-300 rounded-lg ${
            isHovered ? 'opacity-100' : 'opacity-0'
          }`}></div>
        </div>
      </div>
    );
  };

  const GroupedCards = ({ startIndex }: { startIndex: number }) => {
    const group = destinations.slice(startIndex, startIndex + 3);
    if (group.length === 0) return null;

    return (
      <div className="flex-shrink-0 flex gap-6">
        {/* Vertical card */}
        <DestinationCard destination={group[0]} isVertical={true} />
        
        {/* Two horizontal cards stacked */}
        <div className="flex flex-col gap-6">
          {group[1] && <DestinationCard destination={group[1]} isVertical={false} />}
          {group[2] && <DestinationCard destination={group[2]} isVertical={false} />}
        </div>
      </div>
    );
  };

  return (
    <section className="py-5 bg-white">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 gap-2">
          <div>
            <h2 className="text-xl font-bold text-charcoal mb-1">Popular Destinations</h2>
            <p className="text-slate-gray text-base">Discover amazing cruise destinations around the world</p>
          </div>
          <div className="flex items-center gap-2">
            <Button 
              variant="ghost" 
              className="text-ocean-blue hover:text-deep-navy text-base"
              onClick={handleViewAllClick}
            >
              View All Destinations →
            </Button>
          </div>
        </div>

        <div className="relative group">
          {/* Left Navigation arrow */}
          {canScrollLeft && (
            <div className="absolute left-3 top-1/2 -translate-y-1/2 z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <Button
                variant="ghost"
                size="sm"
                className="w-10 h-10 rounded-full bg-white/80 backdrop-blur-sm border border-gray-200 hover:bg-white shadow-sm"
                onClick={() => scroll('left')}
              >
                <ChevronLeft className="w-5 h-5 text-gray-600" />
              </Button>
            </div>
          )}

          {/* Right Navigation arrow */}
          {canScrollRight && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2 z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <Button
                variant="ghost"
                size="sm"
                className="w-10 h-10 rounded-full bg-white/80 backdrop-blur-sm border border-gray-200 hover:bg-white shadow-sm"
                onClick={() => scroll('right')}
              >
                <ChevronRight className="w-5 h-5 text-gray-600" />
              </Button>
            </div>
          )}

          {/* Scrollable container */}
          <div 
            ref={scrollContainerRef}
            className="flex gap-6 overflow-x-auto scrollbar-hide scroll-smooth pb-3"
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
