
import React, { useState } from 'react';
import { CruiseData } from '@/api/mockCruiseData';
import { Maximize2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import EnhancedRouteMap from './EnhancedRouteMap';
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
        {/* Use the working EnhancedRouteMap component */}
        <EnhancedRouteMap
          cruises={cruises}
          hoveredCruise={hoveredCruise}
          selectedCruise={selectedCruise}
        />
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
