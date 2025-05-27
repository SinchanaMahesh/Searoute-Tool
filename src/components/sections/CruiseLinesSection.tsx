
import React from 'react';
import { Button } from '@/components/ui/button';
import { Star } from 'lucide-react';

const CruiseLinesSection = () => {
  const cruiseLines = [
    {
      name: "Royal Caribbean",
      logo: "RC",
      description: "Adventure awaits on the world's most innovative ships",
      ships: 28,
      destinations: 300,
      image: "https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=400",
      rating: 4.8,
      startingPrice: "$599",
      color: "from-blue-600 to-blue-800"
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
      color: "from-purple-600 to-purple-800"
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
      color: "from-emerald-600 to-emerald-800"
    },
    {
      name: "Carnival Cruise Line",
      logo: "CCL",
      description: "Fun for everyone at amazing value",
      ships: 24,
      destinations: 350,
      image: "https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=400",
      rating: 4.4,
      startingPrice: "$399",
      color: "from-red-600 to-red-800"
    },
    {
      name: "MSC Cruises",
      logo: "MSC",
      description: "Mediterranean-style cruising worldwide",
      ships: 21,
      destinations: 200,
      image: "https://images.unsplash.com/photo-1564437657622-73a8e53c0ca7?w=400",
      rating: 4.5,
      startingPrice: "$549",
      color: "from-amber-600 to-amber-800"
    },
    {
      name: "Disney Cruise Line",
      logo: "DCL",
      description: "Magic at sea for the whole family",
      ships: 5,
      destinations: 50,
      image: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=400",
      rating: 4.9,
      startingPrice: "$899",
      color: "from-indigo-600 to-indigo-800"
    }
  ];

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-3xl font-bold text-charcoal mb-2">Cruise Lines</h2>
            <p className="text-slate-gray">Discover your perfect cruise line match</p>
          </div>
          <Button variant="ghost" className="text-ocean-blue hover:text-deep-navy">
            View All Lines →
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {cruiseLines.map((line, index) => (
            <div key={index} className="group cursor-pointer">
              <div className="relative overflow-hidden rounded-xl bg-white border border-border-gray hover:shadow-level-3 transition-all duration-300">
                {/* Header with gradient */}
                <div className={`h-32 bg-gradient-to-r ${line.color} relative`}>
                  <div className="absolute inset-0 bg-black/20"></div>
                  <div className="absolute top-4 left-4">
                    <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center font-bold text-charcoal">
                      {line.logo}
                    </div>
                  </div>
                  <div className="absolute bottom-4 left-4 text-white">
                    <h3 className="text-lg font-semibold">{line.name}</h3>
                    <div className="flex items-center gap-2 text-sm">
                      <Star className="w-4 h-4 fill-current" />
                      <span>{line.rating}</span>
                    </div>
                  </div>
                  <div className="absolute top-4 right-4 text-white text-right">
                    <div className="text-sm opacity-90">From</div>
                    <div className="text-xl font-bold">{line.startingPrice}</div>
                  </div>
                </div>

                {/* Content */}
                <div className="p-6">
                  <p className="text-slate-gray text-sm mb-4 line-clamp-2">
                    {line.description}
                  </p>
                  
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-charcoal">{line.ships}</div>
                      <div className="text-xs text-slate-gray">Ships</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-charcoal">{line.destinations}</div>
                      <div className="text-xs text-slate-gray">Destinations</div>
                    </div>
                  </div>

                  <Button className="w-full bg-ocean-blue hover:bg-deep-navy text-white">
                    Explore {line.name}
                  </Button>
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

export default CruiseLinesSection;
