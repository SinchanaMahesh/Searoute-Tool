
import React from 'react';

interface PriceDisplayProps {
  price: number;
  duration: number;
  className?: string;
  showPerNight?: boolean;
}

const PriceDisplay = ({ price, duration, className = "", showPerNight = true }: PriceDisplayProps) => {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
    }).format(price);
  };

  return (
    <div className={`text-right ${className}`}>
      <div className="text-xl font-bold text-charcoal">
        {formatPrice(price)}
      </div>
      {showPerNight && (
        <div className="text-sm text-charcoal mb-1">
          from ${Math.round(price / duration)} per night
        </div>
      )}
      <div className="text-xs text-charcoal">per person</div>
    </div>
  );
};

export default PriceDisplay;
