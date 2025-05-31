
import React from 'react';
import { Star } from 'lucide-react';

interface StarRatingProps {
  rating: number;
  reviewCount?: number;
  className?: string;
}

const StarRating = ({ rating, reviewCount, className = "" }: StarRatingProps) => {
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" aria-hidden="true" />
      <span className="text-sm font-medium text-charcoal">{rating}</span>
      {reviewCount && (
        <span className="text-xs text-charcoal">
          ({reviewCount.toLocaleString()})
        </span>
      )}
    </div>
  );
};

export default StarRating;
