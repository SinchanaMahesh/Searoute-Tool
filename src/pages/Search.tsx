
import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import Header from '@/components/layout/Header';
import SearchHeader from '@/components/search/SearchHeader';
import FilterSidebar from '@/components/search/FilterSidebar';
import CruiseGrid from '@/components/search/CruiseGrid';
import InteractiveMap from '@/components/search/InteractiveMap';
import { Button } from '@/components/ui/button';
import { Filter, Map, Grid, List } from 'lucide-react';

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
}

const Search = () => {
  const [searchParams] = useSearchParams();
  const [viewMode, setViewMode] = useState<'grid' | 'list' | 'map'>('grid');
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
  const [cruises, setCruises] = useState<Cruise[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const query = searchParams.get('q') || '';

  // Mock cruise data - in real app, this would come from API
  useEffect(() => {
    setIsLoading(true);
    setTimeout(() => {
      setCruises(mockCruises);
      setIsLoading(false);
    }, 1000);
  }, []);

  const filteredCruises = cruises.filter(cruise => {
    // Apply filters logic here
    return true; // Simplified for now
  });

  return (
    <div className="min-h-screen bg-light-gray">
      <Header />
      
      <div className="pt-20">
        <SearchHeader 
          query={query}
          resultCount={filteredCruises.length}
          sortBy={sortBy}
          onSortChange={setSortBy}
          viewMode={viewMode}
          onViewModeChange={setViewMode}
        />

        <div className="container mx-auto px-4 lg:px-8">
          <div className="flex gap-6">
            {/* Mobile Filter Button */}
            <div className="md:hidden fixed bottom-4 left-4 z-40">
              <Button
                onClick={() => setIsFilterOpen(!isFilterOpen)}
                className="bg-ocean-blue hover:bg-deep-navy text-white rounded-full w-14 h-14 shadow-level-3"
              >
                <Filter className="w-6 h-6" />
              </Button>
            </div>

            {/* Filter Sidebar */}
            <FilterSidebar
              filters={filters}
              onFiltersChange={setFilters}
              isOpen={isFilterOpen}
              onClose={() => setIsFilterOpen(false)}
              className="hidden md:block"
            />

            {/* Mobile Filter Overlay */}
            {isFilterOpen && (
              <div className="md:hidden fixed inset-0 z-50 bg-black/50">
                <div className="absolute inset-x-0 bottom-0 bg-white rounded-t-xl max-h-[80vh] overflow-y-auto">
                  <FilterSidebar
                    filters={filters}
                    onFiltersChange={setFilters}
                    isOpen={isFilterOpen}
                    onClose={() => setIsFilterOpen(false)}
                    isMobile={true}
                  />
                </div>
              </div>
            )}

            {/* Main Content */}
            <div className="flex-1">
              {viewMode === 'map' ? (
                <InteractiveMap cruises={filteredCruises} />
              ) : (
                <CruiseGrid 
                  cruises={filteredCruises}
                  viewMode={viewMode}
                  isLoading={isLoading}
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Mock cruise data
const mockCruises: Cruise[] = [
  {
    id: '1',
    shipName: 'Symphony of the Seas',
    cruiseLine: 'Royal Caribbean',
    duration: 7,
    departureDate: '2024-03-15',
    departurePort: 'Miami, FL',
    route: 'Eastern Caribbean',
    ports: ['Cozumel', 'Roatan', 'Costa Maya'],
    priceFrom: 899,
    rating: 4.6,
    reviewCount: 2847,
    images: [
      'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800',
      'https://images.unsplash.com/photo-1564437657622-73a8e53c0ca7?w=800'
    ],
    amenities: ['Pool', 'Spa', 'Kids Club', 'Theater', 'Rock Climbing'],
    savings: 200,
    isPopular: true
  },
  {
    id: '2',
    shipName: 'Norwegian Breakaway',
    cruiseLine: 'Norwegian Cruise Line',
    duration: 5,
    departureDate: '2024-03-20',
    departurePort: 'New York, NY',
    route: 'Bermuda',
    ports: ['Royal Naval Dockyard'],
    priceFrom: 649,
    rating: 4.3,
    reviewCount: 1923,
    images: [
      'https://images.unsplash.com/photo-1570530043390-a14cd95d5fdc?w=800',
      'https://images.unsplash.com/photo-1567516527583-1f5b6a2b5f6b?w=800'
    ],
    amenities: ['Pool', 'Casino', 'Broadway Shows', 'Spa']
  },
  {
    id: '3',
    shipName: 'Carnival Vista',
    cruiseLine: 'Carnival Cruise Line',
    duration: 8,
    departureDate: '2024-04-01',
    departurePort: 'Galveston, TX',
    route: 'Western Caribbean',
    ports: ['Cozumel', 'Belize', 'Mahogany Bay', 'Costa Maya'],
    priceFrom: 759,
    rating: 4.1,
    reviewCount: 3156,
    images: [
      'https://images.unsplash.com/photo-1573962604-6ce8b1c07bf9?w=800',
      'https://images.unsplash.com/photo-1566020685929-fa72b59bf8bd?w=800'
    ],
    amenities: ['SkyRide', 'WaterWorks', 'Serenity Adult-Only Retreat', 'Mini Golf'],
    savings: 150
  }
];

export default Search;
