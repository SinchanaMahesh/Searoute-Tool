
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Heart, Share, Plus, Star, Calendar, MapPin } from 'lucide-react';
import { Cruise } from '@/pages/Search';

interface CruiseCardProps {
  cruise: Cruise;
}

const CruiseCard = ({ cruise }: CruiseCardProps) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isSaved, setIsSaved] = useState(false);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
    }).format(price);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  return (
    <div className="bg-white rounded-xl border border-border-gray overflow-hidden shadow-level-1 hover:shadow-level-3 transition-all duration-300 hover:scale-[1.02] group">
      {/* Image Gallery */}
      <div className="relative aspect-video overflow-hidden">
        <img
          src={cruise.images[currentImageIndex]}
          alt={cruise.shipName}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
        
        {/* Price Badge */}
        <div className="absolute top-3 right-3 bg-ocean-blue text-white px-3 py-1 rounded-full text-sm font-semibold">
          From {formatPrice(cruise.priceFrom)}
        </div>

        {/* Savings Badge */}
        {cruise.savings && (
          <div className="absolute top-3 left-3 bg-seafoam-green text-white px-2 py-1 rounded-full text-xs font-medium">
            Save ${cruise.savings}
          </div>
        )}

        {/* Popular Badge */}
        {cruise.isPopular && (
          <div className="absolute top-12 left-3 bg-sunset-orange text-white px-2 py-1 rounded-full text-xs font-medium">
            Popular
          </div>
        )}

        {/* Image Navigation Dots */}
        {cruise.images.length > 1 && (
          <div className="absolute bottom-3 left-1/2 transform -translate-x-1/2 flex space-x-1">
            {cruise.images.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentImageIndex(index)}
                className={`w-2 h-2 rounded-full transition-colors ${
                  index === currentImageIndex ? 'bg-white' : 'bg-white/50'
                }`}
              />
            ))}
          </div>
        )}

        {/* Quick Actions */}
        <div className="absolute top-3 left-3 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <Button
            size="icon"
            variant="secondary"
            className="w-8 h-8 bg-white/90 hover:bg-white"
            onClick={() => setIsSaved(!isSaved)}
          >
            <Heart className={`w-4 h-4 ${isSaved ? 'fill-coral-pink text-coral-pink' : 'text-slate-gray'}`} />
          </Button>
          <Button
            size="icon"
            variant="secondary"
            className="w-8 h-8 bg-white/90 hover:bg-white"
          >
            <Share className="w-4 h-4 text-slate-gray" />
          </Button>
          <Button
            size="icon"
            variant="secondary"
            className="w-8 h-8 bg-white/90 hover:bg-white"
          >
            <Plus className="w-4 h-4 text-slate-gray" />
          </Button>
        </div>
      </div>

      {/* Card Content */}
      <div className="p-4">
        {/* Ship & Cruise Line */}
        <div className="mb-2">
          <h3 className="text-lg font-semibold text-charcoal mb-1">{cruise.shipName}</h3>
          <p className="text-sm text-slate-gray">{cruise.cruiseLine}</p>
        </div>

        {/* Duration & Route */}
        <div className="mb-3">
          <div className="flex items-center gap-4 text-sm text-charcoal mb-1">
            <div className="flex items-center gap-1">
              <Calendar className="w-4 h-4 text-slate-gray" />
              <span>{cruise.duration} nights</span>
            </div>
            <div className="flex items-center gap-1">
              <MapPin className="w-4 h-4 text-slate-gray" />
              <span>{cruise.route}</span>
            </div>
          </div>
          <p className="text-sm text-slate-gray">
            {cruise.ports.length} ports • Departs {formatDate(cruise.departureDate)}
          </p>
        </div>

        {/* Rating & Reviews */}
        <div className="flex items-center gap-2 mb-4">
          <div className="flex items-center gap-1">
            <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
            <span className="text-sm font-medium text-charcoal">{cruise.rating}</span>
          </div>
          <span className="text-sm text-slate-gray">
            ({cruise.reviewCount.toLocaleString()} reviews)
          </span>
        </div>

        {/* Amenities Preview */}
        <div className="flex flex-wrap gap-1 mb-4">
          {cruise.amenities.slice(0, 3).map((amenity) => (
            <span
              key={amenity}
              className="px-2 py-1 bg-light-gray text-slate-gray text-xs rounded-full"
            >
              {amenity}
            </span>
          ))}
          {cruise.amenities.length > 3 && (
            <span className="px-2 py-1 bg-light-gray text-slate-gray text-xs rounded-full">
              +{cruise.amenities.length - 3} more
            </span>
          )}
        </div>

        {/* Price & CTA */}
        <div className="flex items-center justify-between">
          <div>
            <div className="text-xl font-bold text-charcoal">
              {formatPrice(cruise.priceFrom)}
            </div>
            <div className="text-xs text-slate-gray">
              ${Math.round(cruise.priceFrom / cruise.duration)} per night
            </div>
          </div>
          <Button className="bg-ocean-blue hover:bg-deep-navy text-white">
            View Details
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CruiseCard;
