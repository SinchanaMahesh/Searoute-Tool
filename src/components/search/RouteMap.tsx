
import React from 'react';
import { Cruise } from '@/pages/Search';

interface RouteMapProps {
  cruises: Cruise[];
  hoveredCruise: string | null;
}

const RouteMap = ({ cruises, hoveredCruise }: RouteMapProps) => {
  const hoveredCruiseData = cruises.find(c => c.id === hoveredCruise);

  return (
    <div className="h-full bg-gradient-to-br from-blue-50 to-blue-100 relative overflow-hidden">
      {/* Map Header */}
      <div className="absolute top-0 left-0 right-0 bg-white/90 backdrop-blur-sm p-3 border-b border-border-gray z-10">
        <h3 className="font-semibold text-charcoal text-sm">Route Visualization</h3>
        <p className="text-xs text-slate-gray">
          {hoveredCruiseData 
            ? `Viewing route for ${hoveredCruiseData.shipName}` 
            : 'Hover over a cruise to see its route'}
        </p>
      </div>

      {/* Simplified Map Background */}
      <div className="absolute inset-0 pt-16">
        <svg viewBox="0 0 400 200" className="w-full h-full">
          {/* Ocean Background */}
          <rect width="400" height="200" fill="#e0f2fe" />
          
          {/* Simplified Caribbean/Atlantic coastlines */}
          <path
            d="M 50 20 L 150 30 L 200 50 L 250 40 L 300 60 L 350 50"
            stroke="#64748b"
            strokeWidth="2"
            fill="none"
          />
          <path
            d="M 80 80 L 120 85 L 160 90 L 200 85 L 240 90 L 280 85"
            stroke="#64748b"
            strokeWidth="2"
            fill="none"
          />
          
          {/* Sample ports */}
          <circle cx="100" cy="100" r="4" fill="#0ea5e9" />
          <text x="105" y="95" fontSize="8" fill="#0f172a">Miami</text>
          
          <circle cx="180" cy="130" r="3" fill="#0ea5e9" />
          <text x="185" y="125" fontSize="8" fill="#0f172a">Cozumel</text>
          
          <circle cx="220" cy="110" r="3" fill="#0ea5e9" />
          <text x="225" y="105" fontSize="8" fill="#0f172a">Nassau</text>

          {/* Route line when cruise is hovered */}
          {hoveredCruiseData && (
            <g>
              <path
                d="M 100 100 Q 140 120 180 130 Q 200 115 220 110 Q 160 95 100 100"
                stroke="#f97316"
                strokeWidth="3"
                fill="none"
                strokeDasharray="5,5"
                className="animate-pulse"
              />
              {/* Route points */}
              <circle cx="100" cy="100" r="5" fill="#f97316" className="animate-pulse" />
              <circle cx="180" cy="130" r="5" fill="#f97316" className="animate-pulse" />
              <circle cx="220" cy="110" r="5" fill="#f97316" className="animate-pulse" />
            </g>
          )}
        </svg>
      </div>

      {/* Cruise Info Overlay */}
      {hoveredCruiseData && (
        <div className="absolute bottom-4 left-4 right-4 bg-white/95 backdrop-blur-sm rounded-lg p-3 border border-border-gray shadow-level-2">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-semibold text-charcoal text-sm">{hoveredCruiseData.shipName}</h4>
              <p className="text-xs text-slate-gray">{hoveredCruiseData.route} • {hoveredCruiseData.duration} days</p>
              <p className="text-xs text-ocean-blue font-medium">
                Ports: {hoveredCruiseData.ports.slice(0, 3).join(', ')}
                {hoveredCruiseData.ports.length > 3 && ` +${hoveredCruiseData.ports.length - 3} more`}
              </p>
            </div>
            <div className="text-right">
              <p className="text-lg font-bold text-sunset-orange">${hoveredCruiseData.priceFrom}</p>
              <p className="text-xs text-slate-gray">per person</p>
            </div>
          </div>
        </div>
      )}

      {/* Map placeholder when no cruise is hovered */}
      {!hoveredCruiseData && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <div className="w-12 h-12 mx-auto mb-2 bg-ocean-blue/20 rounded-full flex items-center justify-center">
              <span className="text-xl">🗺️</span>
            </div>
            <p className="text-sm text-slate-gray">Interactive cruise routes</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default RouteMap;
