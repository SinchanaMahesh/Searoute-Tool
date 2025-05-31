
import React from 'react';
import { CruiseData } from '@/api/mockCruiseData';
import LeafletSearchMap from './LeafletSearchMap';

interface MapLibreRouteMapProps {
  cruises: CruiseData[];
  hoveredCruise: string | null;
  selectedCruise?: string | null;
  onLocationClick?: (locationName: string, insights: any) => void;
}

const MapLibreRouteMap = ({ cruises, hoveredCruise, selectedCruise, onLocationClick }: MapLibreRouteMapProps) => {
  return (
    <LeafletSearchMap
      cruises={cruises}
      hoveredCruise={hoveredCruise}
      selectedCruise={selectedCruise}
      onLocationClick={onLocationClick}
    />
  );
};

export default MapLibreRouteMap;
