
import React, { useState } from 'react';
import { CruiseData } from '@/api/mockCruiseData';
import CruiseCard from './CruiseCard';
import CruiseListItem from './CruiseListItem';
import CompactDateSelector from './CompactDateSelector';

interface CruiseResultsProps {
  cruises: CruiseData[];
  isLoading: boolean;
  onCruiseHover?: (cruiseId: string | null) => void;
  onCruiseSelect: (cruiseId: string) => void;
  selectedCruiseId?: string | null;
  sortBy: string;
  onSortChange: (value: string) => void;
  viewMode: 'grid' | 'list';
  onViewModeChange: (mode: 'grid' | 'list') => void;
}

const CruiseResults = ({ 
  cruises, 
  isLoading, 
  onCruiseHover, 
  onCruiseSelect, 
  selectedCruiseId, 
  viewMode
}: CruiseResultsProps) => {
  const [selectedDates, setSelectedDates] = useState<Record<string, string>>({});

  const handleDateSelect = (cruiseId: string, date: string) => {
    setSelectedDates(prev => ({ ...prev, [cruiseId]: date }));
  };

  const handleCruiseClick = (cruiseId: string) => {
    onCruiseSelect(cruiseId);
  };

  if (isLoading) {
    return (
      <div className="p-8 flex items-center justify-center">
        <div className="text-slate-gray">Loading cruises...</div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col">
      {/* Results - No controls header anymore */}
      <div className="flex-1 overflow-y-auto p-4">
        {viewMode === 'grid' ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {cruises.map((cruise) => (
              <div
                key={cruise.id}
                onClick={() => handleCruiseClick(cruise.id)}
                className={`cursor-pointer transition-all duration-200 ${
                  selectedCruiseId === cruise.id 
                    ? 'ring-2 ring-ocean-blue shadow-lg transform scale-105' 
                    : 'hover:shadow-md'
                }`}
              >
                <CruiseCard cruise={cruise} />
                <div className="mt-2 px-4">
                  <CompactDateSelector
                    sailingDates={cruise.sailingDates}
                    selectedDate={selectedDates[cruise.id] || cruise.sailingDates[0]}
                    onDateSelect={(date) => handleDateSelect(cruise.id, date)}
                    shipName={cruise.shipName}
                  />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-4">
            {cruises.map((cruise) => (
              <div
                key={cruise.id}
                onClick={() => handleCruiseClick(cruise.id)}
                className={`cursor-pointer transition-all duration-200 border rounded-lg ${
                  selectedCruiseId === cruise.id 
                    ? 'border-ocean-blue bg-ocean-blue/5 shadow-lg' 
                    : 'border-border-gray hover:border-ocean-blue/50 hover:shadow-md'
                }`}
              >
                <div className="p-4">
                  <CruiseListItem cruise={cruise} />
                  <div className="mt-3 flex justify-end">
                    <CompactDateSelector
                      sailingDates={cruise.sailingDates}
                      selectedDate={selectedDates[cruise.id] || cruise.sailingDates[0]}
                      onDateSelect={(date) => handleDateSelect(cruise.id, date)}
                      shipName={cruise.shipName}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default CruiseResults;
