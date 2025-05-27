
import React from 'react';
import { Button } from '@/components/ui/button';
import { Star, ChevronRight } from 'lucide-react';

const CruiseLinesSection = () => {
  const cruiseLineData = [
    {
      name: "Royal Caribbean",
      logo: "RC",
      description: "Adventure awaits on the world's most innovative ships",
      ships: 28,
      destinations: 300,
      image: "https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=400",
      rating: 4.8,
      startingPrice: "$599",
      color: "from-blue-600 to-blue-800",
      availableCruises: [
        {
          id: 1,
          shipName: "Symphony of the Seas",
          route: "Caribbean",
          duration: 7,
          price: "$899",
          image: "https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=300",
          rating: 4.8
        },
        {
          id: 2,
          shipName: "Oasis of the Seas",
          route: "Mediterranean",
          duration: 10,
          price: "$1,299",
          image: "https://images.unsplash.com/photo-1564437657622-73a8e53c0ca7?w=300",
          rating: 4.7
        },
        {
          id: 3,
          shipName: "Allure of the Seas",
          route: "Alaska",
          duration: 14,
          price: "$1,599",
          image: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=300",
          rating: 4.9
        },
        {
          id: 4,
          shipName: "Harmony of the Seas",
          route: "Northern Europe",
          duration: 12,
          price: "$1,799",
          image: "https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=300",
          rating: 4.6
        }
      ]
    },
    {
      name: "Norwegian Cruise Line",
      logo: "NCL",
      description: "Freestyle cruising with no formal dress codes",
      ships: 17,
      destinations: 400,
      image: "https://images.unsplash.com/photo-1564437657622-73a8e53c0ca7?w=400",
      rating: 4.6,
      startingPrice: "$499",
      color: "from-purple-600 to-purple-800",
      availableCruises: [
        {
          id: 5,
          shipName: "Norwegian Bliss",
          route: "Alaska",
          duration: 7,
          price: "$1,199",
          image: "https://images.unsplash.com/photo-1564437657622-73a8e53c0ca7?w=300",
          rating: 4.6
        },
        {
          id: 6,
          shipName: "Norwegian Epic",
          route: "Mediterranean",
          duration: 10,
          price: "$1,099",
          image: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=300",
          rating: 4.5
        },
        {
          id: 7,
          shipName: "Norwegian Star",
          route: "Caribbean",
          duration: 14,
          price: "$999",
          image: "https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=300",
          rating: 4.4
        }
      ]
    },
    {
      name: "Celebrity Cruises",
      logo: "CEL",
      description: "Modern luxury cruising experience",
      ships: 14,
      destinations: 280,
      image: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=400",
      rating: 4.9,
      startingPrice: "$799",
      color: "from-emerald-600 to-emerald-800",
      availableCruises: [
        {
          id: 8,
          shipName: "Celebrity Edge",
          route: "Mediterranean",
          duration: 12,
          price: "$1,599",
          image: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=300",
          rating: 4.9
        },
        {
          id: 9,
          shipName: "Celebrity Apex",
          route: "Northern Europe",
          duration: 10,
          price: "$1,799",
          image: "https://images.unsplash.com/photo-1564437657622-73a8e53c0ca7?w=300",
          rating: 4.8
        }
      ]
    }
  ];

  const CruiseCard = ({ cruise }: { cruise: any }) => (
    <div className="group cursor-pointer min-w-[200px] flex-shrink-0">
      <div className="relative overflow-hidden rounded-lg bg-white border border-border-gray hover:shadow-level-2 transition-all duration-300">
        <img 
          src={cruise.image} 
          alt={cruise.shipName}
          className="w-full h-32 object-cover transition-transform duration-300 group-hover:scale-105"
        />
        <div className="absolute top-2 right-2 bg-ocean-blue text-white px-2 py-1 rounded text-xs font-bold">
          {cruise.price}
        </div>
        <div className="p-3">
          <h4 className="font-semibold text-charcoal text-sm line-clamp-1 mb-1">{cruise.shipName}</h4>
          <p className="text-xs text-slate-gray mb-2">{cruise.route} • {cruise.duration} nights</p>
          <div className="flex items-center gap-1">
            <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
            <span className="text-xs text-charcoal">{cruise.rating}</span>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-charcoal mb-2">Cruise Lines</h2>
          <p className="text-slate-gray">Discover your perfect cruise line match</p>
        </div>

        <div className="space-y-12">
          {cruiseLineData.map((line, index) => (
            <div key={index} className="space-y-6">
              {/* Cruise Line Header */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className={`w-16 h-16 bg-gradient-to-r ${line.color} rounded-xl flex items-center justify-center`}>
                    <span className="text-white font-bold text-lg">{line.logo}</span>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-charcoal">{line.name}</h3>
                    <p className="text-slate-gray text-sm">{line.description}</p>
                    <div className="flex items-center gap-4 mt-1">
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                        <span className="text-sm text-charcoal">{line.rating}</span>
                      </div>
                      <span className="text-sm text-slate-gray">{line.ships} ships</span>
                      <span className="text-sm text-slate-gray">{line.destinations} destinations</span>
                    </div>
                  </div>
                </div>
                <Button variant="ghost" className="text-ocean-blue hover:text-deep-navy">
                  View All <ChevronRight className="w-4 h-4 ml-1" />
                </Button>
              </div>

              {/* Available Cruises */}
              <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
                {line.availableCruises.map((cruise) => (
                  <CruiseCard key={cruise.id} cruise={cruise} />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CruiseLinesSection;
