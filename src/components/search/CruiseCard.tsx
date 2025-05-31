
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Heart, Share, Plus, Star, Calendar, MapPin, ExternalLink } from 'lucide-react';
import { CruiseData } from '@/api/mockCruiseData';
import CompactDateSelector from './CompactDateSelector';

interface CruiseCardProps {
  cruise: CruiseData;
  showHoverIcon?: boolean;
  onCompareAdd?: (cruise: CruiseData) => void;
}

const CruiseCard = ({ cruise, showHoverIcon = true, onCompareAdd }: CruiseCardProps) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isSaved, setIsSaved] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [selectedDate, setSelectedDate] = useState(cruise.departureDate);

  const defaultImage = "https://images.unsplash.com/photo-1500375592092-40eb2168fd21?w=400";

  // Generate sailing dates for this cruise
  const generateSailingDates = () => {
    const dates = [];
    const baseDate = new Date(cruise.departureDate);
    for (let i = 0; i < 6; i++) {
      const date = new Date(baseDate);
      date.setDate(baseDate.getDate() + (i * 14)); // Every 2 weeks
      dates.push(date.toISOString().split('T')[0]);
    }
    return dates;
  };

  const sailingDates = generateSailingDates();

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
      className={`bg-white rounded-xl border border-border-gray overflow-hidden transition-all duration-300 cursor-pointer ${
        isHovered ? 'shadow-level-3' : 'shadow-level-1'
      }`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      role="article"
      aria-labelledby={`cruise-${cruise.shipName}`}
    >
      {/* Image Gallery */}
      <div className="relative h-64 overflow-hidden">
        <img
          src={cruise.images[currentImageIndex] || defaultImage}
          alt={`${cruise.shipName} cruise ship`}
          className="w-full h-full object-cover transition-all duration-300"
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.src = defaultImage;
          }}
        />
        
        {/* Price Badge */}
        <div className="absolute top-4 right-4 bg-ocean-blue text-white px-4 py-2 rounded-full text-base font-semibold shadow-md">
          From {formatPrice(cruise.priceFrom)}
        </div>

        {/* Savings Badge */}
        {cruise.savings && (
          <div className="absolute top-4 left-4 bg-seafoam-green text-white px-3 py-2 rounded-full text-sm font-medium shadow-md">
            Save ${cruise.savings}
          </div>
        )}

        {/* Popular Badge */}
        {cruise.isPopular && (
          <div className="absolute top-16 left-4 bg-sunset-orange text-white px-3 py-2 rounded-full text-sm font-medium shadow-md">
            Popular
          </div>
        )}

        {/* Hover icon indicator */}
        {showHoverIcon && (
          <div className={`absolute bottom-4 right-4 transition-opacity duration-300 ${
            isHovered ? 'opacity-100' : 'opacity-0'
          }`}>
            <div className="w-12 h-12 bg-white/95 rounded-full flex items-center justify-center shadow-lg border border-border-gray">
              <ExternalLink className="w-6 h-6 text-ocean-blue" />
            </div>
          </div>
        )}

        {/* Image Navigation Dots */}
        {cruise.images.length > 1 && (
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-3">
            {cruise.images.map((_, index) => (
              <button
                key={index}
                onClick={(e) => {
                  e.stopPropagation();
                  setCurrentImageIndex(index);
                }}
                className={`w-4 h-4 rounded-full transition-colors min-w-[16px] min-h-[16px] ${
                  index === currentImageIndex ? 'bg-white shadow-md' : 'bg-white/60'
                }`}
                aria-label={`View image ${index + 1} of ${cruise.images.length}`}
              />
            ))}
          </div>
        )}

        {/* Quick Actions */}
        <div className={`absolute top-4 left-4 flex flex-col gap-3 transition-opacity ${
          isHovered ? 'opacity-100' : 'opacity-0'
        }`}>
          <Button
            size="icon"
            variant="secondary"
            className="w-12 h-12 bg-white/95 hover:bg-white border border-border-gray shadow-md min-w-[52px] min-h-[52px]"
            onClick={(e) => {
              e.stopPropagation();
              setIsSaved(!isSaved);
            }}
            aria-label={isSaved ? 'Remove from favorites' : 'Add to favorites'}
          >
            <Heart className={`w-6 h-6 ${isSaved ? 'fill-coral-pink text-coral-pink' : 'text-charcoal'}`} />
          </Button>
          <Button
            size="icon"
            variant="secondary"
            className="w-12 h-12 bg-white/95 hover:bg-white border border-border-gray shadow-md min-w-[52px] min-h-[52px]"
            onClick={(e) => e.stopPropagation()}
            aria-label="Share cruise"
          >
            <Share className="w-6 h-6 text-charcoal" />
          </Button>
        </div>
      </div>

      {/* Card Content */}
      <div className="p-5">
        {/* Ship & Cruise Line */}
        <div className="mb-3">
          <h3 id={`cruise-${cruise.shipName}`} className="text-xl font-semibold text-charcoal mb-1">{cruise.shipName}</h3>
          <p className="text-base text-charcoal">{cruise.cruiseLine}</p>
        </div>

        {/* Duration & Route */}
        <div className="mb-4">
          <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 text-base text-charcoal mb-2">
            <div className="flex items-center gap-2">
              <Calendar className="w-5 h-5 text-charcoal flex-shrink-0" aria-hidden="true" />
              <span>{cruise.duration} nights</span>
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="w-5 h-5 text-charcoal flex-shrink-0" aria-hidden="true" />
              <span className="truncate">{cruise.route}</span>
            </div>
          </div>
          <p className="text-base text-charcoal">
            {cruise.ports.length} ports • Departs {formatDate(cruise.departureDate)}
          </p>
        </div>

        {/* Rating & Reviews */}
        <div className="flex items-center gap-3 mb-5">
          <div className="flex items-center gap-2">
            <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" aria-hidden="true" />
            <span className="text-base font-medium text-charcoal">{cruise.rating}</span>
          </div>
          <span className="text-base text-charcoal">
            ({cruise.reviewCount.toLocaleString()} reviews)
          </span>
        </div>

        {/* Amenities Preview */}
        <div className="flex flex-wrap gap-2 mb-5">
          {cruise.amenities.slice(0, 3).map((amenity) => (
            <span
              key={amenity}
              className="px-3 py-2 bg-light-gray text-charcoal text-sm rounded-full border border-border-gray"
            >
              {amenity}
            </span>
          ))}
          {cruise.amenities.length > 3 && (
            <span className="px-3 py-2 bg-light-gray text-charcoal text-sm rounded-full border border-border-gray">
              +{cruise.amenities.length - 3} more
            </span>
          )}
        </div>

        {/* Sailing Dates Selector */}
        <div className="mb-5">
          <CompactDateSelector
            sailingDates={sailingDates}
            selectedDate={selectedDate}
            onDateSelect={setSelectedDate}
            shipName={cruise.shipName}
          />
        </div>

        {/* Price & CTA */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="text-2xl font-bold text-charcoal">
              {formatPrice(cruise.priceFrom)}
            </div>
            <div className="text-sm text-charcoal">
              ${Math.round(cruise.priceFrom / cruise.duration)} per night
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button className="bg-ocean-blue hover:bg-deep-navy text-white">
              View Details
            </Button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onCompareAdd?.(cruise);
              }}
              className="text-ocean-blue hover:text-deep-navy text-sm underline"
            >
              + Compare
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CruiseCard;
