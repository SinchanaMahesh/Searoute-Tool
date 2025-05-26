
import React from 'react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Checkbox } from '@/components/ui/checkbox';
import { X, RotateCcw } from 'lucide-react';

interface FilterSidebarProps {
  filters: any;
  onFiltersChange: (filters: any) => void;
  isOpen: boolean;
  onClose: () => void;
  isMobile?: boolean;
  className?: string;
}

const FilterSidebar = ({ 
  filters, 
  onFiltersChange, 
  isOpen, 
  onClose, 
  isMobile = false,
  className = '' 
}: FilterSidebarProps) => {
  const cruiseLines = [
    { id: 'royal-caribbean', name: 'Royal Caribbean', logo: '🚢' },
    { id: 'norwegian', name: 'Norwegian Cruise Line', logo: '⚓' },
    { id: 'carnival', name: 'Carnival Cruise Line', logo: '🎡' },
    { id: 'celebrity', name: 'Celebrity Cruises', logo: '✨' },
    { id: 'princess', name: 'Princess Cruises', logo: '👑' }
  ];

  const amenities = [
    { id: 'pool', name: 'Pool', icon: '🏊' },
    { id: 'spa', name: 'Spa', icon: '💆' },
    { id: 'kids-club', name: 'Kids Club', icon: '🧸' },
    { id: 'theater', name: 'Theater', icon: '🎭' },
    { id: 'casino', name: 'Casino', icon: '🎰' },
    { id: 'rock-climbing', name: 'Rock Climbing', icon: '🧗' }
  ];

  const clearAllFilters = () => {
    onFiltersChange({
      priceRange: [500, 5000],
      duration: [],
      departurePorts: [],
      cruiseLines: [],
      amenities: [],
      destinations: [],
      dateRange: null,
    });
  };

  return (
    <div className={`bg-white ${className} ${isMobile ? 'w-full' : 'w-80'}`}>
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-border-gray">
        <h3 className="text-lg font-semibold text-charcoal">Filters</h3>
        <div className="flex items-center gap-2">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={clearAllFilters}
            className="text-slate-gray"
          >
            <RotateCcw className="w-4 h-4 mr-1" />
            Clear All
          </Button>
          {isMobile && (
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="w-4 h-4" />
            </Button>
          )}
        </div>
      </div>

      <div className="p-4 space-y-6 overflow-y-auto max-h-[calc(100vh-200px)]">
        {/* Price Range */}
        <div className="space-y-3">
          <h4 className="font-medium text-charcoal">Price Range</h4>
          <div className="px-2">
            <Slider
              value={filters.priceRange}
              onValueChange={(value) => onFiltersChange({ ...filters, priceRange: value })}
              max={5000}
              min={500}
              step={50}
              className="w-full"
            />
            <div className="flex justify-between text-sm text-slate-gray mt-2">
              <span>${filters.priceRange[0]}</span>
              <span>${filters.priceRange[1]}+</span>
            </div>
          </div>
        </div>

        {/* Duration */}
        <div className="space-y-3">
          <h4 className="font-medium text-charcoal">Duration</h4>
          <div className="space-y-2">
            {['3-5 days', '6-7 days', '8-10 days', '11+ days'].map((duration) => (
              <div key={duration} className="flex items-center space-x-2">
                <Checkbox id={duration} />
                <label htmlFor={duration} className="text-sm text-charcoal">
                  {duration}
                </label>
              </div>
            ))}
          </div>
        </div>

        {/* Cruise Lines */}
        <div className="space-y-3">
          <h4 className="font-medium text-charcoal">Cruise Lines</h4>
          <div className="space-y-2">
            {cruiseLines.map((line) => (
              <div key={line.id} className="flex items-center space-x-3">
                <Checkbox id={line.id} />
                <span className="text-lg">{line.logo}</span>
                <label htmlFor={line.id} className="text-sm text-charcoal flex-1">
                  {line.name}
                </label>
              </div>
            ))}
          </div>
        </div>

        {/* Departure Ports */}
        <div className="space-y-3">
          <h4 className="font-medium text-charcoal">Departure Ports</h4>
          <div className="space-y-2">
            {['Miami, FL', 'Fort Lauderdale, FL', 'New York, NY', 'Galveston, TX', 'Seattle, WA'].map((port) => (
              <div key={port} className="flex items-center space-x-2">
                <Checkbox id={port} />
                <label htmlFor={port} className="text-sm text-charcoal">
                  {port}
                </label>
              </div>
            ))}
          </div>
        </div>

        {/* Ship Amenities */}
        <div className="space-y-3">
          <h4 className="font-medium text-charcoal">Ship Amenities</h4>
          <div className="grid grid-cols-2 gap-2">
            {amenities.map((amenity) => (
              <div key={amenity.id} className="flex items-center space-x-2 p-2 rounded-lg border border-border-gray hover:bg-light-gray transition-colors">
                <Checkbox id={amenity.id} />
                <span className="text-sm">{amenity.icon}</span>
                <label htmlFor={amenity.id} className="text-xs text-charcoal flex-1">
                  {amenity.name}
                </label>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Mobile Apply Button */}
      {isMobile && (
        <div className="p-4 border-t border-border-gray">
          <Button onClick={onClose} className="w-full bg-ocean-blue hover:bg-deep-navy">
            Apply Filters
          </Button>
        </div>
      )}
    </div>
  );
};

export default FilterSidebar;
