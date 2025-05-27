
import React from 'react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Checkbox } from '@/components/ui/checkbox';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { X, RotateCcw, MessageCircle, CalendarIcon } from 'lucide-react';
import { Cruise } from '@/pages/Search';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';

interface FilterPanelProps {
  filters: any;
  onFiltersChange: (filters: any) => void;
  onClose: () => void;
  cruises: Cruise[];
}

const FilterPanel = ({ filters, onFiltersChange, onClose, cruises }: FilterPanelProps) => {
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
    { id: 'rock-climbing', name: 'Rock Climbing', icon: '🧗' }
  ];

  const clearAllFilters = () => {
    const today = new Date();
    const threeMonthsLater = new Date(today);
    threeMonthsLater.setMonth(today.getMonth() + 3);
    
    onFiltersChange({
      priceRange: [0, 20000],
      duration: [],
      departurePorts: [],
      cruiseLines: [],
      amenities: [],
      destinations: [],
      dateRange: {
        from: today,
        to: threeMonthsLater
      },
    });
  };

  return (
    <div className="h-full bg-white flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-border-gray">
        <h3 className="text-lg font-semibold text-charcoal">Advanced Filters</h3>
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
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* AI Filter Suggestion */}
      <div className="p-4 bg-gradient-to-r from-ocean-blue/5 to-seafoam-green/5 border-b border-border-gray">
        <div className="flex items-center gap-3 mb-2">
          <MessageCircle className="w-4 h-4 text-ocean-blue" />
          <span className="text-sm font-medium text-charcoal">AI Filter Assistant</span>
        </div>
        <p className="text-xs text-slate-gray">
          Use the chat interface on the left to filter cruises with natural language, 
          or use the manual filters below.
        </p>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        {/* Date Range */}
        <div className="space-y-3">
          <h4 className="font-medium text-charcoal">Departure Date Range</h4>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "w-full justify-start text-left font-normal",
                  !filters.dateRange && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {filters.dateRange?.from ? (
                  filters.dateRange.to ? (
                    <>
                      {format(filters.dateRange.from, "LLL dd, y")} -{" "}
                      {format(filters.dateRange.to, "LLL dd, y")}
                    </>
                  ) : (
                    format(filters.dateRange.from, "LLL dd, y")
                  )
                ) : (
                  <span>Pick a date range</span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                initialFocus
                mode="range"
                defaultMonth={filters.dateRange?.from}
                selected={filters.dateRange}
                onSelect={(range) => onFiltersChange({ ...filters, dateRange: range })}
                numberOfMonths={2}
                className="pointer-events-auto"
              />
            </PopoverContent>
          </Popover>
        </div>

        {/* Price Range */}
        <div className="space-y-3">
          <h4 className="font-medium text-charcoal">Price Range</h4>
          <div className="px-2">
            <Slider
              value={filters.priceRange}
              onValueChange={(value) => onFiltersChange({ ...filters, priceRange: value })}
              max={20000}
              min={0}
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
              <div key={line.id} className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Checkbox id={line.id} />
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
                  <Checkbox id={port.id} />
                  <label htmlFor={port.id} className="text-sm text-charcoal">
                    {port.name}
                  </label>
                </div>
                <span className="text-xs text-slate-gray">({port.count})</span>
              </div>
            ))}
          </div>
        </div>

        {/* Ship Amenities */}
        <div className="space-y-3">
          <h4 className="font-medium text-charcoal">Ship Amenities</h4>
          <div className="grid grid-cols-1 gap-2">
            {amenities.map((amenity) => (
              <div key={amenity.id} className="flex items-center space-x-2 p-2 rounded-lg border border-border-gray hover:bg-light-gray transition-colors">
                <Checkbox id={amenity.id} />
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
  );
};

export default FilterPanel;
