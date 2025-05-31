
import React, { useState } from 'react';
import { CruiseData } from '@/api/mockCruiseData';
import { Maximize2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import LeafletRouteMap from './LeafletRouteMap';
import EnhancedModalMap from './EnhancedModalMap';

interface MapLibreRouteMapProps {
  cruises: CruiseData[];
  hoveredCruise: string | null;
  selectedCruise?: string | null;
  onLocationClick?: (locationName: string, insights: any) => void;
}

const MapLibreRouteMap = ({ cruises, hoveredCruise, selectedCruise, onLocationClick }: MapLibreRouteMapProps) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // Use selectedCruise as primary, fallback to first cruise if none selected
  const displayCruise = selectedCruise 
    ? cruises.find(c => c.id === selectedCruise)
    : cruises.length > 0 ? cruises[0] : null;

  const handlePortClick = (portName: string, port: any) => {
    if (onLocationClick) {
      onLocationClick(portName, { port });
    }
  };

  return (
    <>
      <div className="h-full bg-gradient-to-br from-blue-50 to-blue-100 relative overflow-hidden">
        {/* Compact Map Header */}
        <div className="absolute top-0 left-0 right-0 bg-white/95 backdrop-blur-sm p-2 border-b border-border-gray z-20">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-medium text-charcoal text-xs">Route Map</h3>
              <p className="text-xs text-slate-gray">
                {displayCruise 
                  ? `${displayCruise.shipName} - ${displayCruise.ports.length} ports` 
                  : 'Click a cruise to view its route'}
              </p>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsModalOpen(true)}
              className="text-ocean-blue border-ocean-blue hover:bg-ocean-blue hover:text-white h-6 w-6 p-0"
            >
              <Maximize2 className="w-3 h-3" />
            </Button>
          </div>
        </div>

        {/* Map Container */}
        <div 
          className="absolute inset-0 pt-12 w-full h-full cursor-pointer"
          style={{ width: '100%', height: 'calc(100% - 48px)', marginTop: '48px' }}
          onClick={() => setIsModalOpen(true)}
        >
          {displayCruise && (
            <LeafletRouteMap
              cruise={displayCruise}
              height="100%"
              onPortClick={handlePortClick}
              className="rounded-none"
            />
          )}
        </div>
      </div>

      <EnhancedModalMap
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        cruises={cruises}
        selectedCruise={selectedCruise}
      />
    </>
  );
};

export default MapLibreRouteMap;
