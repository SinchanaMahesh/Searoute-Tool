
import React from 'react';
import { Button } from '@/components/ui/button';
import { MapPin, Calendar, Ship } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const DestinationCards = () => {
  const navigate = useNavigate();

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
      size: "large"
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
      size: "medium"
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
      size: "medium"
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
      size: "small"
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
      size: "small"
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
      size: "medium"
    }
  ];

  const handleDestinationClick = (destinationName: string) => {
    navigate(`/search?q=${encodeURIComponent(`${destinationName} cruise`)}&destination=${destinationName}`);
  };

  const handleViewAllClick = () => {
    navigate('/search?q=popular destinations&type=browse');
  };

  const getCardClasses = (size: string) => {
    switch (size) {
      case 'large':
        return 'col-span-2 row-span-2 h-80';
      case 'medium':
        return 'col-span-1 row-span-2 h-80';
      case 'small':
        return 'col-span-1 row-span-1 h-36';
      default:
        return 'col-span-1 row-span-1 h-36';
    }
  };

  const getImageHeight = (size: string) => {
    switch (size) {
      case 'large':
        return 'h-52';
      case 'medium':
        return 'h-40';
      case 'small':
        return 'h-24';
      default:
        return 'h-28';
    }
  };

  return (
    <section className="py-8 bg-white">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-charcoal mb-1">Popular Destinations</h2>
            <p className="text-slate-gray text-sm">Discover amazing cruise destinations around the world</p>
          </div>
          <Button 
            variant="ghost" 
            className="text-ocean-blue hover:text-deep-navy text-sm"
            onClick={handleViewAllClick}
          >
            View All Destinations →
          </Button>
        </div>

        <div className="grid grid-cols-3 grid-rows-4 gap-3 auto-rows-min max-h-96">
          {destinations.map((destination, index) => (
            <div 
              key={index} 
              className={`group cursor-pointer ${getCardClasses(destination.size)}`}
              onClick={() => handleDestinationClick(destination.name)}
            >
              <div className="relative overflow-hidden rounded-lg bg-white border border-border-gray hover:shadow-level-3 transition-all duration-300 hover:scale-[1.02] h-full">
                {/* Image */}
                <div className={`relative ${getImageHeight(destination.size)} overflow-hidden`}>
                  <img 
                    src={destination.image} 
                    alt={destination.name}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                  
                  {/* Price overlay */}
                  <div className="absolute top-2 right-2 bg-white/90 backdrop-blur-sm rounded-md px-2 py-1">
                    <div className="text-xs font-semibold text-charcoal">From {destination.averagePrice}</div>
                  </div>

                  {/* Title overlay */}
                  <div className="absolute bottom-3 left-3 text-white">
                    <h3 className={`font-bold mb-1 ${destination.size === 'large' ? 'text-xl' : destination.size === 'medium' ? 'text-lg' : 'text-sm'}`}>{destination.name}</h3>
                    <p className="text-xs opacity-90 line-clamp-2">{destination.description}</p>
                  </div>
                </div>

                {/* Content - only show for large and medium cards */}
                {destination.size !== 'small' && (
                  <div className="p-3 flex-1 flex flex-col">
                    <div className="grid grid-cols-2 gap-3 mb-3">
                      <div className="flex items-center gap-1 text-xs">
                        <Ship className="w-3 h-3 text-ocean-blue" />
                        <span className="text-slate-gray">{destination.cruiseCount} cruises</span>
                      </div>
                      <div className="flex items-center gap-1 text-xs">
                        <Calendar className="w-3 h-3 text-ocean-blue" />
                        <span className="text-slate-gray">{destination.bestTime}</span>
                      </div>
                    </div>

                    <div className="mb-3">
                      <h4 className="text-xs font-medium text-charcoal mb-1">Popular Ports</h4>
                      <div className="flex flex-wrap gap-1">
                        {destination.popularPorts.slice(0, destination.size === 'large' ? 3 : 2).map((port, portIndex) => (
                          <span 
                            key={portIndex}
                            className="text-xs bg-light-gray text-slate-gray px-2 py-0.5 rounded-full"
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
                        className="bg-ocean-blue hover:bg-deep-navy text-white text-xs h-7 px-3"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDestinationClick(destination.name);
                        }}
                      >
                        Explore
                      </Button>
                    </div>
                  </div>
                )}

                {/* Hover overlay */}
                <div className="absolute inset-0 bg-ocean-blue/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-lg"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default DestinationCards;
