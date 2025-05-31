
import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import { Home, ChevronRight } from 'lucide-react';
import Header from '@/components/layout/Header';
import MapLibreRouteMap from '@/components/search/MapLibreRouteMap';
import CruiseResults from '@/components/search/CruiseResults';
import FilterDrawer from '@/components/search/FilterDrawer';
import SearchResultsChat from '@/components/search/SearchResultsChat';
import MobileControls from '@/components/search/MobileControls';
import ComparisonTray from '@/components/search/ComparisonTray';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Filter, Grid, List } from 'lucide-react';
import { mockCruiseData, CruiseData } from '@/api/mockCruiseData';

const Search = () => {
  const [searchParams] = useSearchParams();
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [selectedCruiseId, setSelectedCruiseId] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('list');
  const [comparisonCruises, setComparisonCruises] = useState<CruiseData[]>([]);
  const [isComparisonTrayOpen, setIsComparisonTrayOpen] = useState(false);
  
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
  const filteredCruises: CruiseData[] = mockCruiseData;

  useEffect(() => {
    if (filteredCruises.length > 0 && !selectedCruiseId) {
      setSelectedCruiseId(filteredCruises[0].id);
    }
  }, [filteredCruises, selectedCruiseId]);

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
  };

  const handleCompareAdd = (cruise: CruiseData) => {
    if (comparisonCruises.length < 4 && !comparisonCruises.find(c => c.id === cruise.id)) {
      setComparisonCruises(prev => [...prev, cruise]);
      setIsComparisonTrayOpen(true);
    }
  };

  const handleRemoveFromComparison = (cruiseId: string) => {
    setComparisonCruises(prev => prev.filter(c => c.id !== cruiseId));
  };

  const handleCompare = () => {
    setIsComparisonTrayOpen(false);
  };

  return (
    <div className="min-h-screen bg-light-gray">
      <Header />
      
      {/* Breadcrumb Navigation */}
      <div className="pt-16 bg-white border-b border-border-gray">
        <div className="container mx-auto px-4 py-1">
          <div className="flex items-center gap-2 text-sm">
            <Link to="/" className="text-slate-gray hover:text-ocean-blue flex items-center gap-1">
              <Home className="w-4 h-4" />
              Home
            </Link>
            <ChevronRight className="w-4 h-4 text-slate-gray" />
            <span className="text-charcoal font-medium">Search Results</span>
          </div>
        </div>
      </div>
      
      <div className="h-screen flex">
        {/* Desktop Left Pane */}
        <div className="hidden md:flex w-[35%] border-r border-border-gray bg-white flex-col fixed h-full top-16 left-0">
          <div className="h-[35%] border-b border-border-gray flex-shrink-0">
            <MapLibreRouteMap 
              cruises={filteredCruises}
              hoveredCruise={hoveredCruise}
              selectedCruise={selectedCruiseId}
              onLocationClick={(locationName, insights) => {
                // Location click handler
              }}
            />
          </div>
          
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

        {/* Right Pane */}
        <div className="flex-1 flex flex-col md:ml-[35%]">
          <div className="bg-white border-b border-border-gray p-2 sticky top-16 z-40">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-sm font-semibold text-charcoal">
                  {filteredCruises.length} Cruises Found
                </h2>
                <p className="text-xs text-slate-gray">
                  {query ? `Search results for: "${query}"` : 'All available cruises'}
                </p>
              </div>
              
              <div className="flex items-center gap-2">
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
              onCompareAdd={handleCompareAdd}
              searchParams={searchParams}
            />
          </div>
        </div>
      </div>

      <FilterDrawer
        filters={filters}
        onFiltersChange={setFilters}
        onClose={() => setIsFilterOpen(false)}
        cruises={mockCruiseData}
        isOpen={isFilterOpen}
      />

      <ComparisonTray
        isOpen={isComparisonTrayOpen}
        onClose={() => setIsComparisonTrayOpen(false)}
        selectedCruises={comparisonCruises}
        onRemoveCruise={handleRemoveFromComparison}
        onCompare={handleCompare}
        searchParams={searchParams}
      />
    </div>
  );
};

export default Search;
