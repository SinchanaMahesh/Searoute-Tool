
import React from 'react';
import { X, MapPin, Cloud, Info, Camera, Anchor } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';

interface LocationInsight {
  weather: { temp: number; condition: string; };
  attractions: string[];
  facilities: string[];
  shoreExcursions: string[];
  trivia: string;
  photos: string[];
}

interface LocationInsightsModalProps {
  isOpen: boolean;
  onClose: () => void;
  locationName: string;
  insights: LocationInsight | null;
}

const LocationInsightsModal = ({ isOpen, onClose, locationName, insights }: LocationInsightsModalProps) => {
  if (!insights) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <MapPin className="w-6 h-6 text-ocean-blue" />
            {locationName}
          </DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Image */}
          <div className="lg:col-span-2">
            <div className="relative h-64 lg:h-80 rounded-lg overflow-hidden">
              <img 
                src={insights.photos[0] || 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800'} 
                alt={locationName}
                className="w-full h-full object-cover"
              />
              <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full">
                <div className="flex items-center gap-2 text-sm">
                  <Cloud className="w-4 h-4 text-blue-500" />
                  <span>{insights.weather.condition}</span>
                  <span className="font-medium text-coral-pink">{insights.weather.temp}°F</span>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Info */}
          <div className="space-y-4">
            <div className="bg-light-gray p-4 rounded-lg">
              <h4 className="font-semibold text-charcoal mb-2 flex items-center gap-2">
                <Info className="w-4 h-4 text-sunset-orange" />
                Did You Know?
              </h4>
              <p className="text-sm text-slate-gray">{insights.trivia}</p>
            </div>

            <div className="bg-light-gray p-4 rounded-lg">
              <h4 className="font-semibold text-charcoal mb-2 flex items-center gap-2">
                <Anchor className="w-4 h-4 text-ocean-blue" />
                Port Facilities
              </h4>
              <ul className="space-y-1 text-sm text-slate-gray">
                {insights.facilities.map((facility, index) => (
                  <li key={index} className="flex items-center gap-2">
                    <div className="w-1 h-1 bg-ocean-blue rounded-full" />
                    {facility}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Attractions Section */}
        <div className="mt-6">
          <h4 className="font-semibold text-charcoal mb-3 flex items-center gap-2">
            <Camera className="w-5 h-5 text-sunset-orange" />
            Top Attractions
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {insights.attractions.map((attraction, index) => (
              <div key={index} className="bg-white border border-border-gray rounded-lg p-3 hover:shadow-level-1 transition-shadow">
                <h5 className="font-medium text-charcoal text-sm">{attraction}</h5>
              </div>
            ))}
          </div>
        </div>

        {/* Shore Excursions */}
        <div className="mt-6">
          <h4 className="font-semibold text-charcoal mb-3">Available Shore Excursions</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {insights.shoreExcursions.map((excursion, index) => (
              <div key={index} className="bg-pearl-white border border-border-gray rounded-lg p-4 hover:bg-white transition-colors">
                <h5 className="font-medium text-charcoal text-sm mb-1">{excursion}</h5>
                <p className="text-xs text-slate-gray">Book through your cruise line</p>
              </div>
            ))}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-6 flex gap-3 pt-4 border-t border-border-gray">
          <Button 
            variant="outline" 
            className="flex-1"
            onClick={onClose}
          >
            Close
          </Button>
          <Button 
            className="flex-1 bg-ocean-blue hover:bg-deep-navy text-white"
            onClick={() => {
              // Could implement booking or more info functionality
              console.log(`More info about ${locationName}`);
            }}
          >
            Learn More
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default LocationInsightsModal;
