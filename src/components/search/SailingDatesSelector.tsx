
import React, { useState } from 'react';
import { Calendar, ChevronDown, ChevronUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { format } from 'date-fns';

interface SailingDatesSelectorProps {
  sailingDates: string[];
  selectedDate: string;
  onDateSelect: (date: string) => void;
  shipName: string;
}

const SailingDatesSelector = ({ sailingDates, selectedDate, onDateSelect, shipName }: SailingDatesSelectorProps) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), 'MMM dd, yyyy');
    } catch (error) {
      return dateString;
    }
  };

  const getDateStatus = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = date.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays < 0) return { status: 'past', label: 'Sailed' };
    if (diffDays < 30) return { status: 'soon', label: 'Filling Fast' };
    if (diffDays < 90) return { status: 'available', label: 'Good Availability' };
    return { status: 'advance', label: 'Early Booking' };
  };

  return (
    <div className="bg-white border border-border-gray rounded-lg overflow-hidden">
      {/* Header */}
      <div className="p-3 bg-light-gray border-b border-border-gray">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-ocean-blue" />
            <span className="font-medium text-charcoal text-sm">
              {sailingDates.length} Available Dates
            </span>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsExpanded(!isExpanded)}
            className="h-6 w-6 p-0"
          >
            {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </Button>
        </div>
      </div>

      {/* Selected Date Display */}
      <div className="p-3 border-b border-border-gray">
        <div className="text-sm text-slate-gray mb-1">Selected Departure</div>
        <div className="font-medium text-charcoal">{formatDate(selectedDate)}</div>
        <div className="text-xs text-ocean-blue mt-1">
          {getDateStatus(selectedDate).label}
        </div>
      </div>

      {/* All Dates (Expandable) */}
      {isExpanded && (
        <div className="max-h-64 overflow-y-auto">
          {sailingDates.map((date, index) => {
            const { status, label } = getDateStatus(date);
            const isSelected = date === selectedDate;
            const isPast = status === 'past';
            
            return (
              <button
                key={index}
                onClick={() => !isPast && onDateSelect(date)}
                disabled={isPast}
                className={`w-full p-3 border-b border-border-gray last:border-b-0 text-left hover:bg-light-gray transition-colors ${
                  isSelected ? 'bg-ocean-blue/10 border-l-4 border-l-ocean-blue' : ''
                } ${isPast ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <div className={`font-medium ${isSelected ? 'text-ocean-blue' : 'text-charcoal'}`}>
                      {formatDate(date)}
                    </div>
                    <div className={`text-xs mt-1 ${
                      status === 'soon' ? 'text-coral-pink' :
                      status === 'available' ? 'text-green-600' :
                      status === 'advance' ? 'text-sunset-orange' :
                      'text-slate-gray'
                    }`}>
                      {label}
                    </div>
                  </div>
                  {isSelected && (
                    <div className="text-ocean-blue text-xs font-medium">
                      Selected
                    </div>
                  )}
                </div>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default SailingDatesSelector;
