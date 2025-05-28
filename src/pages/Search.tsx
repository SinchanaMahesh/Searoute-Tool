
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

// Mock data based on API response structure
const mockCruiseData = [
  {
    id: "495242c4-c3d5-f76e-176a-04437727942b",
    shipName: "MS Richard With",
    cruiseLine: "Hurtigruten",
    duration: 11,
    departureDate: "2025-05-28",
    departurePort: "Bergen",
    route: "Scandinavia & Fjords",
    ports: ["Bergen", "Floro", "Maloy", "Turrvik", "Alesund", "Hjorundfjord", "Molde", "Kristiansund", "Trondheim"],
    priceFrom: 5345,
    rating: 4.2,
    reviewCount: 1250,
    images: [
      'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800',
      'https://images.unsplash.com/photo-1564437657622-73a8e53c0ca7?w=800'
    ],
    amenities: ['Pool', 'Spa', 'Theater', 'Dining', 'Fitness Center'],
    isPopular: true
  },
  {
    id: "81518eb4-aebb-aed2-1189-276a4db9dca1",
    shipName: "AmaMora",
    cruiseLine: "AmaWaterways",
    duration: 16,
    departureDate: "2025-05-29",
    departurePort: "Budapest",
    route: "Europe-Tours & Cruises",
    ports: ["Budapest", "Bratislava", "Vienna", "Durnstein", "Melk", "Linz", "Regensburg", "Nuremberg", "Amsterdam"],
    priceFrom: 8089,
    rating: 4.5,
    reviewCount: 890,
    images: [
      'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=800',
      'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800'
    ],
    amenities: ['Spa', 'Theater', 'Dining', 'Cultural Tours'],
    savings: 480
  },
  {
    id: "30146500-30d0-15f2-04de-97948467105b",
    shipName: "Disney Magic",
    cruiseLine: "Disney Cruise Line",
    duration: 5,
    departureDate: "2025-05-30",
    departurePort: "Port Canaveral",
    route: "Bahamas",
    ports: ["Port Canaveral", "Lighthouse Point", "Nassau", "Castaway Cay"],
    priceFrom: 1911,
    rating: 4.7,
    reviewCount: 2150,
    images: [
      'https://images.unsplash.com/photo-1564437657622-73a8e53c0ca7?w=800',
      'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=800'
    ],
    amenities: ['Kids Club', 'Pool', 'Theater', 'Dining', 'Character Meet & Greet'],
    isPopular: true
  },
  {
    id: "a86a511f-4a64-7287-03d4-0b20b134254f",
    shipName: "MSC Splendida",
    cruiseLine: "MSC Cruises",
    duration: 7,
    departureDate: "2025-05-30",
    departurePort: "Tarragona",
    route: "Mediterranean-West",
    ports: ["Tarragona", "Valencia", "Livorno", "Rome/Civitavecchia", "Genoa", "Marseille"],
    priceFrom: 609,
    rating: 4.1,
    reviewCount: 1680,
    images: [
      'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800',
      'https://images.unsplash.com/photo-1564437657622-73a8e53c0ca7?w=800'
    ],
    amenities: ['Casino', 'Pool', 'Spa', 'Theater', 'Dining'],
    savings: 240
  }
];

