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

// Enhanced mock data - always use this to show results
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
  },
  {
    id: "caribbean-wonder-2025",
    shipName: "Caribbean Wonder",
    cruiseLine: "Royal Caribbean",
    duration: 7,
    departureDate: "2025-06-15",
    departurePort: "Miami",
    route: "Caribbean",
    ports: ["Miami", "Cozumel", "Roatan", "Costa Maya", "Belize City"],
    priceFrom: 899,
    rating: 4.3,
    reviewCount: 3200,
    images: [
      'https://images.unsplash.com/photo-1564437657622-73a8e53c0ca7?w=800',
      'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=800'
    ],
    amenities: ['Kids Club', 'Pool', 'Casino', 'Theater', 'Dining'],
    isPopular: true,
    savings: 200
  }
];

const Search = () => {
  const [searchParams] = useSearchParams();
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  
  // Simplified filters without restrictive date filtering
  const [filters, setFilters] = useState({
    priceRange: [0, 20000],
    duration: [],
    departurePorts: [],
    cruiseLines: [],
    amenities: [],
    destinations: [],
  });
  const [sortBy, setSortBy] = useState('price');
  const [hoveredCruise, setHoveredCruise] = useState<string | null>(null);

  const query = searchParams.get('q') || '';
  const searchType = searchParams.get('type') || 'chat';

  // Always use mock data to ensure results are shown
  const cruises: Cruise[] = mockCruiseData;

  console.log('Using Mock Cruises:', cruises);

  // Simplified filtering - just basic search and price range
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
        searchTerm.includes('cruise') ||
        searchTerm.includes('caribbean') ||
        searchTerm.includes('mediterranean') ||
        searchTerm.includes('family') ||
        searchTerm.includes('luxury');
      
      if (!matchesSearch) return false;
    }
    
    // Only apply price range filter
    if (cruise.priceFrom < filters.priceRange[0] || cruise.priceFrom > filters.priceRange[1]) {
      return false;
    }
    
    return true;
  });

  console.log('Filtered Cruises:', filteredCruises);

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
    
    return quickFilters;
  };

  return (
    <div className="min-h-screen bg-light-gray">
      <Header />
      
      <div className="pt-20 h-screen flex">
        {/* Left Pane - Fixed, now with flexible map and chat areas */}
        <div className="w-1/3 border-r border-border-gray bg-white flex flex-col fixed h-full top-20 left-0">
          {/* Map Section - Now flexible to take more space */}
          <div className="flex-1 border-b border-border-gray">
            <RouteMap 
              cruises={filteredCruises}
              hoveredCruise={hoveredCruise}
              selectedCruise={filteredCruises.length > 0 ? filteredCruises[0].id : null}
            />
          </div>
          
          {/* Chat Interface Section - Fixed height for better control */}
          <div className="h-80 border-b border-border-gray">
            <SearchResultsChat 
              initialQuery={query}
              searchType={searchType}
              resultCount={filteredCruises.length}
              quickFilters={getQuickFilters()}
            />
          </div>
        </div>

        {/* Right Pane - Scrollable Results */}
        <div className="flex-1 flex flex-col ml-[33.333333%]">
          {/* Filter Header - Simplified */}
          <div className="bg-white border-b border-border-gray p-3 sticky top-20 z-10">
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
              isLoading={false}
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
