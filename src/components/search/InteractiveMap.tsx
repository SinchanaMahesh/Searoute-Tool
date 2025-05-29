
import React from 'react';
import { CruiseData } from '@/api/mockCruiseData';

interface InteractiveMapProps {
  cruises: CruiseData[];
  selectedCruise?: string | null;
}

const InteractiveMap = ({ cruises, selectedCruise }: InteractiveMapProps) => {
  const displayCruise = selectedCruise 
    ? cruises.find(c => c.id === selectedCruise) 
    : cruises.length > 0 ? cruises[0] : null;

  return (
    <div className="bg-white rounded-lg border border-border-gray overflow-hidden h-full">
      <div className="h-full bg-gradient-to-br from-blue-50 to-blue-100 flex flex-col">
        {/* Map area */}
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="w-16 h-16 mx-auto mb-4 bg-ocean-blue/20 rounded-full flex items-center justify-center">
              <span className="text-2xl">🗺️</span>
            </div>
            <h3 className="text-lg font-semibold text-charcoal mb-2">Route Visualization</h3>
            {displayCruise ? (
              <p className="text-slate-gray text-sm">
                Showing route for {displayCruise.shipName}
              </p>
            ) : (
              <p className="text-slate-gray text-sm">
                Select a cruise to view its route
              </p>
            )}
          </div>
        </div>
        
        {/* Cruise details at bottom */}
        {displayCruise && (
          <div className="p-4 bg-white border-t border-border-gray">
            <div className="text-sm">
              <h4 className="font-semibold text-charcoal">{displayCruise.shipName}</h4>
              <p className="text-slate-gray">{displayCruise.route} • {displayCruise.duration} nights</p>
              <p className="text-ocean-blue font-medium">From ${displayCruise.priceFrom}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default InteractiveMap;
