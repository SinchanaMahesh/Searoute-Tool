
import React from 'react';
import { Button } from '@/components/ui/button';
import { Star, Clock, Percent } from 'lucide-react';

const CruiseDealsSection = () => {
  const recentlyViewed = [
    {
      id: 1,
      title: "Symphony of the Seas",
      subtitle: "Royal Caribbean",
      image: "https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=400",
      price: "$899",
      originalPrice: "$1,299",
      discount: "31% OFF",
      rating: 4.8,
      duration: "7 nights"
    },
    {
      id: 2,
      title: "Norwegian Bliss",
      subtitle: "Norwegian Cruise Line",
      image: "https://images.unsplash.com/photo-1564437657622-73a8e53c0ca7?w=400",
      price: "$1,199",
      originalPrice: "$1,699",
      discount: "29% OFF",
      rating: 4.6,
      duration: "10 nights"
    },
    {
      id: 3,
      title: "Celebrity Edge",
      subtitle: "Celebrity Cruises",
      image: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=400",
      price: "$1,599",
      originalPrice: "$2,199",
      discount: "27% OFF",
      rating: 4.9,
      duration: "12 nights"
    }
  ];

  const lastMinuteDeals = [
    {
      id: 4,
      title: "Carnival Vista",
      subtitle: "Carnival Cruise Line",
      image: "https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=400",
      price: "$599",
      originalPrice: "$999",
      discount: "40% OFF",
      rating: 4.4,
      duration: "7 nights",
      departure: "Next Week"
    },
    {
      id: 5,
      title: "MSC Seaside",
      subtitle: "MSC Cruises",
      image: "https://images.unsplash.com/photo-1564437657622-73a8e53c0ca7?w=400",
      price: "$799",
      originalPrice: "$1,199",
      discount: "33% OFF",
      rating: 4.5,
      duration: "8 nights",
      departure: "This Month"
    }
  ];

  const priceDrops = [
    {
      id: 6,
      title: "Allure of the Seas",
      subtitle: "Royal Caribbean",
      image: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=400",
      price: "$1,099",
      originalPrice: "$1,499",
      discount: "27% DROP",
      rating: 4.7,
      duration: "9 nights"
    }
  ];

  const CruiseCard = ({ cruise }: { cruise: any }) => (
    <div className="relative group cursor-pointer">
      <div className="relative overflow-hidden rounded-lg">
        <img 
          src={cruise.image} 
          alt={cruise.title}
          className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-105"
        />
        <div className="absolute top-2 right-2 bg-coral-pink text-white px-2 py-1 rounded text-xs font-bold">
          {cruise.discount}
        </div>
        {cruise.departure && (
          <div className="absolute top-2 left-2 bg-sunset-orange text-white px-2 py-1 rounded text-xs font-bold flex items-center gap-1">
            <Clock className="w-3 h-3" />
            {cruise.departure}
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <div className="absolute bottom-4 left-4 right-4">
            <Button className="w-full bg-ocean-blue hover:bg-deep-navy text-white text-sm">
              View Details
            </Button>
          </div>
        </div>
      </div>
      <div className="mt-3 space-y-1">
        <h3 className="font-semibold text-charcoal text-sm line-clamp-1">{cruise.title}</h3>
        <p className="text-xs text-slate-gray">{cruise.subtitle}</p>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1">
              <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
              <span className="text-xs text-charcoal">{cruise.rating}</span>
            </div>
            <span className="text-xs text-slate-gray">•</span>
            <span className="text-xs text-slate-gray">{cruise.duration}</span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-lg font-bold text-sunset-orange">{cruise.price}</span>
          <span className="text-sm text-slate-gray line-through">{cruise.originalPrice}</span>
        </div>
      </div>
    </div>
  );

  const SectionRow = ({ title, items, viewAllText = "View All" }: { title: string; items: any[]; viewAllText?: string }) => (
    <div className="mb-12">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-charcoal">{title}</h2>
        <Button variant="ghost" className="text-ocean-blue hover:text-deep-navy">
          {viewAllText} →
        </Button>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 xl:grid-cols-6 gap-4">
        {items.map((item) => (
          <CruiseCard key={item.id} cruise={item} />
        ))}
      </div>
    </div>
  );

  return (
    <section className="py-16 bg-pearl-white">
      <div className="container mx-auto px-4 lg:px-8">
        <SectionRow title="Recently Viewed" items={recentlyViewed} />
        <SectionRow title="Last Minute Deals" items={lastMinuteDeals} />
        <SectionRow title="Price Drops" items={priceDrops} />
      </div>
    </section>
  );
};

export default CruiseDealsSection;
