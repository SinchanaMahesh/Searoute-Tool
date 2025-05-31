
import React, { useState } from 'react';
import { Calendar, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { format } from 'date-fns';

interface CompactDateSelectorProps {
  sailingDates: string[];
  selectedDate: string;
  onDateSelect: (date: string) => void;
  shipName: string;
}

const CompactDateSelector = ({ sailingDates, selectedDate, onDateSelect, shipName }: CompactDateSelectorProps) => {
  const [isOpen, setIsOpen] = useState(false);

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
    
    if (diffDays < 0) return { status: 'past', label: 'Sailed', price: 0 };
    
    // Generate price based on date and status
    const basePrice = Math.floor(Math.random() * 1500) + 800;
    let multiplier = 1;
    
    if (diffDays < 30) {
      multiplier = 1.2; // Higher price for soon dates
      return { status: 'soon', label: 'Filling Fast', price: Math.floor(basePrice * multiplier) };
    }
    if (diffDays < 90) {
      multiplier = 1.0; // Regular price
      return { status: 'available', label: 'Good Availability', price: Math.floor(basePrice * multiplier) };
    }
    
    multiplier = 0.85; // Lower price for advance booking
    return { status: 'advance', label: 'Early Booking', price: Math.floor(basePrice * multiplier) };
  };

  const selectedDateInfo = getDateStatus(selectedDate);

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className="justify-between min-w-[200px] text-left h-auto py-2"
          onClick={() => setIsOpen(!isOpen)}
        >
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-coral-pink" />
            <div>
              <div className="font-medium text-sm text-coral-pink">{formatDate(selectedDate)}</div>
              <div className="text-xs text-slate-gray">From ${selectedDateInfo.price}</div>
            </div>
          </div>
          <ChevronDown className="w-4 h-4 text-slate-gray" />
        </Button>
      </PopoverTrigger>
      
      <PopoverContent className="w-80 p-0" align="start">
        <div className="p-3 border-b border-border-gray bg-light-gray">
          <h4 className="font-medium text-sm text-charcoal">Select Departure Date</h4>
          <p className="text-xs text-slate-gray">{sailingDates.length} dates available for {shipName}</p>
        </div>
        
        <div className="max-h-64 overflow-y-auto">
          {sailingDates.map((date, index) => {
            const { status, label, price } = getDateStatus(date);
            const isSelected = date === selectedDate;
            const isPast = status === 'past';
            
            return (
              <button
                key={index}
                onClick={() => {
                  if (!isPast) {
                    onDateSelect(date);
                    setIsOpen(false);
                  }
                }}
                disabled={isPast}
                className={`w-full p-3 border-b border-border-gray last:border-b-0 text-left hover:bg-light-gray transition-colors ${
                  isSelected ? 'bg-ocean-blue/10 border-l-4 border-l-ocean-blue' : ''
                } ${isPast ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className={`font-medium text-sm ${isSelected ? 'text-ocean-blue' : 'text-charcoal'}`}>
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
                  <div className="text-right">
                    <div className={`font-semibold ${isSelected ? 'text-ocean-blue' : 'text-charcoal'}`}>
                      ${price}
                    </div>
                    <div className="text-xs text-slate-gray">per person</div>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default CompactDateSelector;
