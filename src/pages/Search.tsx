
import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import Header from '@/components/layout/Header';
import SearchResultsChat from '@/components/search/SearchResultsChat';
import RouteMap from '@/components/search/RouteMap';
import CruiseResults from '@/components/search/CruiseResults';
import FilterPanel from '@/components/search/FilterPanel';
import { Button } from '@/components/ui/button';
import { Filter } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';

export interface Cruise {
  id: string;
  shipName: string;
  cruiseLine: string;
  duration: number;
  departureDate: string;
  departurePort: string;
  route: string;
  ports: string[];
  priceFrom: number;
  rating: number;
  reviewCount: number;
  images: string[];
  amenities: string[];
  savings?: number;
  isPopular?: boolean;
  itinerary?: {
    days: Array<{
      day: number;
      port: string;
      coordinates: [number, number];
      activities?: string[];
    }>;
  };
}

const Search = () => {
  const [searchParams] = useSearchParams();
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [filters, setFilters] = useState({
    priceRange: [500, 5000],
    duration: [],
    departurePorts: [],
    cruiseLines: [],
    amenities: [],
    destinations: [],
    dateRange: null,
  });
  const [sortBy, setSortBy] = useState('price');
  const [hoveredCruise, setHoveredCruise] = useState<string | null>(null);

  const query = searchParams.get('q') || '';
  const searchType = searchParams.get('type') || 'chat';

  // Fetch cruises from API
  const { data: cruisesData, isLoading, error } = useQuery({
    queryKey: ['cruises'],
    queryFn: async () => {
      const response = await fetch('https://travtech.tech:3333/api/v3/Getcruises?skin=1020');
      if (!response.ok) {
        throw new Error('Failed to fetch cruises');
      }
      return response.json();
    },
  });

  const cruises: Cruise[] = cruisesData?.data?.map((cruise: any, index: number) => ({
    id: cruise.id || `cruise-${index}`,
    shipName: cruise.shipName || cruise.name || 'Unknown Ship',
    cruiseLine: cruise.cruiseLine || cruise.line || 'Unknown Line',
    duration: cruise.duration || cruise.nights || 7,
    departureDate: cruise.departureDate || cruise.sailDate || new Date().toISOString().split('T')[0],
    departurePort: cruise.departurePort || cruise.port || 'Miami, FL',
    route: cruise.route || cruise.destination || 'Caribbean',
    ports: cruise.ports || cruise.itinerary?.map((p: any) => p.port) || ['Various Ports'],
    priceFrom: cruise.priceFrom || cruise.price || cruise.fromPrice || 899,
    rating: cruise.rating || 4.5,
    reviewCount: cruise.reviewCount || cruise.reviews || 1000,
    images: cruise.images || [
      'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800',
      'https://images.unsplash.com/photo-1564437657622-73a8e53c0ca7?w=800'
    ],
    amenities: cruise.amenities || ['Pool', 'Spa', 'Theater', 'Dining'],
    savings: cruise.savings || (Math.random() > 0.7 ? Math.floor(Math.random() * 300) + 100 : undefined),
    isPopular: cruise.isPopular || Math.random() > 0.8,
    itinerary: cruise.itinerary || {
      days: [
        { day: 1, port: 'Miami, FL', coordinates: [-80.1918, 25.7617] },
        { day: 2, port: 'At Sea', coordinates: [-75.0, 24.0] },
        { day: 3, port: 'Cozumel, Mexico', coordinates: [-86.9223, 20.4230] },
        { day: 4, port: 'At Sea', coordinates: [-82.0, 22.0] },
        { day: 5, port: 'Miami, FL', coordinates: [-80.1918, 25.7617] }
      ]
    }
  })) || [];

  const filteredCruises = cruises.filter(cruise => {
    // Apply basic text search
    if (query) {
      const searchTerm = query.toLowerCase();
      const matchesSearch = 
        cruise.route.toLowerCase().includes(searchTerm) ||
        cruise.shipName.toLowerCase().includes(searchTerm) ||
        cruise.cruiseLine.toLowerCase().includes(searchTerm) ||
        cruise.ports.some(port => port.toLowerCase().includes(searchTerm));
      
      if (!matchesSearch) return false;
    }
    
    // Apply other filters here
    if (cruise.priceFrom < filters.priceRange[0] || cruise.priceFrom > filters.priceRange[1]) {
      return false;
    }
    
    return true;
  });

  return (
    <div className="min-h-screen bg-light-gray">
      <Header />
      
      <div className="pt-20 h-screen flex">
        {/* Left Pane - Chat Interface and Map */}
        <div className="w-1/3 border-r border-border-gray bg-white flex flex-col">
          {/* Chat Interface Section */}
          <div className="flex-1 border-b border-border-gray">
            <SearchResultsChat 
              initialQuery={query}
              searchType={searchType}
              resultCount={filteredCruises.length}
            />
          </div>
          
          {/* Map Section */}
          <div className="h-80">
            <RouteMap 
              cruises={filteredCruises}
              hoveredCruise={hoveredCruise}
            />
          </div>
        </div>

        {/* Right Pane - Search Results */}
        <div className="flex-1 flex flex-col">
          {/* Filter Header */}
          <div className="bg-white border-b border-border-gray p-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-semibold text-charcoal">
                  {filteredCruises.length} Cruises Found
                </h2>
                <p className="text-sm text-slate-gray">
                  {query ? `Searching for: "${query}"` : 'All available cruises'}
                </p>
              </div>
              <Button
                variant="outline"
                onClick={() => setIsFilterOpen(!isFilterOpen)}
                className="text-ocean-blue border-ocean-blue hover:bg-ocean-blue hover:text-white"
              >
                <Filter className="w-4 h-4 mr-2" />
                Filters
              </Button>
            </div>
          </div>

          {/* Results Area */}
          <div className="flex-1 relative">
            <CruiseResults 
              cruises={filteredCruises}
              isLoading={isLoading}
              onCruiseHover={setHoveredCruise}
              sortBy={sortBy}
              onSortChange={setSortBy}
            />

            {/* Filter Panel Overlay */}
            {isFilterOpen && (
              <div className="absolute inset-0 bg-black/50 z-50">
                <div className="absolute right-0 top-0 h-full w-80 bg-white shadow-level-4">
                  <FilterPanel
                    filters={filters}
                    onFiltersChange={setFilters}
                    onClose={() => setIsFilterOpen(false)}
                    cruises={cruises}
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Search;
