
import React from 'react';
import CruiseCard from './CruiseCard';
import CruiseListItem from './CruiseListItem';
import { Cruise } from '@/pages/Search';

interface CruiseGridProps {
  cruises: Cruise[];
  viewMode: 'grid' | 'list';
  isLoading: boolean;
}

const CruiseGrid = ({ cruises, viewMode, isLoading }: CruiseGridProps) => {
  if (isLoading) {
    return (
      <div className={`grid gap-7 ${viewMode === 'grid' 
        ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' 
        : 'grid-cols-1'}`}
      >
        {Array.from({ length: 6 }).map((_, i) => (
          <CruiseCardSkeleton key={i} viewMode={viewMode} />
        ))}
      </div>
    );
  }

  if (cruises.length === 0) {
    return (
      <div className="text-center py-16">
        <div className="w-38 h-38 mx-auto mb-7 bg-light-gray rounded-full flex items-center justify-center">
          <span className="text-5xl">🚢</span>
        </div>
        <h3 className="text-2xl font-semibold text-charcoal mb-3">No cruises found</h3>
        <p className="text-slate-gray mb-7 text-lg">Try adjusting your filters or search criteria</p>
        <div className="flex flex-wrap justify-center gap-3">
          <span className="px-4 py-2 bg-ocean-blue/10 text-ocean-blue rounded-full text-base cursor-pointer hover:bg-ocean-blue/20">
            Caribbean
          </span>
          <span className="px-4 py-2 bg-ocean-blue/10 text-ocean-blue rounded-full text-base cursor-pointer hover:bg-ocean-blue/20">
            Mediterranean
          </span>
          <span className="px-4 py-2 bg-ocean-blue/10 text-ocean-blue rounded-full text-base cursor-pointer hover:bg-ocean-blue/20">
            Alaska
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className={`grid gap-7 ${viewMode === 'grid' 
      ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' 
      : 'grid-cols-1'}`}
    >
      {cruises.map((cruise) => (
        viewMode === 'grid' ? (
          <CruiseCard key={cruise.id} cruise={cruise} />
        ) : (
          <CruiseListItem key={cruise.id} cruise={cruise} />
        )
      ))}
    </div>
  );
};

// Skeleton component for loading state - increased sizes
const CruiseCardSkeleton = ({ viewMode }: { viewMode: 'grid' | 'list' }) => (
  <div className={`bg-white rounded-lg border border-border-gray overflow-hidden animate-pulse ${
    viewMode === 'list' ? 'flex' : ''
  }`}>
    <div className={`bg-gray-200 ${
      viewMode === 'list' ? 'w-96 h-58' : 'w-full h-77'
    }`} />
    <div className="p-5 flex-1">
      <div className="h-5 bg-gray-200 rounded mb-3" />
      <div className="h-4 bg-gray-200 rounded w-3/4 mb-5" />
      <div className="flex justify-between items-center">
        <div className="h-4 bg-gray-200 rounded w-1/2" />
        <div className="h-5 bg-gray-200 rounded w-1/4" />
      </div>
    </div>
  </div>
);

export default CruiseGrid;
