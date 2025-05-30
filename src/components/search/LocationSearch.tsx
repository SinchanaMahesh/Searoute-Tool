
import React, { useState, useEffect, useRef } from 'react';
import { MapPin, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface LocationResult {
  display_name: string;
  lat: string;
  lon: string;
  place_id: string;
}

interface LocationSearchProps {
  onLocationSelect: (location: string) => void;
}

const LocationSearch = ({ onLocationSelect }: LocationSearchProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [suggestions, setSuggestions] = useState<LocationResult[]>([]);
  const [selectedLocation, setSelectedLocation] = useState('Miami, FL');
  const [isLoading, setIsLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isEditing]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsEditing(false);
        setSuggestions([]);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const searchLocations = async (query: string) => {
    if (query.length < 2) {
      setSuggestions([]);
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&limit=5&addressdetails=1`
      );
      const results = await response.json();
      setSuggestions(results);
    } catch (error) {
      console.error('Location search error:', error);
      setSuggestions([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (searchQuery) {
        searchLocations(searchQuery);
      }
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [searchQuery]);

  const handleLocationClick = (location: LocationResult) => {
    const locationName = location.display_name.split(',').slice(0, 2).join(',');
    setSelectedLocation(locationName);
    setIsEditing(false);
    setSuggestions([]);
    setSearchQuery('');
    onLocationSelect(locationName);
  };

  if (isEditing) {
    return (
      <div className="relative" ref={dropdownRef}>
        <div className="flex items-center gap-2 bg-white border border-border-gray rounded-lg px-3 py-2 min-w-[250px]">
          <Search className="w-4 h-4 text-slate-gray" />
          <Input
            ref={inputRef}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search cities worldwide..."
            className="border-0 p-0 h-auto focus-visible:ring-0 text-sm"
            onKeyPress={(e) => e.key === 'Escape' && setIsEditing(false)}
          />
        </div>
        
        {(suggestions.length > 0 || isLoading) && (
          <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-border-gray rounded-lg shadow-lg z-50 max-h-64 overflow-y-auto">
            {isLoading ? (
              <div className="p-3 text-sm text-slate-gray">Searching...</div>
            ) : (
              suggestions.map((location) => (
                <button
                  key={location.place_id}
                  onClick={() => handleLocationClick(location)}
                  className="w-full text-left p-3 hover:bg-light-gray border-b border-border-gray last:border-b-0 transition-colors"
                >
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-ocean-blue flex-shrink-0" />
                    <span className="text-sm text-charcoal truncate">
                      {location.display_name}
                    </span>
                  </div>
                </button>
              ))
            )}
          </div>
        )}
      </div>
    );
  }

  return (
    <Button
      variant="outline"
      onClick={() => setIsEditing(true)}
      className="text-left justify-start h-auto py-2 px-3 border-border-gray hover:border-ocean-blue transition-colors"
    >
      <div className="flex items-center gap-2">
        <MapPin className="w-4 h-4 text-ocean-blue" />
        <div>
          <div className="text-sm font-medium text-charcoal">
            {selectedLocation}
          </div>
          <div className="text-xs text-slate-gray">Click to change location</div>
        </div>
      </div>
    </Button>
  );
};

export default LocationSearch;
