
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
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/20 z-40"
        onClick={onClose}
      />
      
      {/* Sliding Tray */}
      <div className={`fixed bottom-0 left-0 right-0 bg-white border-t border-border-gray shadow-2xl z-50 transform transition-transform duration-300 ${
        isOpen ? 'translate-y-0' : 'translate-y-full'
      }`}>
        {/* Header */}
        <div className="p-4 border-b border-border-gray flex items-center justify-between">
          <div>
            <h3 className="font-semibold text-charcoal">Compare Cruises</h3>
            <p className="text-sm text-slate-gray">
              {selectedCruises.length} of 4 cruises selected
            </p>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="h-8 w-8 p-0"
          >
            <X className="w-4 h-4" />
          </Button>
        </div>

        {/* Content */}
        <div className="p-4">
          {selectedCruises.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-slate-gray mb-2">No cruises selected for comparison</p>
              <p className="text-sm text-slate-gray">Click "+ Compare" on cruise listings to add them here</p>
            </div>
          ) : (
            <>
              {/* Selected Cruises */}
              <div className="flex gap-4 overflow-x-auto pb-2 mb-4">
                {selectedCruises.map((cruise) => (
                  <div key={cruise.id} className="relative flex-shrink-0 w-64 bg-light-gray rounded-lg p-3 border border-border-gray">
                    <button
                      onClick={() => onRemoveCruise(cruise.id)}
                      className="absolute top-2 right-2 w-6 h-6 bg-white rounded-full flex items-center justify-center shadow-sm hover:bg-red-50"
                    >
                      <X className="w-3 h-3 text-slate-gray hover:text-red-500" />
                    </button>
                    
                    <div className="flex gap-3">
                      <img
                        src={cruise.images[0] || "https://images.unsplash.com/photo-1500375592092-40eb2168fd21?w=100"}
                        alt={cruise.shipName}
                        className="w-16 h-12 object-cover rounded"
                      />
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-sm text-charcoal truncate">{cruise.shipName}</h4>
                        <p className="text-xs text-slate-gray">{cruise.cruiseLine}</p>
                        <p className="text-sm font-semibold text-ocean-blue mt-1">
                          {formatPrice(cruise.priceFrom)}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}

                {/* Add More Placeholder */}
                {selectedCruises.length < 4 && (
                  <div className="flex-shrink-0 w-64 bg-white rounded-lg p-3 border-2 border-dashed border-border-gray flex items-center justify-center">
                    <div className="text-center">
                      <p className="text-sm text-slate-gray">Add more cruises</p>
                      <p className="text-xs text-slate-gray">Up to {4 - selectedCruises.length} more</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3">
                <Button
                  onClick={onCompare}
                  disabled={selectedCruises.length < 2}
                  className="bg-ocean-blue hover:bg-deep-navy text-white flex-1"
                >
                  Compare {selectedCruises.length} Cruises
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
                <Button
                  variant="outline"
                  onClick={onClose}
                  className="px-6"
                >
                  Cancel
                </Button>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default ComparisonTray;
