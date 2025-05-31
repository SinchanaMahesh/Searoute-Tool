
import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import Header from '@/components/layout/Header';
import MapLibreRouteMap from '@/components/search/MapLibreRouteMap';
import CruiseResults from '@/components/search/CruiseResults';
import FilterDrawer from '@/components/search/FilterDrawer';
import SearchResultsChat from '@/components/search/SearchResultsChat';
import MobileControls from '@/components/search/MobileControls';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Filter, Grid, List } from 'lucide-react';
import { mockCruiseData, CruiseData } from '@/api/mockCruiseData';

const Search = () => {
  const [searchParams] = useSearchParams();
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [selectedCruiseId, setSelectedCruiseId] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('list');
  
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

  // Set initial selected cruise
  useEffect(() => {
    if (filteredCruises.length > 0 && !selectedCruiseId) {
      setSelectedCruiseId(filteredCruises[0].id);
    }
  }, [filteredCruises, selectedCruiseId]);

  console.log('Available Cruises:', mockCruiseData.length);
  console.log('Showing Cruises:', filteredCruises.length);
  console.log('Selected Cruise ID:', selectedCruiseId);

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

  const handleCruiseSelect = (cruiseId: string) => {
    setSelectedCruiseId(cruiseId);
    console.log('Cruise selected:', cruiseId);
  };

  return (
    <div className="min-h-screen bg-light-gray">
      <Header />
      
      <div className="pt-20 h-screen flex">
        {/* Desktop Left Pane - Hidden on mobile */}
        <div className="hidden md:flex w-[35%] border-r border-border-gray bg-white flex-col fixed h-full top-20 left-0">
          {/* Map Section - Fixed height (35%) */}
          <div className="h-[35%] border-b border-border-gray flex-shrink-0">
            <MapLibreRouteMap 
              cruises={filteredCruises}
              hoveredCruise={hoveredCruise}
              selectedCruise={selectedCruiseId}
              onLocationClick={(locationName, insights) => {
                console.log('Location clicked:', locationName, insights);
              }}
            />
          </div>
          
          {/* Chat Interface Section - Flexible height (65%) with proper overflow */}
          <div className="flex-1 min-h-0 flex flex-col">
            <SearchResultsChat 
              initialQuery={query}
              searchType={searchType}
              resultCount={filteredCruises.length}
              quickFilters={getQuickFilters()}
            />
          </div>
        </div>

        {/* Mobile Floating Controls */}
        <MobileControls
          cruises={filteredCruises}
          selectedCruise={selectedCruiseId}
          hoveredCruise={hoveredCruise}
          initialQuery={query}
          searchType={searchType}
          resultCount={filteredCruises.length}
          quickFilters={getQuickFilters()}
        />

        {/* Right Pane - Flexible width (65% desktop, 100% mobile) */}
        <div className="flex-1 flex flex-col md:ml-[35%]">
          {/* Results Header with Controls */}
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
              
              {/* Controls Group */}
              <div className="flex items-center gap-2">
                {/* Sort Dropdown */}
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-28 h-6 text-xs">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="price">Price</SelectItem>
                    <SelectItem value="duration">Duration</SelectItem>
                    <SelectItem value="rating">Rating</SelectItem>
                    <SelectItem value="departure">Departure</SelectItem>
                  </SelectContent>
                </Select>
                
                {/* View Toggle */}
                <div className="flex items-center bg-light-gray rounded-lg p-1">
                  <Button
                    variant={viewMode === 'grid' ? 'default' : 'ghost'}
                    size="sm"
                    onClick={() => setViewMode('grid')}
                    className="rounded-md h-6 w-6 p-0"
                  >
                    <Grid className="w-3 h-3" />
                  </Button>
                  <Button
                    variant={viewMode === 'list' ? 'default' : 'ghost'}
                    size="sm"
                    onClick={() => setViewMode('list')}
                    className="rounded-md h-6 w-6 p-0"
                  >
                    <List className="w-3 h-3" />
                  </Button>
                </div>
                
                {/* Filter Button */}
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
          </div>

          {/* Search Results */}
          <div className="flex-1 overflow-hidden">
            <CruiseResults 
              cruises={filteredCruises}
              isLoading={false}
              onCruiseHover={setHoveredCruise}
              onCruiseSelect={handleCruiseSelect}
              selectedCruiseId={selectedCruiseId}
              sortBy={sortBy}
              onSortChange={setSortBy}
              viewMode={viewMode}
              onViewModeChange={setViewMode}
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
