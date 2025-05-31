
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { MapPin, MessageCircle, X } from 'lucide-react';
import MapLibreRouteMap from './MapLibreRouteMap';
import SearchResultsChat from './SearchResultsChat';
import { CruiseData } from '@/api/mockCruiseData';

interface MobileControlsProps {
  cruises: CruiseData[];
  selectedCruise?: string | null;
  hoveredCruise: string | null;
  initialQuery: string;
  searchType: string;
  resultCount: number;
  quickFilters: Array<{ label: string; action: () => void }>;
}

const MobileControls = ({ 
  cruises, 
  selectedCruise, 
  hoveredCruise, 
  initialQuery, 
  searchType, 
  resultCount, 
  quickFilters 
}: MobileControlsProps) => {
  const [activeDrawer, setActiveDrawer] = useState<'map' | 'chat' | null>(null);

  return (
    <>
      {/* Floating Action Buttons */}
      <div className="md:hidden fixed top-24 left-4 flex gap-2 z-30">
        <Button
          size="sm"
          onClick={() => setActiveDrawer('map')}
          className="bg-ocean-blue hover:bg-deep-navy text-white shadow-lg"
        >
          <MapPin className="w-4 h-4 mr-1" />
          Map
        </Button>
        <Button
          size="sm"
          onClick={() => setActiveDrawer('chat')}
          className="bg-ocean-blue hover:bg-deep-navy text-white shadow-lg"
        >
          <MessageCircle className="w-4 h-4 mr-1" />
          AI Chat
        </Button>
      </div>

      {/* Map Drawer */}
      {activeDrawer === 'map' && (
        <>
          <div 
            className="fixed inset-0 bg-black/50 z-40"
            onClick={() => setActiveDrawer(null)}
          />
          <div className="fixed top-0 left-0 w-full h-2/3 bg-white z-50 shadow-2xl">
            <div className="p-3 border-b border-border-gray flex justify-between items-center">
              <h3 className="font-medium text-charcoal">Route Map</h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setActiveDrawer(null)}
                className="h-8 w-8 p-0"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
            <div className="h-full">
              <MapLibreRouteMap 
                cruises={cruises}
                hoveredCruise={hoveredCruise}
                selectedCruise={selectedCruise}
                onLocationClick={(locationName, insights) => {
                  console.log('Location clicked:', locationName, insights);
                }}
              />
            </div>
          </div>
        </>
      )}

      {/* Chat Drawer */}
      {activeDrawer === 'chat' && (
        <>
          <div 
            className="fixed inset-0 bg-black/50 z-40"
            onClick={() => setActiveDrawer(null)}
          />
          <div className="fixed bottom-0 left-0 w-full h-2/3 bg-white z-50 shadow-2xl rounded-t-lg">
            <div className="p-3 border-b border-border-gray flex justify-between items-center">
              <h3 className="font-medium text-charcoal">AI Assistant</h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setActiveDrawer(null)}
                className="h-8 w-8 p-0"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
            <div className="h-full flex flex-col">
              <SearchResultsChat 
                initialQuery={initialQuery}
                searchType={searchType}
                resultCount={resultCount}
                quickFilters={quickFilters}
              />
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default MobileControls;
