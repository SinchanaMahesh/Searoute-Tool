
import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import Header from '@/components/layout/Header';
import MapLibreRouteMap from '@/components/search/MapLibreRouteMap';
import CruiseResults from '@/components/search/CruiseResults';
import FilterDrawer from '@/components/search/FilterDrawer';
import { Button } from '@/components/ui/button';
import { Filter } from 'lucide-react';
import { mockCruiseData, CruiseData } from '@/api/mockCruiseData';
import EnhancedSearchChat from '@/components/search/EnhancedSearchChat';

const Search = () => {
  const [searchParams] = useSearchParams();
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  
  // Simplified filters - start with wide ranges to show results
  const [filters, setFilters] = useState({
    priceRange: [0, 15000],
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

  // Use all mock data without filtering for now
  const filteredCruises: CruiseData[] = mockCruiseData;

  console.log('Available Cruises:', mockCruiseData.length);
  console.log('Showing Cruises:', filteredCruises.length);

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
        {/* Left Pane - Fixed width (35%) with scrolling capability */}
        <div className="w-[35%] border-r border-border-gray bg-white flex flex-col fixed h-full top-20 left-0 overflow-hidden">
          {/* Map Section - Reduced height to 35% */}
          <div className="h-[35%] border-b border-border-gray flex-shrink-0">
            <MapLibreRouteMap 
              cruises={filteredCruises}
              hoveredCruise={hoveredCruise}
              selectedCruise={filteredCruises.length > 0 ? filteredCruises[0].id : null}
            />
          </div>
          
          {/* Chat Interface Section - Flexible height 65% with overflow handling */}
          <div className="h-[65%] flex-shrink-0 overflow-hidden">
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
          {/* Results Header - Aligned height with map header */}
          <div className="bg-white border-b border-border-gray p-2 sticky top-20 z-10">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-sm font-semibold text-charcoal">
                  {filteredCruises.length} Cruises Found
                </h2>
                <p className="text-xs text-slate-gray">
                  {query ? `Search results for: "${query}"` : 'All available cruises'}
                </p>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsFilterOpen(true)}
                className="text-ocean-blue border-ocean-blue hover:bg-ocean-blue hover:text-white h-6 w-6 p-0"
              >
                <Filter className="w-3 h-3" />
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
        cruises={mockCruiseData}
        isOpen={isFilterOpen}
      />
    </div>
  );
};

export default Search;
