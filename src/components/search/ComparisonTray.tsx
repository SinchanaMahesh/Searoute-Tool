
import React from 'react';
import { Button } from '@/components/ui/button';
import { X, ArrowRight } from 'lucide-react';
import { CruiseData } from '@/api/mockCruiseData';

interface ComparisonTrayProps {
  isOpen: boolean;
  onClose: () => void;
  selectedCruises: CruiseData[];
  onRemoveCruise: (cruiseId: string) => void;
  onCompare: () => void;
}

const ComparisonTray = ({ isOpen, onClose, selectedCruises, onRemoveCruise, onCompare }: ComparisonTrayProps) => {
  if (!isOpen) return null;

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
    }).format(price);
  };

  return (
    <div className={`fixed bottom-0 left-0 right-0 bg-white border-t border-border-gray shadow-2xl z-40 transform transition-transform duration-300 ${
      isOpen ? 'translate-y-0' : 'translate-y-full'
    }`}>
      {/* Compact Header */}
      <div className="p-3 border-b border-border-gray flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-ocean-blue text-white rounded-full flex items-center justify-center text-sm font-semibold">
            {selectedCruises.length}
          </div>
          <div>
            <h3 className="font-semibold text-charcoal text-sm">Compare Cruises</h3>
            <p className="text-xs text-slate-gray">
              {selectedCruises.length} of 4 cruises selected
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <Button
            onClick={onCompare}
            disabled={selectedCruises.length < 2}
            size="sm"
            className="bg-ocean-blue hover:bg-deep-navy text-white"
          >
            Compare
            <ArrowRight className="w-3 h-3 ml-1" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="h-8 w-8 p-0"
          >
            <X className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Compact Content */}
      <div className="p-3">
        {selectedCruises.length === 0 ? (
          <div className="text-center py-4">
            <p className="text-slate-gray text-sm mb-1">No cruises selected for comparison</p>
            <p className="text-xs text-slate-gray">Click "+ Compare" on cruise listings to add them here</p>
          </div>
        ) : (
          <div className="flex gap-3 overflow-x-auto pb-2">
            {selectedCruises.map((cruise) => (
              <div key={cruise.id} className="relative flex-shrink-0 w-48 bg-light-gray rounded-lg p-2 border border-border-gray">
                <button
                  onClick={() => onRemoveCruise(cruise.id)}
                  className="absolute top-1 right-1 w-5 h-5 bg-white rounded-full flex items-center justify-center shadow-sm hover:bg-red-50"
                >
                  <X className="w-3 h-3 text-slate-gray hover:text-red-500" />
                </button>
                
                <div className="flex gap-2">
                  <img
                    src={cruise.images[0] || "https://images.unsplash.com/photo-1500375592092-40eb2168fd21?w=100"}
                    alt={cruise.shipName}
                    className="w-12 h-9 object-cover rounded"
                  />
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium text-xs text-charcoal truncate">{cruise.shipName}</h4>
                    <p className="text-xs text-slate-gray truncate">{cruise.cruiseLine}</p>
                    <p className="text-xs font-semibold text-ocean-blue mt-1">
                      {formatPrice(cruise.priceFrom)}
                    </p>
                  </div>
                </div>
              </div>
            ))}

            {/* Add More Placeholder */}
            {selectedCruises.length < 4 && (
              <div className="flex-shrink-0 w-48 bg-white rounded-lg p-2 border-2 border-dashed border-border-gray flex items-center justify-center">
                <div className="text-center">
                  <p className="text-xs text-slate-gray">Add {4 - selectedCruises.length} more</p>
                  <p className="text-xs text-slate-gray">cruises</p>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ComparisonTray;
