
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Heart, Share, Calendar, MapPin, Users } from 'lucide-react';
import { CruiseData } from '@/api/mockCruiseData';
import { getImageWithFallback, handleImageError } from '@/utils/imageUtils';
import CompactDateSelector from './CompactDateSelector';
import StarRating from '@/components/shared/StarRating';
import PriceDisplay from '@/components/shared/PriceDisplay';
import PortsList from '@/components/shared/PortsList';

interface CruiseListItemProps {
  cruise: CruiseData;
  onCompareAdd?: (cruise: CruiseData) => void;
}

const CruiseListItem = ({ cruise, onCompareAdd }: CruiseListItemProps) => {
  const navigate = useNavigate();
  const [isSaved, setIsSaved] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [selectedDate, setSelectedDate] = useState(cruise.departureDate);

  const generateSailingDates = () => {
    const dates = [];
    const baseDate = new Date(cruise.departureDate);
    for (let i = 0; i < 6; i++) {
      const date = new Date(baseDate);
      date.setDate(baseDate.getDate() + (i * 14));
      dates.push(date.toISOString().split('T')[0]);
    }
    return dates;
  };

  const sailingDates = generateSailingDates();

  const handleViewDetails = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigate(`/cruise/${cruise.id}`);
  };

  return (
    <div 
      className={`bg-white rounded-lg border border-border-gray overflow-hidden transition-all duration-300 relative h-80 ${
        isHovered ? 'shadow-level-2' : 'shadow-level-1'
      }`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      role="article"
      aria-labelledby={`cruise-list-${cruise.shipName}`}
    >
      <div className="flex flex-col md:flex-row h-full">
        {/* Image */}
        <div className="relative md:w-96 h-48 md:h-full overflow-hidden flex-shrink-0">
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
        <div className="flex-1 p-4 flex flex-col">
          <div className="flex flex-col md:flex-row md:items-start justify-between flex-1">
            <div className="flex-1 min-h-0">
              {/* Header */}
              <div className="mb-3">
                <h3 id={`cruise-list-${cruise.shipName}`} className="text-lg font-semibold text-charcoal mb-1">{cruise.shipName}</h3>
                <p className="text-sm text-charcoal">{cruise.cruiseLine}</p>
              </div>

              {/* Ports Preview */}
              <div className="mb-3">
                <PortsList ports={cruise.ports} maxDisplay={4} />
              </div>

              {/* Itinerary */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
                <div className="flex items-center gap-2 text-sm text-charcoal">
                  <Calendar className="w-4 h-4 text-charcoal" aria-hidden="true" />
                  <span>{cruise.duration} nights visiting {cruise.ports ? Object.keys(cruise.ports).length : 0} ports</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-charcoal">
                  <MapPin className="w-4 h-4 text-charcoal" aria-hidden="true" />
                  <span>{cruise.route}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-charcoal">
                  <Users className="w-4 h-4 text-charcoal" aria-hidden="true" />
                  <span>From {cruise.departurePort}</span>
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
            </div>

            {/* Price & CTA */}
            <div className="flex md:flex-col items-end md:items-end justify-between md:justify-start mt-4 md:mt-0 md:ml-6 flex-shrink-0">
              <PriceDisplay 
                price={cruise.priceFrom} 
                duration={cruise.duration} 
                className="mb-3"
              />
              
              <div className="flex flex-col gap-2 items-end">
                <Button 
                  className="bg-ocean-blue hover:bg-deep-navy text-white min-w-32"
                  onClick={handleViewDetails}
                >
                  View Details
                </Button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onCompareAdd?.(cruise);
                  }}
                  className="text-ocean-blue hover:text-deep-navy text-sm underline text-center mb-6"
                >
                  + Compare
                </button>
                
                {/* Star Rating - Moved below amenities, aligned with date selector */}
                <div className="mb-6">
                  <StarRating 
                    rating={cruise.rating} 
                    reviewCount={cruise.reviewCount}
                  />
                </div>
                
                {/* Sailing Dates Selector */}
                <div className="mt-1">
                  <CompactDateSelector
                    sailingDates={sailingDates}
                    selectedDate={selectedDate}
                    onDateSelect={setSelectedDate}
                    shipName={cruise.shipName}
                  />
                  <div className="text-xs text-slate-gray mt-2 text-center">
                    {sailingDates.length - 1} more sailing dates available
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CruiseListItem;
