
import React from 'react';
import { createPortal } from 'react-dom';
import { useNavigate } from 'react-router-dom';
import { CruiseData } from '@/api/mockCruiseData';
import { X, Star, Calendar, MapPin, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ComparisonModalProps {
  isOpen: boolean;
  onClose: () => void;
  cruises: CruiseData[];
  searchParams?: URLSearchParams;
}

const ComparisonModal = ({ isOpen, onClose, cruises, searchParams }: ComparisonModalProps) => {
  const navigate = useNavigate();

  if (!isOpen) return null;

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

  const handleViewDetails = (cruiseId: string) => {
    const params = new URLSearchParams();
    if (searchParams) {
      searchParams.forEach((value, key) => {
        params.set(key, value);
      });
    }
    navigate(`/cruise/${cruiseId}?${params.toString()}`);
    onClose();
  };

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60" onClick={onClose} />
      
      <div className="relative bg-white rounded-lg w-full max-w-6xl max-h-[90vh] overflow-hidden shadow-2xl">
        {/* Header */}
        <div className="p-4 border-b border-border-gray flex justify-between items-center">
          <div>
            <h3 className="text-xl font-semibold text-charcoal">Compare Cruises</h3>
            <p className="text-sm text-slate-gray">Side-by-side comparison of {cruises.length} selected cruises</p>
          </div>
          <Button
            variant="outline"
            onClick={onClose}
            className="h-8 w-8 p-0"
          >
            <X className="w-4 h-4" />
          </Button>
        </div>

        {/* Comparison Content */}
        <div className="overflow-auto max-h-[calc(90vh-80px)]">
          <div className="p-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {cruises.map((cruise) => (
                <div key={cruise.id} className="border border-border-gray rounded-lg overflow-hidden">
                  {/* Cruise Image */}
                  <div className="h-48 overflow-hidden">
                    <img
                      src={cruise.images[0] || "https://images.unsplash.com/photo-1500375592092-40eb2168fd21?w=400"}
                      alt={cruise.shipName}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  {/* Cruise Details */}
                  <div className="p-4">
                    <h4 className="font-semibold text-charcoal mb-1">{cruise.shipName}</h4>
                    <p className="text-sm text-slate-gray mb-3">{cruise.cruiseLine}</p>

                    {/* Price */}
                    <div className="mb-4">
                      <div className="text-2xl font-bold text-ocean-blue">
                        {formatPrice(cruise.priceFrom)}
                      </div>
                      <div className="text-sm text-slate-gray">
                        ${Math.round(cruise.priceFrom / cruise.duration)} per night
                      </div>
                    </div>

                    {/* Key Details */}
                    <div className="space-y-2 mb-4">
                      <div className="flex items-center gap-2 text-sm">
                        <Calendar className="w-4 h-4 text-charcoal" />
                        <span>{cruise.duration} nights • {formatDate(cruise.departureDate)}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <MapPin className="w-4 h-4 text-charcoal" />
                        <span>{cruise.route}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <Users className="w-4 h-4 text-charcoal" />
                        <span>From {cruise.departurePort}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                        <span>{cruise.rating} ({cruise.reviewCount?.toLocaleString()} reviews)</span>
                      </div>
                    </div>

                    {/* Amenities */}
                    <div className="mb-4">
                      <h5 className="font-medium text-charcoal mb-2 text-sm">Amenities</h5>
                      <div className="flex flex-wrap gap-1">
                        {cruise.amenities?.slice(0, 4).map((amenity) => (
                          <span
                            key={amenity}
                            className="px-2 py-1 bg-light-gray text-xs rounded-full"
                          >
                            {amenity}
                          </span>
                        ))}
                        {(cruise.amenities?.length || 0) > 4 && (
                          <span className="px-2 py-1 bg-light-gray text-xs rounded-full">
                            +{(cruise.amenities?.length || 0) - 4} more
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Ports */}
                    <div className="mb-4">
                      <h5 className="font-medium text-charcoal mb-2 text-sm">Ports of Call</h5>
                      <div className="text-xs text-slate-gray">
                        {cruise.ports?.slice(0, 3).map((port, index) => (
                          <span key={index}>
                            {port.name}
                            {index < Math.min(2, (cruise.ports?.length || 1) - 1) && ' • '}
                          </span>
                        ))}
                        {(cruise.ports?.length || 0) > 3 && (
                          <span> • +{(cruise.ports?.length || 0) - 3} more</span>
                        )}
                      </div>
                    </div>

                    {/* Action Button */}
                    <Button 
                      className="w-full bg-ocean-blue hover:bg-deep-navy text-white"
                      onClick={() => handleViewDetails(cruise.id)}
                    >
                      View Details
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
};

export default ComparisonModal;
