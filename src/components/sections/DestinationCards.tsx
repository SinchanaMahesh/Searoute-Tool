
import React from 'react';
import { Button } from '@/components/ui/button';
import { MapPin, Calendar, Ship } from 'lucide-react';

const DestinationCards = () => {
  const destinations = [
    {
      name: "Caribbean",
      description: "Tropical paradise with pristine beaches",
      image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400",
      cruiseCount: 147,
      averagePrice: "$899",
      popularPorts: ["Cozumel", "Nassau", "St. Thomas"],
      bestTime: "Year-round",
      duration: "7-14 days"
    },
    {
      name: "Mediterranean",
      description: "Historic cities and stunning coastlines",
      image: "https://images.unsplash.com/photo-1533929736458-ca588d08c8be?w=400",
      cruiseCount: 89,
      averagePrice: "$1,299",
      popularPorts: ["Barcelona", "Rome", "Santorini"],
      bestTime: "Apr-Oct",
      duration: "7-12 days"
    },
    {
      name: "Alaska",
      description: "Glaciers, wildlife, and breathtaking scenery",
      image: "https://images.unsplash.com/photo-1586861203927-800a5acdcc4d?w=400",
      cruiseCount: 34,
      averagePrice: "$1,599",
      popularPorts: ["Juneau", "Ketchikan", "Skagway"],
      bestTime: "May-Sep",
      duration: "7-14 days"
    },
    {
      name: "Northern Europe",
      description: "Fjords, capitals, and Viking heritage",
      image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400",
      cruiseCount: 56,
      averagePrice: "$1,799",
      popularPorts: ["Copenhagen", "Stockholm", "Oslo"],
      bestTime: "May-Sep",
      duration: "7-14 days"
    },
    {
      name: "Asia",
      description: "Ancient cultures and modern marvels",
      image: "https://images.unsplash.com/photo-1549693578-d683be217e58?w=400",
      cruiseCount: 42,
      averagePrice: "$1,399",
      popularPorts: ["Singapore", "Hong Kong", "Tokyo"],
      bestTime: "Oct-Apr",
      duration: "10-16 days"
    },
    {
      name: "Transatlantic",
      description: "Classic ocean crossing experience",
      image: "https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=400",
      cruiseCount: 18,
      averagePrice: "$999",
      popularPorts: ["Southampton", "New York", "Le Havre"],
      bestTime: "Apr-Nov",
      duration: "6-14 days"
    }
  ];

  return (
    <section className="py-12 bg-white">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-3xl font-bold text-charcoal mb-2">Popular Destinations</h2>
            <p className="text-slate-gray">Discover amazing cruise destinations around the world</p>
          </div>
          <Button variant="ghost" className="text-ocean-blue hover:text-deep-navy">
            View All Destinations →
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {destinations.map((destination, index) => (
            <div key={index} className="group cursor-pointer">
              <div className="relative overflow-hidden rounded-xl bg-white border border-border-gray hover:shadow-level-3 transition-all duration-300 hover:scale-[1.02]">
                {/* Image */}
                <div className="relative h-48 overflow-hidden">
                  <img 
                    src={destination.image} 
                    alt={destination.name}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                  
                  {/* Price overlay */}
                  <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm rounded-lg px-3 py-1">
                    <div className="text-sm font-semibold text-charcoal">From {destination.averagePrice}</div>
                  </div>

                  {/* Title overlay */}
                  <div className="absolute bottom-4 left-4 text-white">
                    <h3 className="text-xl font-bold mb-1">{destination.name}</h3>
                    <p className="text-sm opacity-90">{destination.description}</p>
                  </div>
                </div>

                {/* Content */}
                <div className="p-4">
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div className="flex items-center gap-2 text-sm">
                      <Ship className="w-4 h-4 text-ocean-blue" />
                      <span className="text-slate-gray">{destination.cruiseCount} cruises</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Calendar className="w-4 h-4 text-ocean-blue" />
                      <span className="text-slate-gray">{destination.bestTime}</span>
                    </div>
                  </div>

                  <div className="mb-4">
                    <h4 className="text-sm font-medium text-charcoal mb-2">Popular Ports</h4>
                    <div className="flex flex-wrap gap-2">
                      {destination.popularPorts.map((port, portIndex) => (
                        <span 
                          key={portIndex}
                          className="text-xs bg-light-gray text-slate-gray px-2 py-1 rounded-full"
                        >
                          {port}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="text-sm text-slate-gray">
                      {destination.duration} typical
                    </div>
                    <Button 
                      size="sm" 
                      className="bg-ocean-blue hover:bg-deep-navy text-white"
                    >
                      Explore
                    </Button>
                  </div>
                </div>

                {/* Hover overlay */}
                <div className="absolute inset-0 bg-ocean-blue/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default DestinationCards;
