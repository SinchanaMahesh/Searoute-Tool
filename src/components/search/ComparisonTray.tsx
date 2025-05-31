
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { X, ArrowRight } from 'lucide-react';
import { CruiseData } from '@/api/mockCruiseData';
import ComparisonModal from './ComparisonModal';

interface ComparisonTrayProps {
  isOpen: boolean;
  onClose: () => void;
  selectedCruises: CruiseData[];
  onRemoveCruise: (cruiseId: string) => void;
  onCompare: () => void;
}

const ComparisonTray = ({ isOpen, onClose, selectedCruises, onRemoveCruise, onCompare }: ComparisonTrayProps) => {
  const [isComparisonModalOpen, setIsComparisonModalOpen] = useState(false);

  if (!isOpen) return null;

  const handleCompare = () => {
    setIsComparisonModalOpen(true);
  };

  return (
    <>
      {/* Compact Comparison Tray - Non-modal */}
      <div className={`fixed bottom-0 left-0 right-0 bg-white border-t border-border-gray shadow-lg z-30 transform transition-transform duration-300 ${
        isOpen ? 'translate-y-0' : 'translate-y-full'
      }`}>
        <div className="px-4 py-3">
          <div className="flex items-center justify-between max-w-7xl mx-auto">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-ocean-blue text-white rounded-full flex items-center justify-center text-sm font-semibold">
                {selectedCruises.length}
              </div>
              <div>
                <h3 className="font-semibold text-charcoal text-sm">
                  {selectedCruises.length} cruise{selectedCruises.length !== 1 ? 's' : ''} selected for comparison
                </h3>
                <p className="text-xs text-slate-gray">
                  {selectedCruises.length < 2 ? 'Select at least 2 cruises to compare' : 'Ready to compare'}
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              {selectedCruises.length > 0 && (
                <div className="flex items-center gap-2">
                  {selectedCruises.slice(0, 3).map((cruise) => (
                    <div key={cruise.id} className="relative">
                      <img
                        src={cruise.images[0] || "https://images.unsplash.com/photo-1500375592092-40eb2168fd21?w=100"}
                        alt={cruise.shipName}
                        className="w-10 h-8 object-cover rounded border border-border-gray"
                      />
                      <button
                        onClick={() => onRemoveCruise(cruise.id)}
                        className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white rounded-full flex items-center justify-center text-xs hover:bg-red-600"
                      >
                        <X className="w-2 h-2" />
                      </button>
                    </div>
                  ))}
                  {selectedCruises.length > 3 && (
                    <div className="w-10 h-8 bg-light-gray border border-border-gray rounded flex items-center justify-center text-xs text-slate-gray">
                      +{selectedCruises.length - 3}
                    </div>
                  )}
                </div>
              )}
              
              <div className="flex items-center gap-2">
                <Button
                  onClick={handleCompare}
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
          </div>
        </div>
      </div>

      {/* Comparison Modal */}
      <ComparisonModal
        isOpen={isComparisonModalOpen}
        onClose={() => setIsComparisonModalOpen(false)}
        cruises={selectedCruises}
      />
    </>
  );
};

export default ComparisonTray;
