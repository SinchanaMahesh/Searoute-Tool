
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Heart, Share, Plus, Star, Calendar, MapPin, Users, ExternalLink } from 'lucide-react';
import { Cruise } from '@/pages/Search';

interface CruiseListItemProps {
  cruise: Cruise;
}

const CruiseListItem = ({ cruise }: CruiseListItemProps) => {
  const [isSaved, setIsSaved] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const defaultImage = "https://images.unsplash.com/photo-1500375592092-40eb2168fd21?w=400";

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
    }).format(price);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  return (
    <div 
      className={`bg-white rounded-lg border border-border-gray overflow-hidden transition-all duration-300 relative ${
        isHovered ? 'shadow-level-2 scale-[1.02]' : 'shadow-level-1'
      }`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      role="article"
      aria-labelledby={`cruise-list-${cruise.shipName}`}
    >
      <div className="flex flex-col md:flex-row">
        {/* Image */}
        <div className="relative md:w-80 h-48 md:h-auto overflow-hidden">
          <img
            src={cruise.images[0] || defaultImage}
            alt={`${cruise.shipName} cruise ship`}
            className="w-full h-full object-cover"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.src = defaultImage;
            }}
          />
          
          {/* Badges */}
          <div className="absolute top-3 left-3 flex flex-col gap-1">
            {cruise.savings && (
              <div className="bg-seafoam-green text-white px-2 py-1 rounded-full text-xs font-medium shadow-md">
                Save ${cruise.savings}
              </div>
            )}
            {cruise.isPopular && (
              <div className="bg-sunset-orange text-white px-2 py-1 rounded-full text-xs font-medium shadow-md">
                Popular
              </div>
            )}
          </div>

          {/* Hover icon indicator - positioned at bottom right */}
          <div className={`absolute bottom-3 right-3 transition-opacity duration-300 ${
            isHovered ? 'opacity-100' : 'opacity-0'
          }`}>
            <div className="w-10 h-10 bg-white/95 rounded-full flex items-center justify-center shadow-lg border border-border-gray">
              <ExternalLink className="w-5 h-5 text-ocean-blue" />
            </div>
          </div>

          {/* Quick Actions */}
          <div className={`absolute top-3 right-3 flex gap-2 transition-opacity duration-300 ${
            isHovered ? 'opacity-100' : 'opacity-0'
          }`}>
            <Button
              size="icon"
              variant="secondary"
              className="w-10 h-10 bg-white/95 hover:bg-white border border-border-gray shadow-md min-w-[44px] min-h-[44px]"
              onClick={() => setIsSaved(!isSaved)}
              aria-label={isSaved ? 'Remove from favorites' : 'Add to favorites'}
            >
              <Heart className={`w-5 h-5 ${isSaved ? 'fill-coral-pink text-coral-pink' : 'text-charcoal'}`} />
            </Button>
            <Button
              size="icon"
              variant="secondary"
              className="w-10 h-10 bg-white/95 hover:bg-white border border-border-gray shadow-md min-w-[44px] min-h-[44px]"
              aria-label="Share cruise"
            >
              <Share className="w-5 h-5 text-charcoal" />
            </Button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 p-6">
          <div className="flex flex-col md:flex-row md:items-start justify-between h-full">
            <div className="flex-1">
              {/* Header */}
              <div className="mb-3">
                <h3 id={`cruise-list-${cruise.shipName}`} className="text-xl font-semibold text-charcoal mb-1">{cruise.shipName}</h3>
                <p className="text-charcoal">{cruise.cruiseLine}</p>
              </div>

              {/* Details */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                <div className="flex items-center gap-2 text-sm text-charcoal">
                  <Calendar className="w-4 h-4 text-charcoal" aria-hidden="true" />
                  <span>{cruise.duration} nights • {formatDate(cruise.departureDate)}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-charcoal">
                  <MapPin className="w-4 h-4 text-charcoal" aria-hidden="true" />
                  <span>{cruise.route} • {cruise.ports.length} ports</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-charcoal">
                  <Users className="w-4 h-4 text-charcoal" aria-hidden="true" />
                  <span>Departs from {cruise.departurePort}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" aria-hidden="true" />
                  <span className="text-sm font-medium text-charcoal">{cruise.rating}</span>
                  <span className="text-sm text-charcoal">
                    ({cruise.reviewCount.toLocaleString()} reviews)
                  </span>
                </div>
              </div>

              {/* Amenities */}
              <div className="flex flex-wrap gap-1 mb-4">
                {cruise.amenities.slice(0, 4).map((amenity) => (
                  <span
                    key={amenity}
                    className="px-2 py-1 bg-light-gray text-charcoal text-xs rounded-full border border-border-gray"
                  >
                    {amenity}
                  </span>
                ))}
                {cruise.amenities.length > 4 && (
                  <span className="px-2 py-1 bg-light-gray text-charcoal text-xs rounded-full border border-border-gray">
                    +{cruise.amenities.length - 4} more
                  </span>
                )}
              </div>

              {/* Ports Preview */}
              <div className="text-sm text-charcoal">
                <span className="font-medium">Ports: </span>
                {cruise.ports.join(' • ')}
              </div>
            </div>

            {/* Price & CTA */}
            <div className="flex md:flex-col items-end md:items-end justify-between md:justify-start mt-4 md:mt-0 md:ml-6">
              <div className="text-right mb-4">
                <div className="text-2xl font-bold text-charcoal">
                  {formatPrice(cruise.priceFrom)}
                </div>
                <div className="text-sm text-charcoal mb-1">
                  from ${Math.round(cruise.priceFrom / cruise.duration)} per night
                </div>
                <div className="text-xs text-charcoal">per person</div>
              </div>
              
              <div className="flex flex-col gap-2">
                <Button className="bg-ocean-blue hover:bg-deep-navy text-white min-w-32 min-h-[44px]">
                  View Details
                </Button>
                <Button variant="outline" size="sm" className="border-ocean-blue text-ocean-blue hover:bg-ocean-blue hover:text-white min-h-[44px]">
                  <Plus className="w-4 h-4 mr-1" />
                  Compare
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Hover overlay */}
      <div className={`absolute inset-0 bg-ocean-blue/5 transition-opacity duration-300 rounded-lg pointer-events-none ${
        isHovered ? 'opacity-100' : 'opacity-0'
      }`}></div>
    </div>
  );
};

export default CruiseListItem;
