
import React from 'react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Checkbox } from '@/components/ui/checkbox';
import { X, RotateCcw } from 'lucide-react';
import { CruiseData } from '@/api/mockCruiseData';

interface FilterDrawerProps {
  filters: any;
  onFiltersChange: (filters: any) => void;
  onClose: () => void;
  cruises: CruiseData[];
  isOpen: boolean;
}

const FilterDrawer = ({ filters, onFiltersChange, onClose, cruises, isOpen }: FilterDrawerProps) => {
  const cruiseLines = [...new Set(cruises.map(c => c.cruiseLine))].map(line => ({
    id: line.toLowerCase().replace(/\s+/g, '-'),
    name: line,
    count: cruises.filter(c => c.cruiseLine === line).length
  }));

  const departurePorts = [...new Set(cruises.map(c => c.departurePort))].map(port => ({
    id: port.toLowerCase().replace(/\s+/g, '-'),
    name: port,
    count: cruises.filter(c => c.departurePort === port).length
  }));

  const amenities = [
    { id: 'pool', name: 'Pool', icon: '🏊' },
    { id: 'spa', name: 'Spa', icon: '💆' },
    { id: 'kids-club', name: 'Kids Club', icon: '🧸' },
    { id: 'theater', name: 'Theater', icon: '🎭' },
    { id: 'casino', name: 'Casino', icon: '🎰' },
    { id: 'fitness-center', name: 'Fitness Center', icon: '💪' }
  ];

  const clearAllFilters = () => {
    onFiltersChange({
      priceRange: [0, 10000],
      duration: [],
      departurePorts: [],
      cruiseLines: [],
      amenities: [],
      destinations: [],
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex">
      <div className="ml-auto w-80 h-full bg-white shadow-xl flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-border-gray">
          <h3 className="text-lg font-semibold text-charcoal">Filter Cruises</h3>
          <div className="flex items-center gap-2">
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={clearAllFilters}
              className="text-slate-gray"
            >
              <RotateCcw className="w-4 h-4 mr-1" />
              Clear
            </Button>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Filters */}
        <div className="flex-1 overflow-y-auto p-4 space-y-6">
          {/* Price Range */}
          <div className="space-y-3">
            <h4 className="font-medium text-charcoal">Price Range</h4>
            <div className="px-2">
              <Slider
                value={filters.priceRange}
                onValueChange={(value) => onFiltersChange({ ...filters, priceRange: value })}
                max={10000}
                min={0}
                step={100}
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
                  <Checkbox 
                    id={duration}
                    checked={filters.duration.includes(duration)}
                    onCheckedChange={(checked) => {
                      const newDuration = checked 
                        ? [...filters.duration, duration]
                        : filters.duration.filter((d: string) => d !== duration);
                      onFiltersChange({ ...filters, duration: newDuration });
                    }}
                  />
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
                <div key={line.id} className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id={line.id}
                      checked={filters.cruiseLines.includes(line.name)}
                      onCheckedChange={(checked) => {
                        const newLines = checked 
                          ? [...filters.cruiseLines, line.name]
                          : filters.cruiseLines.filter((l: string) => l !== line.name);
                        onFiltersChange({ ...filters, cruiseLines: newLines });
                      }}
                    />
                    <label htmlFor={line.id} className="text-sm text-charcoal">
                      {line.name}
                    </label>
                  </div>
                  <span className="text-xs text-slate-gray">({line.count})</span>
                </div>
              ))}
            </div>
          </div>

          {/* Departure Ports */}
          <div className="space-y-3">
            <h4 className="font-medium text-charcoal">Departure Ports</h4>
            <div className="space-y-2">
              {departurePorts.map((port) => (
                <div key={port.id} className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id={port.id}
                      checked={filters.departurePorts.includes(port.name)}
                      onCheckedChange={(checked) => {
                        const newPorts = checked 
                          ? [...filters.departurePorts, port.name]
                          : filters.departurePorts.filter((p: string) => p !== port.name);
                        onFiltersChange({ ...filters, departurePorts: newPorts });
                      }}
                    />
                    <label htmlFor={port.id} className="text-sm text-charcoal">
                      {port.name}
                    </label>
                  </div>
                  <span className="text-xs text-slate-gray">({port.count})</span>
                </div>
              ))}
            </div>
          </div>

          {/* Amenities */}
          <div className="space-y-3">
            <h4 className="font-medium text-charcoal">Ship Amenities</h4>
            <div className="grid grid-cols-1 gap-2">
              {amenities.map((amenity) => (
                <div key={amenity.id} className="flex items-center space-x-2 p-2 rounded-lg border border-border-gray hover:bg-light-gray transition-colors">
                  <Checkbox 
                    id={amenity.id}
                    checked={filters.amenities.includes(amenity.name)}
                    onCheckedChange={(checked) => {
                      const newAmenities = checked 
                        ? [...filters.amenities, amenity.name]
                        : filters.amenities.filter((a: string) => a !== amenity.name);
                      onFiltersChange({ ...filters, amenities: newAmenities });
                    }}
                  />
                  <span className="text-sm">{amenity.icon}</span>
                  <label htmlFor={amenity.id} className="text-sm text-charcoal flex-1">
                    {amenity.name}
                  </label>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Apply Button */}
        <div className="p-4 border-t border-border-gray">
          <Button onClick={onClose} className="w-full bg-ocean-blue hover:bg-deep-navy">
            Apply Filters
          </Button>
        </div>
      </div>
    </div>
  );
};

export default FilterDrawer;
