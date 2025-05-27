
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
  const { data: cruisesResponse, isLoading, error } = useQuery({
    queryKey: ['cruises'],
    queryFn: async () => {
      const response = await fetch('https://travtech.tech:3333/api/v3/Getcruises?skin=1020');
      if (!response.ok) {
        throw new Error('Failed to fetch cruises');
      }
      return response.json();
    },
  });

  console.log('API Response:', cruisesResponse);

  const cruises: Cruise[] = cruisesResponse?.SearchData?.data?.map((cruise: any, index: number) => {
    // Get the lowest fare for pricing
    const lowestFare = cruise.fare?.reduce((min: any, current: any) => 
      parseInt(current.TotalAmt) < parseInt(min.TotalAmt) ? current : min
    );

    // Parse itinerary summary into ports array
    const ports = cruise.itinerary_summary 
      ? cruise.itinerary_summary.split(', ').map((port: string) => port.trim())
      : ['Various Ports'];

    // Extract departure port (usually first port in itinerary)
    const departurePort = ports[0] || 'Unknown Port';

    return {
      id: cruise.itinerary_id || `cruise-${index}`,
      shipName: cruise.ship_name || 'Unknown Ship',
      cruiseLine: cruise.company_name || 'Unknown Line',
      duration: parseInt(cruise.number_of_days) || 7,
      departureDate: cruise.sail_date ? new Date(cruise.sail_date).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
      departurePort: departurePort,
      route: cruise.region_name || 'Unknown Region',
      ports: ports,
      priceFrom: lowestFare ? parseInt(lowestFare.TotalAmt) : 999,
      rating: Math.random() * 2 + 3.5, // Random rating between 3.5-5.5
      reviewCount: Math.floor(Math.random() * 2000) + 500,
      images: [
        'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800',
        'https://images.unsplash.com/photo-1564437657622-73a8e53c0ca7?w=800',
        'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=800'
      ],
      amenities: ['Pool', 'Spa', 'Theater', 'Dining', 'Casino', 'Fitness Center'],
      savings: Math.random() > 0.7 ? Math.floor(Math.random() * 300) + 100 : undefined,
      isPopular: Math.random() > 0.8,
      itinerary: {
        days: ports.map((port, idx) => ({
          day: idx + 1,
          port: port,
          coordinates: [
            -80 + Math.random() * 40, // Longitude between -80 and -40
            25 + Math.random() * 35   // Latitude between 25 and 60
          ] as [number, number]
        }))
      }
    };
  }) || [];

  console.log('Mapped Cruises:', cruises);

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
