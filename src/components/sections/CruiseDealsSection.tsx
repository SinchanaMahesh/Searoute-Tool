import React, { useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Star, Clock, Percent, TrendingDown, Zap, ChevronRight, ExternalLink } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const CruiseDealsSection = () => {
  const navigate = useNavigate();
  const recentlyViewedRef = useRef<HTMLDivElement>(null);
  const dealsRef = useRef<HTMLDivElement>(null);

  const defaultImage = "https://images.unsplash.com/photo-1500375592092-40eb2168fd21?w=400";

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

  const dealsAndSteals = [
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
      type: "last-minute",
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
      type: "last-minute",
      departure: "This Month"
    },
    {
      id: 6,
      title: "Allure of the Seas",
      subtitle: "Royal Caribbean",
      image: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=400",
      price: "$1,099",
      originalPrice: "$1,499",
      discount: "27% DROP",
      rating: 4.7,
      duration: "9 nights",
      type: "price-drop"
    },
    {
      id: 7,
      title: "Norwegian Epic",
      subtitle: "Norwegian Cruise Line",
      image: "https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=400",
      price: "$899",
      originalPrice: "$1,299",
      discount: "31% DROP",
      rating: 4.5,
      duration: "7 nights",
      type: "price-drop"
    },
    {
      id: 8,
      title: "Disney Dream",
      subtitle: "Disney Cruise Line",
      image: "https://images.unsplash.com/photo-1564437657622-73a8e53c0ca7?w=400",
      price: "$1,299",
      originalPrice: "$1,799",
      discount: "28% OFF",
      rating: 4.8,
      duration: "7 nights",
      type: "last-minute",
      departure: "Next Month"
    },
    {
      id: 9,
      title: "Virgin Scarlet Lady",
      subtitle: "Virgin Voyages",
      image: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=400",
      price: "$899",
      originalPrice: "$1,199",
      discount: "25% OFF",
      rating: 4.6,
      duration: "6 nights",
      type: "last-minute",
      departure: "This Week"
    },
    {
      id: 10,
      title: "Princess Ruby",
      subtitle: "Princess Cruises",
      image: "https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=400",
      price: "$1,399",
      originalPrice: "$1,899",
      discount: "26% DROP",
      rating: 4.4,
      duration: "12 nights",
      type: "price-drop"
    },
    {
      id: 11,
      title: "Costa Diadema",
      subtitle: "Costa Cruises",
      image: "https://images.unsplash.com/photo-1564437657622-73a8e53c0ca7?w=400",
      price: "$749",
      originalPrice: "$999",
      discount: "25% OFF",
      rating: 4.3,
      duration: "8 nights",
      type: "last-minute",
      departure: "Next Week"
    },
    {
      id: 12,
      title: "Holland America Nieuw Amsterdam",
      subtitle: "Holland America Line",
      image: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=400",
      price: "$1,199",
      originalPrice: "$1,599",
      discount: "25% OFF",
      rating: 4.5,
      duration: "10 nights",
      type: "price-drop"
    },
    {
      id: 13,
      title: "Celebrity Millennium",
      subtitle: "Celebrity Cruises",
      image: "https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=400",
      price: "$1,099",
      originalPrice: "$1,399",
      discount: "21% OFF",
      rating: 4.6,
      duration: "8 nights",
      type: "last-minute",
      departure: "Next Month"
    },
    {
      id: 14,
      title: "Royal Caribbean Mariner",
      subtitle: "Royal Caribbean",
      image: "https://images.unsplash.com/photo-1564437657622-73a8e53c0ca7?w=400",
      price: "$799",
      originalPrice: "$1,099",
      discount: "27% DROP",
      rating: 4.7,
      duration: "7 nights",
      type: "price-drop"
    },
    {
      id: 15,
      title: "NCL Getaway",
      subtitle: "Norwegian Cruise Line",
      image: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=400",
      price: "$899",
      originalPrice: "$1,199",
      discount: "25% OFF",
      rating: 4.4,
      duration: "9 nights",
      type: "last-minute",
      departure: "This Week"
    }
  ];

  const handleCruiseClick = (cruiseId: number) => {
    navigate(`/cruise/${cruiseId}/book`);
  };

  const handleViewAllClick = (section: string) => {
    navigate(`/search?q=${encodeURIComponent(section)}&type=browse`);
  };

  const scroll = (direction: 'left' | 'right', ref: React.RefObject<HTMLDivElement>) => {
    if (ref.current) {
      const scrollAmount = 320;
      const currentScroll = ref.current.scrollLeft;
      const targetScroll = direction === 'left' 
        ? currentScroll - scrollAmount 
        : currentScroll + scrollAmount;
      
      ref.current.scrollTo({
        left: targetScroll,
        behavior: 'smooth'
      });
    }
  };

  const CruiseCard = ({ cruise }: { cruise: any }) => {
    const [isHovered, setIsHovered] = React.useState(false);

    return (
      <div 
        className={`relative group cursor-pointer flex-shrink-0 w-48 transition-transform duration-300 ${
          isHovered ? 'transform -translate-y-2' : ''
        }`}
        onClick={() => handleCruiseClick(cruise.id)}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div className="relative overflow-hidden rounded-lg">
          <img 
            src={cruise.image || defaultImage} 
            alt={cruise.title}
            className="w-full h-32 object-cover transition-transform duration-300 group-hover:scale-105"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.src = defaultImage;
            }}
          />
          <div className="absolute top-2 right-2 bg-coral-pink text-white px-2 py-1 rounded text-xs font-bold">
            {cruise.discount}
          </div>
          
          {/* Type indicators */}
          {cruise.type === 'last-minute' && (
            <div className="absolute top-2 left-2 bg-sunset-orange text-white px-2 py-1 rounded text-xs font-bold flex items-center gap-1">
              <Zap className="w-3 h-3" />
              Last Minute
            </div>
          )}
          {cruise.type === 'price-drop' && (
            <div className="absolute top-2 left-2 bg-emerald-500 text-white px-2 py-1 rounded text-xs font-bold flex items-center gap-1">
              <TrendingDown className="w-3 h-3" />
              Price Drop
            </div>
          )}
          {cruise.departure && (
            <div className="absolute bottom-2 left-2 bg-black/70 text-white px-2 py-1 rounded text-xs flex items-center gap-1">
              <Clock className="w-3 h-3" />
              {cruise.departure}
            </div>
          )}
          
          {/* Hover icon indicator - moved to bottom right */}
          <div className={`absolute bottom-2 right-2 transition-opacity duration-300 ${
            isHovered ? 'opacity-100' : 'opacity-0'
          }`}>
            <div className="w-6 h-6 bg-white rounded-full flex items-center justify-center shadow-md">
              <ExternalLink className="w-3 h-3 text-ocean-blue" />
            </div>
          </div>
        </div>
        <div className="mt-2 space-y-1">
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
            <span className="text-sm font-bold text-sunset-orange">{cruise.price}</span>
            <span className="text-xs text-slate-gray line-through">{cruise.originalPrice}</span>
          </div>
        </div>
      </div>
    );
  };

  const SectionRow = ({ title, items, viewAllText = "View All", scrollRef }: { title: string; items: any[]; viewAllText?: string; scrollRef: React.RefObject<HTMLDivElement> }) => (
    <div className="mb-6">
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-lg font-bold text-charcoal">{title}</h2>
        <Button 
          variant="ghost" 
          className="text-ocean-blue hover:text-deep-navy text-sm"
          onClick={() => handleViewAllClick(title)}
        >
          {viewAllText} →
        </Button>
      </div>
      <div className="relative group">
        {/* Navigation arrow - right */}
        <div className="absolute right-2 top-1/2 -translate-y-1/2 z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <Button
            variant="ghost"
            size="sm"
            className="w-8 h-8 rounded-full bg-white/80 backdrop-blur-sm border border-gray-200 hover:bg-white shadow-sm"
            onClick={() => scroll('right', scrollRef)}
          >
            <ChevronRight className="w-4 h-4 text-gray-600" />
          </Button>
        </div>
        
        <div 
          ref={scrollRef}
          className="flex gap-4 overflow-x-auto scrollbar-hide scroll-smooth pb-2"
        >
          {items.map((item) => (
            <CruiseCard key={item.id} cruise={item} />
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <section className="py-6 bg-pearl-white">
      <div className="container mx-auto px-4 lg:px-8">
        <SectionRow title="Recently Viewed" items={recentlyViewed} scrollRef={recentlyViewedRef} />
        <SectionRow title="Deals & Steals" items={dealsAndSteals} scrollRef={dealsRef} />
      </div>
    </section>
  );
};

export default CruiseDealsSection;
