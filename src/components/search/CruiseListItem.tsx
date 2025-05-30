
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Heart, Share, Plus, Star, Calendar, MapPin, Users, ExternalLink } from 'lucide-react';
import { CruiseData } from '@/api/mockCruiseData';
import { getImageWithFallback, handleImageError } from '@/utils/imageUtils';

interface CruiseListItemProps {
  cruise: CruiseData;
}

const CruiseListItem = ({ cruise }: CruiseListItemProps) => {
  const [isSaved, setIsSaved] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

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
        {/* Image - increased width and height */}
        <div className="relative md:w-96 h-60 md:h-auto overflow-hidden">
          <img
            src={getImageWithFallback(cruise.images?.[0], 'cruise')}
            alt={`${cruise.shipName} cruise ship`}
            className="w-full h-full object-cover"
            onError={(e) => handleImageError(e, 'cruise')}
          />
          
          {/* Badges - increased padding */}
          <div className="absolute top-4 left-4 flex flex-col gap-2">
            {cruise.savings && (
              <div className="bg-seafoam-green text-white px-3 py-2 rounded-full text-sm font-medium shadow-md">
                Save ${cruise.savings}
              </div>
            )}
            {cruise.isPopular && (
              <div className="bg-sunset-orange text-white px-3 py-2 rounded-full text-sm font-medium shadow-md">
                Popular
              </div>
            )}
          </div>

          {/* Hover icon indicator - increased size */}
          <div className={`absolute bottom-4 right-4 transition-opacity duration-300 ${
            isHovered ? 'opacity-100' : 'opacity-0'
          }`}>
            <div className="w-12 h-12 bg-white/95 rounded-full flex items-center justify-center shadow-lg border border-border-gray">
              <ExternalLink className="w-6 h-6 text-ocean-blue" />
            </div>
          </div>

          {/* Quick Actions - increased button size */}
          <div className={`absolute top-4 right-4 flex gap-3 transition-opacity duration-300 ${
            isHovered ? 'opacity-100' : 'opacity-0'
          }`}>
            <Button
              size="icon"
              variant="secondary"
              className="w-12 h-12 bg-white/95 hover:bg-white border border-border-gray shadow-md min-w-[52px] min-h-[52px]"
              onClick={() => setIsSaved(!isSaved)}
              aria-label={isSaved ? 'Remove from favorites' : 'Add to favorites'}
            >
              <Heart className={`w-6 h-6 ${isSaved ? 'fill-coral-pink text-coral-pink' : 'text-charcoal'}`} />
            </Button>
            <Button
              size="icon"
              variant="secondary"
              className="w-12 h-12 bg-white/95 hover:bg-white border border-border-gray shadow-md min-w-[52px] min-h-[52px]"
              aria-label="Share cruise"
            >
              <Share className="w-6 h-6 text-charcoal" />
            </Button>
          </div>
        </div>

        {/* Content - increased padding */}
        <div className="flex-1 p-7">
          <div className="flex flex-col md:flex-row md:items-start justify-between h-full">
            <div className="flex-1">
              {/* Header - increased font sizes */}
              <div className="mb-4">
                <h3 id={`cruise-list-${cruise.shipName}`} className="text-2xl font-semibold text-charcoal mb-2">{cruise.shipName}</h3>
                <p className="text-lg text-charcoal">{cruise.cruiseLine}</p>
              </div>

              {/* Details - increased spacing and font sizes */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-5">
                <div className="flex items-center gap-3 text-base text-charcoal">
                  <Calendar className="w-5 h-5 text-charcoal" aria-hidden="true" />
                  <span>{cruise.duration} nights • {formatDate(cruise.departureDate)}</span>
                </div>
                <div className="flex items-center gap-3 text-base text-charcoal">
                  <MapPin className="w-5 h-5 text-charcoal" aria-hidden="true" />
                  <span>{cruise.route} • {cruise.ports?.length || 0} ports</span>
                </div>
                <div className="flex items-center gap-3 text-base text-charcoal">
                  <Users className="w-5 h-5 text-charcoal" aria-hidden="true" />
                  <span>Departs from {cruise.departurePort}</span>
                </div>
                <div className="flex items-center gap-3">
                  <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" aria-hidden="true" />
                  <span className="text-base font-medium text-charcoal">{cruise.rating}</span>
                  <span className="text-base text-charcoal">
                    ({cruise.reviewCount?.toLocaleString() || 0} reviews)
                  </span>
                </div>
              </div>

              {/* Amenities - increased padding and spacing */}
              <div className="flex flex-wrap gap-2 mb-5">
                {cruise.amenities?.slice(0, 4).map((amenity) => (
                  <span
                    key={amenity}
                    className="px-3 py-2 bg-light-gray text-charcoal text-sm rounded-full border border-border-gray"
                  >
                    {amenity}
                  </span>
                ))}
                {(cruise.amenities?.length || 0) > 4 && (
                  <span className="px-3 py-2 bg-light-gray text-charcoal text-sm rounded-full border border-border-gray">
                    +{(cruise.amenities?.length || 0) - 4} more
                  </span>
                )}
              </div>

              {/* Ports Preview - increased font size */}
              <div className="text-base text-charcoal">
                <span className="font-medium">Ports: </span>
                {Array.isArray(cruise.ports) ? cruise.ports.join(' • ') : 'No ports available'}
              </div>
            </div>

            {/* Price & CTA - increased spacing and font sizes */}
            <div className="flex md:flex-col items-end md:items-end justify-between md:justify-start mt-5 md:mt-0 md:ml-8">
              <div className="text-right mb-5">
                <div className="text-3xl font-bold text-charcoal">
                  {formatPrice(cruise.priceFrom)}
                </div>
                <div className="text-base text-charcoal mb-2">
                  from ${Math.round(cruise.priceFrom / cruise.duration)} per night
                </div>
                <div className="text-sm text-charcoal">per person</div>
              </div>
              
              <div className="flex flex-col gap-3">
                <Button className="bg-ocean-blue hover:bg-deep-navy text-white min-w-36 min-h-[52px] text-base">
                  View Details
                </Button>
                <Button variant="outline" size="sm" className="border-ocean-blue text-ocean-blue hover:bg-ocean-blue hover:text-white min-h-[52px] text-base">
                  <Plus className="w-5 h-5 mr-2" />
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
