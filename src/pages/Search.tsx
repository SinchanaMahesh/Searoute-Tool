
import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import Header from '@/components/layout/Header';
import EnhancedSearchChat from '@/components/search/EnhancedSearchChat';
import EnhancedRouteMap from '@/components/search/EnhancedRouteMap';
import CruiseResults from '@/components/search/CruiseResults';
import FilterDrawer from '@/components/search/FilterDrawer';
import { Button } from '@/components/ui/button';
import { Filter } from 'lucide-react';
import { mockCruiseData, CruiseData } from '@/api/mockCruiseData';

const Search = () => {
  const [searchParams] = useSearchParams();
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  
  // Simplified filters - start with wide ranges to show results
  const [filters, setFilters] = useState({
    priceRange: [0, 15000], // Increased range to include all cruises
    duration: [] as number[],
    departurePorts: [] as string[],
    cruiseLines: [] as string[],
    amenities: [] as string[],
    destinations: [] as string[],
  });
  const [sortBy, setSortBy] = useState('price');
  const [hoveredCruise, setHoveredCruise] = useState<string | null>(null);

  const query = searchParams.get('q') || '';
  const searchType = searchParams.get('type') || 'chat';

  // Use mock data directly - all 5 cruises
  const cruises: CruiseData[] = mockCruiseData;

  console.log('Available Cruises:', cruises.length);
  console.log('Current filters:', filters);

  // Simplified filtering logic - start by showing all cruises
  const filteredCruises = cruises.filter(cruise => {
    // Only apply text search if there's a meaningful query
    if (query && query.trim() && query.length > 2) {
      const searchTerm = query.toLowerCase();
      const matchesSearch = 
        cruise.route.toLowerCase().includes(searchTerm) ||
        cruise.shipName.toLowerCase().includes(searchTerm) ||
        cruise.cruiseLine.toLowerCase().includes(searchTerm) ||
        cruise.departurePort.toLowerCase().includes(searchTerm) ||
        cruise.ports.some(port => port.name.toLowerCase().includes(searchTerm));
      
      if (!matchesSearch) return false;
    }
    
    // Price range filter
    if (cruise.priceFrom < filters.priceRange[0] || cruise.priceFrom > filters.priceRange[1]) {
      return false;
    }

    // Duration filter - only apply if specific durations are selected
    if (filters.duration.length > 0 && !filters.duration.includes(cruise.duration)) {
      return false;
    }

    // Cruise lines filter - only apply if specific lines are selected
    if (filters.cruiseLines.length > 0 && !filters.cruiseLines.includes(cruise.cruiseLine)) {
      return false;
    }

    // Departure ports filter - only apply if specific ports are selected
    if (filters.departurePorts.length > 0 && !filters.departurePorts.includes(cruise.departurePort)) {
      return false;
    }

    // Amenities filter - only apply if specific amenities are selected
    if (filters.amenities.length > 0) {
      const hasAmenity = filters.amenities.some((amenity: string) => 
        cruise.amenities.some(cruiseAmenity => cruiseAmenity.toLowerCase().includes(amenity.toLowerCase()))
      );
      if (!hasAmenity) return false;
    }
    
    return true;
  });

  console.log('Filtered Cruises:', filteredCruises.length);

  // Generate context-based quick filters
  const getQuickFilters = () => {
    const baseFilters = [
      { label: 'Best Deals', action: () => setSortBy('price') },
      { label: 'Family Friendly', action: () => setFilters(prev => ({ ...prev, amenities: ['Kids Club'] })) },
      { label: 'Under $2000', action: () => setFilters(prev => ({ ...prev, priceRange: [0, 2000] })) }
    ];
    
    if (!query) return baseFilters;
    
    const queryLower = query.toLowerCase();
    const quickFilters = [...baseFilters];
    
    if (queryLower.includes('luxury') || queryLower.includes('premium')) {
      quickFilters.push({ 
        label: 'Luxury Cruises', 
        action: () => setFilters(prev => ({ ...prev, priceRange: [3000, 15000] }))
      });
    }
    if (queryLower.includes('caribbean')) {
      quickFilters.push({ 
        label: 'Caribbean Only', 
        action: () => setFilters(prev => ({ ...prev, destinations: ['Caribbean'] }))
      });
    }
    
    return quickFilters;
  };

  return (
    <div className="min-h-screen bg-light-gray">
      <Header />
      
      <div className="pt-20 h-screen flex">
        {/* Left Pane - Fixed width (35%) */}
        <div className="w-[35%] border-r border-border-gray bg-white flex flex-col fixed h-full top-20 left-0">
          {/* Map Section - 45% of left pane */}
          <div className="h-[45%] border-b border-border-gray">
            <EnhancedRouteMap 
              cruises={filteredCruises}
              hoveredCruise={hoveredCruise}
              selectedCruise={filteredCruises.length > 0 ? filteredCruises[0].id : null}
            />
          </div>
          
          {/* Chat Interface Section - 55% of left pane */}
          <div className="h-[55%]">
            <EnhancedSearchChat 
              initialQuery={query}
              searchType={searchType}
              resultCount={filteredCruises.length}
              quickFilters={getQuickFilters()}
            />
          </div>
        </div>

        {/* Right Pane - Flexible width (65%) */}
        <div className="flex-1 flex flex-col ml-[35%]">
          {/* Results Header */}
          <div className="bg-white border-b border-border-gray p-4 sticky top-20 z-10">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-semibold text-charcoal">
                  {filteredCruises.length} Cruises Found
                </h2>
                <p className="text-sm text-slate-gray">
                  {query ? `Search results for: "${query}"` : 'All available cruises'}
                </p>
              </div>
              <Button
                variant="outline"
                onClick={() => setIsFilterOpen(true)}
                className="text-ocean-blue border-ocean-blue hover:bg-ocean-blue hover:text-white"
              >
                <Filter className="w-4 h-4 mr-2" />
                Filters
              </Button>
            </div>
          </div>

          {/* Search Results */}
          <div className="flex-1 overflow-hidden">
            <CruiseResults 
              cruises={filteredCruises}
              isLoading={false}
              onCruiseHover={setHoveredCruise}
              sortBy={sortBy}
              onSortChange={setSortBy}
            />
          </div>
        </div>
      </div>

      {/* Filter Drawer */}
      <FilterDrawer
        filters={filters}
        onFiltersChange={setFilters}
        onClose={() => setIsFilterOpen(false)}
        cruises={cruises}
        isOpen={isFilterOpen}
      />
    </div>
  );
};

export default Search;
