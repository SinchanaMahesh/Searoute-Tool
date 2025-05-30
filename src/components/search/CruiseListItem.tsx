
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

  // Safely format ports - ensure we always have a string
  const formatPorts = (ports: any) => {
    if (!ports) return 'No ports available';
    if (typeof ports === 'string') return ports;
    if (Array.isArray(ports)) {
      return ports.filter(port => typeof port === 'string').join(' • ');
    }
    return 'No ports available';
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
            src={getImageWithFallback(cruise.images?.[0], 'cruise')}
            alt={`${cruise.shipName} cruise ship`}
            className="w-full h-full object-cover"
            onError={(e) => handleImageError(e, 'cruise')}
          />
          
          {/* Badges */}
          <div className="absolute top-3 left-3 flex flex-col gap-2">
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

          {/* Quick Actions */}
          <div className={`absolute top-3 right-3 flex gap-2 transition-opacity duration-300 ${
            isHovered ? 'opacity-100' : 'opacity-0'
          }`}>
            <Button
              size="icon"
              variant="secondary"
              className="w-8 h-8 bg-white/95 hover:bg-white border border-border-gray shadow-md"
              onClick={() => setIsSaved(!isSaved)}
              aria-label={isSaved ? 'Remove from favorites' : 'Add to favorites'}
            >
              <Heart className={`w-4 h-4 ${isSaved ? 'fill-coral-pink text-coral-pink' : 'text-charcoal'}`} />
            </Button>
            <Button
              size="icon"
              variant="secondary"
              className="w-8 h-8 bg-white/95 hover:bg-white border border-border-gray shadow-md"
              aria-label="Share cruise"
            >
              <Share className="w-4 h-4 text-charcoal" />
            </Button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 p-4">
          <div className="flex flex-col md:flex-row md:items-start justify-between h-full">
            <div className="flex-1">
              {/* Header */}
              <div className="mb-3">
                <h3 id={`cruise-list-${cruise.shipName}`} className="text-lg font-semibold text-charcoal mb-1">{cruise.shipName}</h3>
                <p className="text-sm text-charcoal">{cruise.cruiseLine}</p>
              </div>

              {/* Details */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
                <div className="flex items-center gap-2 text-sm text-charcoal">
                  <Calendar className="w-4 h-4 text-charcoal" aria-hidden="true" />
                  <span>{cruise.duration} nights • {formatDate(cruise.departureDate)}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-charcoal">
                  <MapPin className="w-4 h-4 text-charcoal" aria-hidden="true" />
                  <span>{cruise.route}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-charcoal">
                  <Users className="w-4 h-4 text-charcoal" aria-hidden="true" />
                  <span>From {cruise.departurePort}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" aria-hidden="true" />
                  <span className="text-sm font-medium text-charcoal">{cruise.rating}</span>
                  <span className="text-sm text-charcoal">
                    ({cruise.reviewCount?.toLocaleString() || 0} reviews)
                  </span>
                </div>
              </div>

              {/* Amenities */}
              <div className="flex flex-wrap gap-1 mb-3">
                {cruise.amenities?.slice(0, 3).map((amenity) => (
                  <span
                    key={amenity}
                    className="px-2 py-1 bg-light-gray text-charcoal text-xs rounded-full border border-border-gray"
                  >
                    {amenity}
                  </span>
                ))}
                {(cruise.amenities?.length || 0) > 3 && (
                  <span className="px-2 py-1 bg-light-gray text-charcoal text-xs rounded-full border border-border-gray">
                    +{(cruise.amenities?.length || 0) - 3} more
                  </span>
                )}
              </div>

              {/* Ports Preview */}
              <div className="text-sm text-charcoal">
                <span className="font-medium">Ports: </span>
                {formatPorts(cruise.ports)}
              </div>
            </div>

            {/* Price & CTA */}
            <div className="flex md:flex-col items-end md:items-end justify-between md:justify-start mt-4 md:mt-0 md:ml-6">
              <div className="text-right mb-3">
                <div className="text-xl font-bold text-charcoal">
                  {formatPrice(cruise.priceFrom)}
                </div>
                <div className="text-sm text-charcoal mb-1">
                  from ${Math.round(cruise.priceFrom / cruise.duration)} per night
                </div>
                <div className="text-xs text-charcoal">per person</div>
              </div>
              
              <div className="flex flex-col gap-2">
                <Button className="bg-ocean-blue hover:bg-deep-navy text-white min-w-32">
                  View Details
                </Button>
                <Button variant="outline" size="sm" className="border-ocean-blue text-ocean-blue hover:bg-ocean-blue hover:text-white">
                  <Plus className="w-4 h-4 mr-2" />
                  Compare
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CruiseListItem;
