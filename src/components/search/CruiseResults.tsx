
import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Cruise } from '@/pages/Search';
import { Star, Heart, Share, GitCompare } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface CruiseResultsProps {
  cruises: Cruise[];
  isLoading: boolean;
  onCruiseHover: (cruiseId: string | null) => void;
  sortBy: string;
  onSortChange: (value: string) => void;
}

const CruiseResults = ({ cruises, isLoading, onCruiseHover, sortBy, onSortChange }: CruiseResultsProps) => {
  if (isLoading) {
    return (
      <div className="p-6">
        <div className="grid gap-6">
          {Array.from({ length: 4 }).map((_, i) => (
            <CruiseCardSkeleton key={i} />
          ))}
        </div>
      </div>
    );
  }

  if (cruises.length === 0) {
    return (
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="text-center">
          <div className="w-24 h-24 mx-auto mb-4 bg-light-gray rounded-full flex items-center justify-center">
            <span className="text-3xl">🚢</span>
          </div>
          <h3 className="text-xl font-semibold text-charcoal mb-2">No cruises found</h3>
          <p className="text-slate-gray mb-6">Try adjusting your search or chat with our AI for suggestions</p>
        </div>
      </div>
    );
  }

  const sortedCruises = [...cruises].sort((a, b) => {
    switch (sortBy) {
      case 'price':
        return a.priceFrom - b.priceFrom;
      case 'duration':
        return a.duration - b.duration;
      case 'rating':
        return b.rating - a.rating;
      case 'departure':
        return new Date(a.departureDate).getTime() - new Date(b.departureDate).getTime();
      default:
        return 0;
    }
  });

  return (
    <div className="h-full flex flex-col">
      {/* Sort Controls */}
      <div className="p-4 border-b border-border-gray bg-white">
        <div className="flex items-center justify-between">
          <div className="text-sm text-slate-gray">
            Showing {cruises.length} results
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm text-slate-gray">Sort by:</span>
            <Select value={sortBy} onValueChange={onSortChange}>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="price">Price</SelectItem>
                <SelectItem value="duration">Duration</SelectItem>
                <SelectItem value="rating">Rating</SelectItem>
                <SelectItem value="departure">Departure</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Results Grid */}
      <div className="flex-1 overflow-y-auto p-6">
        <div className="grid gap-6">
          {sortedCruises.map((cruise) => (
            <CruiseCard 
              key={cruise.id} 
              cruise={cruise} 
              onHover={onCruiseHover}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

// Individual Cruise Card Component
const CruiseCard = ({ cruise, onHover }: { cruise: Cruise; onHover: (cruiseId: string | null) => void }) => {
  const handleViewDetails = () => {
    // Navigate to cruise details page or open external link
    // For now, we'll create a details URL pattern
    const detailsUrl = `/cruise/${cruise.id}`;
    window.open(detailsUrl, '_blank');
  };

  return (
    <div 
      className="bg-white rounded-lg border border-border-gray overflow-hidden hover:shadow-level-2 transition-all duration-300 hover:scale-[1.02] cursor-pointer"
      onMouseEnter={() => onHover(cruise.id)}
      onMouseLeave={() => onHover(null)}
    >
      <div className="flex">
        {/* Image Section */}
        <div className="w-80 h-48 relative">
          <img 
            src={cruise.images[0]} 
            alt={cruise.shipName}
            className="w-full h-full object-cover"
          />
          {/* Price Badge */}
          <div className="absolute top-3 right-3 bg-ocean-blue text-white px-3 py-1 rounded-full text-sm font-semibold">
            ${cruise.priceFrom}
          </div>
          {/* Savings Badge */}
          {cruise.savings && (
            <div className="absolute top-3 left-3 bg-coral-pink text-white px-2 py-1 rounded text-xs font-medium">
              Save ${cruise.savings}
            </div>
          )}
          {/* Popular Badge */}
          {cruise.isPopular && (
            <div className="absolute bottom-3 left-3 bg-sunset-orange text-white px-2 py-1 rounded text-xs font-medium">
              Popular
            </div>
          )}
        </div>

        {/* Content Section */}
        <div className="flex-1 p-6">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h3 className="text-lg font-semibold text-charcoal mb-1">{cruise.shipName}</h3>
              <p className="text-sm text-slate-gray">{cruise.cruiseLine}</p>
            </div>
            <div className="flex gap-2">
              <Button variant="ghost" size="sm" className="text-slate-gray hover:text-coral-pink">
                <Heart className="w-4 h-4" />
              </Button>
              <Button variant="ghost" size="sm" className="text-slate-gray hover:text-ocean-blue">
                <Share className="w-4 h-4" />
              </Button>
              <Button variant="ghost" size="sm" className="text-slate-gray hover:text-sunset-orange">
                <GitCompare className="w-4 h-4" />
              </Button>
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex items-center gap-4 text-sm">
              <span className="font-medium text-charcoal">{cruise.duration} days</span>
              <span className="text-slate-gray">•</span>
              <span className="text-slate-gray">Departs {new Date(cruise.departureDate).toLocaleDateString()}</span>
              <span className="text-slate-gray">•</span>
              <span className="text-slate-gray">{cruise.departurePort}</span>
            </div>

            <div className="text-sm text-slate-gray">
              <span className="font-medium text-charcoal">{cruise.route}</span> • {cruise.ports.length} ports
            </div>

            {/* Ports List */}
            <div className="text-sm text-slate-gray">
              <span className="font-medium text-charcoal">Ports: </span>
              {cruise.ports.slice(0, 4).join(' → ')}
              {cruise.ports.length > 4 && ` → +${cruise.ports.length - 4} more`}
            </div>

            <div className="flex items-center gap-2">
              <div className="flex items-center">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star 
                    key={i} 
                    className={`w-4 h-4 ${
                      i < Math.floor(cruise.rating) 
                        ? 'text-yellow-400 fill-current' 
                        : 'text-gray-300'
                    }`} 
                  />
                ))}
              </div>
              <span className="text-sm font-medium text-charcoal">{cruise.rating}</span>
              <span className="text-sm text-slate-gray">({cruise.reviewCount.toLocaleString()} reviews)</span>
            </div>

            <div className="flex items-center justify-between pt-2">
              <div className="flex flex-wrap gap-2">
                {cruise.amenities.slice(0, 4).map((amenity, index) => (
                  <span 
                    key={index}
                    className="text-xs bg-light-gray text-slate-gray px-2 py-1 rounded-full"
                  >
                    {amenity}
                  </span>
                ))}
                {cruise.amenities.length > 4 && (
                  <span className="text-xs text-ocean-blue">+{cruise.amenities.length - 4} more</span>
                )}
              </div>
              
              <div className="flex items-center gap-3">
                <div className="text-right">
                  <div className="text-lg font-bold text-sunset-orange">${cruise.priceFrom}</div>
                  <div className="text-xs text-slate-gray">per person</div>
                </div>
                <Button 
                  onClick={handleViewDetails}
                  className="bg-ocean-blue hover:bg-deep-navy text-white"
                >
                  View Details
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Skeleton component for loading state
const CruiseCardSkeleton = () => (
  <div className="bg-white rounded-lg border border-border-gray overflow-hidden animate-pulse">
    <div className="flex">
      <div className="w-80 h-48 bg-gray-200" />
      <div className="flex-1 p-6">
        <div className="h-4 bg-gray-200 rounded mb-2 w-3/4" />
        <div className="h-3 bg-gray-200 rounded mb-4 w-1/2" />
        <div className="space-y-2">
          <div className="h-3 bg-gray-200 rounded w-full" />
          <div className="h-3 bg-gray-200 rounded w-2/3" />
          <div className="h-3 bg-gray-200 rounded w-1/2" />
        </div>
      </div>
    </div>
  </div>
);

export default CruiseResults;