const Search = () => {
  const [searchParams] = useSearchParams();
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  
  // Default to next 3 months date range
  const today = new Date();
  const threeMonthsLater = new Date(today);
  threeMonthsLater.setMonth(today.getMonth() + 3);
  
  const [filters, setFilters] = useState({
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
  const [sortBy, setSortBy] = useState('price');
  const [hoveredCruise, setHoveredCruise] = useState<string | null>(null);

  const query = searchParams.get('q') || '';
  const searchType = searchParams.get('type') || 'chat';

  // Fetch cruises from API but fall back to mock data
  const { data: cruisesResponse, isLoading, error } = useQuery({
    queryKey: ['cruises'],
    queryFn: async () => {
      try {
        const response = await fetch('https://travtech.tech:3333/api/v3/Getcruises?skin=1020');
        if (!response.ok) {
          throw new Error('Failed to fetch cruises');
        }
        return response.json();
      } catch (error) {
        console.log('API failed, using mock data:', error);
        return { SearchData: { data: mockCruiseData } };
      }
    },
  });

  console.log('API Response:', cruisesResponse);

  // Use API data if available, otherwise use mock data
  const apiCruises = cruisesResponse?.SearchData?.data || [];
  const cruises: Cruise[] = apiCruises.length > 0 ? apiCruises.map((cruise: any, index: number) => {
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
      rating: Math.random() * 2 + 3.5,
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
            -80 + Math.random() * 40,
            25 + Math.random() * 35
          ] as [number, number]
        }))
      }
    };
  }) : mockCruiseData;

  console.log('Mapped Cruises:', cruises);

  const filteredCruises = cruises.filter(cruise => {
    // Apply basic text search if there's a query
    if (query && query.trim()) {
      const searchTerm = query.toLowerCase();
      const matchesSearch = 
        cruise.route.toLowerCase().includes(searchTerm) ||
        cruise.shipName.toLowerCase().includes(searchTerm) ||
        cruise.cruiseLine.toLowerCase().includes(searchTerm) ||
        cruise.departurePort.toLowerCase().includes(searchTerm) ||
        cruise.ports.some(port => port.toLowerCase().includes(searchTerm)) ||
        searchTerm.includes('deal') ||
        searchTerm.includes('cruise');
      
      if (!matchesSearch) return false;
    }
    
    // Apply price range filter
    if (cruise.priceFrom < filters.priceRange[0] || cruise.priceFrom > filters.priceRange[1]) {
      return false;
    }
    
    // Apply duration filter if specified
    if (filters.duration.length > 0 && !filters.duration.includes(cruise.duration.toString())) {
      return false;
    }

    // Make date range filter less strict - only filter if cruise is way outside range
    if (filters.dateRange?.from && filters.dateRange?.to) {
      const cruiseDate = new Date(cruise.departureDate);
      const fromDate = new Date(filters.dateRange.from);
      const toDate = new Date(filters.dateRange.to);
      
      // Extend the date range by 6 months on each side to be less restrictive
      fromDate.setMonth(fromDate.getMonth() - 6);
      toDate.setMonth(toDate.getMonth() + 6);
      
      if (cruiseDate < fromDate || cruiseDate > toDate) {
        return false;
      }
    }
    
    return true;
  });

  console.log('Filtered Cruises:', filteredCruises);
  console.log('Query:', query);
  console.log('Filters:', filters);

  // Generate context-based quick filters
  const getQuickFilters = () => {
    if (!query) return [];
    
    const queryLower = query.toLowerCase();
    const quickFilters = [];
    
    if (queryLower.includes('family') || queryLower.includes('kids')) {
      quickFilters.push({ 
        label: 'Family Friendly', 
        action: () => {
          setFilters(prev => ({ ...prev, amenities: [...prev.amenities, 'Kids Club'] }));
        }
      });
    }
    if (queryLower.includes('luxury') || queryLower.includes('premium')) {
      quickFilters.push({ 
        label: 'Luxury Cruises', 
        action: () => {
          setFilters(prev => ({ ...prev, priceRange: [5000, 20000] }));
        }
      });
    }
    if (queryLower.includes('deal') || queryLower.includes('cheap') || queryLower.includes('budget')) {
      quickFilters.push({ 
        label: 'Best Deals', 
        action: () => {
          setFilters(prev => ({ ...prev, priceRange: [0, 2000] }));
          setSortBy('price');
        }
      });
    }
    if (queryLower.includes('caribbean')) {
      quickFilters.push({ 
        label: 'Caribbean Only', 
        action: () => {
          setFilters(prev => ({ ...prev, destinations: ['Caribbean'] }));
        }
      });
    }
    if (queryLower.includes('mediterranean')) {
      quickFilters.push({ 
        label: 'Mediterranean Only', 
        action: () => {
          setFilters(prev => ({ ...prev, destinations: ['Mediterranean'] }));
        }
      });
    }
    if (queryLower.includes('short') || queryLower.includes('weekend')) {
      quickFilters.push({ 
        label: '3-5 Days', 
        action: () => {
          setFilters(prev => ({ ...prev, duration: ['3', '4', '5'] }));
        }
      });
    }
    
    return quickFilters;
  };

  return (
    <div className="min-h-screen bg-light-gray">
      <Header />
      
      <div className="pt-20 h-screen flex">
        {/* Left Pane - Fixed */}
        <div className="w-1/3 border-r border-border-gray bg-white flex flex-col fixed h-full top-20 left-0">
          {/* Map Section - Larger now */}
          <div className="h-80 border-b border-border-gray">
            <RouteMap 
              cruises={filteredCruises}
              hoveredCruise={hoveredCruise}
              selectedCruise={filteredCruises.length > 0 ? filteredCruises[0].id : null}
            />
          </div>
          
          {/* Chat Interface Section - Smaller */}
          <div className="h-64 border-b border-border-gray">
            <SearchResultsChat 
              initialQuery={query}
              searchType={searchType}
              resultCount={filteredCruises.length}
            />
          </div>

          {/* Context-based Quick Filters Section */}
          <div className="flex-1 min-h-0 overflow-y-auto p-4">
            <div className="space-y-3">
              {/* Context-based Quick Filters */}
              {getQuickFilters().map((filter, index) => (
                <Button
                  key={index}
                  variant="outline"
                  size="sm"
                  className="w-full justify-start text-left text-ocean-blue border-ocean-blue hover:bg-ocean-blue hover:text-white"
                  onClick={filter.action}
                >
                  {filter.label}
                </Button>
              ))}
              
              <div className="text-xs text-slate-gray mt-4">
                <div>Showing {filteredCruises.length} cruises</div>
                {query && <div className="mt-1">Search: "{query}"</div>}
              </div>
            </div>
          </div>
        </div>

        {/* Right Pane - Scrollable Results */}
        <div className="flex-1 flex flex-col ml-[33.333333%]">
          {/* Filter Header */}
          <div className="bg-white border-b border-border-gray p-4 sticky top-20 z-10">
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
          <div className="flex-1 relative overflow-hidden">
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
