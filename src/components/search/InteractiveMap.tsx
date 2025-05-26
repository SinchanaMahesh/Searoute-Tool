
import React from 'react';
import { Cruise } from '@/pages/Search';

interface InteractiveMapProps {
  cruises: Cruise[];
}

const InteractiveMap = ({ cruises }: InteractiveMapProps) => {
  return (
    <div className="bg-white rounded-lg border border-border-gray overflow-hidden">
      <div className="h-[600px] bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-4 bg-ocean-blue/20 rounded-full flex items-center justify-center">
            <span className="text-2xl">🗺️</span>
          </div>
          <h3 className="text-lg font-semibold text-charcoal mb-2">Interactive Map Coming Soon</h3>
          <p className="text-slate-gray">
            Explore cruise routes and destinations on an interactive world map
          </p>
        </div>
      </div>
    </div>
  );
};

export default InteractiveMap;
