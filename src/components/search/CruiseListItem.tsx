
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
      className={`bg-white rounded-lg border border-border-gray overflow-hidden transition-all duration-300 ${
        isHovered ? 'shadow-level-2 scale-[1.02]' : 'shadow-level-1'
      }`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="flex flex-col md:flex-row">
        {/* Image */}
        <div className="relative md:w-80 h-48 md:h-auto overflow-hidden">
          <img
            src={cruise.images[0] || defaultImage}
            alt={cruise.shipName}
            className="w-full h-full object-cover"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.src = defaultImage;
            }}
          />
          
          {/* Badges */}
          <div className="absolute top-3 left-3 flex flex-col gap-1">
            {cruise.savings && (
              <div className="bg-seafoam-green text-white px-2 py-1 rounded-full text-xs font-medium">
                Save ${cruise.savings}
              </div>
            )}
            {cruise.isPopular && (
              <div className="bg-sunset-orange text-white px-2 py-1 rounded-full text-xs font-medium">
                Popular
              </div>
            )}
          </div>

          {/* Hover icon indicator */}
          <div className={`absolute top-3 right-3 transition-opacity duration-300 ${
            isHovered ? 'opacity-100' : 'opacity-0'
          }`}>
            <div className="w-8 h-8 bg-ocean-blue/90 rounded-full flex items-center justify-center">
              <ExternalLink className="w-4 h-4 text-white" />
            </div>
          </div>

          {/* Quick Actions */}
          <div className={`absolute top-3 right-14 flex gap-1 transition-opacity duration-300 ${
            isHovered ? 'opacity-100' : 'opacity-0'
          }`}>
            <Button
              size="icon"
              variant="secondary"
              className="w-8 h-8 bg-white/90 hover:bg-white"
              onClick={() => setIsSaved(!isSaved)}
            >
              <Heart className={`w-4 h-4 ${isSaved ? 'fill-coral-pink text-coral-pink' : 'text-slate-gray'}`} />
            </Button>
            <Button
              size="icon"
              variant="secondary"
              className="w-8 h-8 bg-white/90 hover:bg-white"
            >
              <Share className="w-4 h-4 text-slate-gray" />
            </Button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 p-6">
          <div className="flex flex-col md:flex-row md:items-start justify-between h-full">
            <div className="flex-1">
              {/* Header */}
              <div className="mb-3">
                <h3 className="text-xl font-semibold text-charcoal mb-1">{cruise.shipName}</h3>
                <p className="text-slate-gray">{cruise.cruiseLine}</p>
              </div>

              {/* Details */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                <div className="flex items-center gap-2 text-sm text-charcoal">
                  <Calendar className="w-4 h-4 text-slate-gray" />
                  <span>{cruise.duration} nights • {formatDate(cruise.departureDate)}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-charcoal">
                  <MapPin className="w-4 h-4 text-slate-gray" />
                  <span>{cruise.route} • {cruise.ports.length} ports</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-charcoal">
                  <Users className="w-4 h-4 text-slate-gray" />
                  <span>Departs from {cruise.departurePort}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  <span className="text-sm font-medium text-charcoal">{cruise.rating}</span>
                  <span className="text-sm text-slate-gray">
                    ({cruise.reviewCount.toLocaleString()} reviews)
                  </span>
                </div>
              </div>

              {/* Amenities */}
              <div className="flex flex-wrap gap-1 mb-4">
                {cruise.amenities.slice(0, 4).map((amenity) => (
                  <span
                    key={amenity}
                    className="px-2 py-1 bg-light-gray text-slate-gray text-xs rounded-full"
                  >
                    {amenity}
                  </span>
                ))}
                {cruise.amenities.length > 4 && (
                  <span className="px-2 py-1 bg-light-gray text-slate-gray text-xs rounded-full">
                    +{cruise.amenities.length - 4} more
                  </span>
                )}
              </div>

              {/* Ports Preview */}
              <div className="text-sm text-slate-gray">
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
                <div className="text-sm text-slate-gray mb-1">
                  from ${Math.round(cruise.priceFrom / cruise.duration)} per night
                </div>
                <div className="text-xs text-slate-gray">per person</div>
              </div>
              
              <div className="flex flex-col gap-2">
                <Button className="bg-ocean-blue hover:bg-deep-navy text-white min-w-32">
                  View Details
                </Button>
                <Button variant="outline" size="sm" className="border-ocean-blue text-ocean-blue hover:bg-ocean-blue hover:text-white">
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
