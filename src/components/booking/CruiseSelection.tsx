
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Star, MapPin, Calendar, Users, Bed, Wifi, Coffee, Car } from 'lucide-react';

const CruiseSelection = ({ cruiseId, onNext, onUpdate, data }: any) => {
  const [selectedCabin, setSelectedCabin] = useState(null);
  const [selectedAddons, setSelectedAddons] = useState([]);
  const [occupancy, setOccupancy] = useState(2);

  // Mock cruise data - in real app, fetch based on cruiseId
  const cruise = {
    id: cruiseId,
    shipName: "Symphony of the Seas",
    cruiseLine: "Royal Caribbean",
    route: "Western Caribbean",
    duration: 7,
    departureDate: "2024-07-15",
    departurePort: "Miami, FL",
    priceFrom: 1299,
    rating: 4.8,
    reviewCount: 12840,
    image: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=800&q=80",
    ports: ["Cozumel", "Jamaica", "Grand Cayman", "Perfect Day CocoCay"]
  };

  const cabinTypes = [
    {
      id: 1,
      type: "Interior",
      size: "150 sq ft",
      occupancy: "2-4 guests",
      price: 1299,
      upgrade: 0,
      image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?auto=format&fit=crop&w=400&q=80",
      amenities: ["Flat-screen TV", "Private bathroom", "Hair dryer"]
    },
    {
      id: 2,
      type: "Ocean View",
      size: "170 sq ft",
      occupancy: "2-4 guests",
      price: 1499,
      upgrade: 200,
      image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?auto=format&fit=crop&w=400&q=80",
      amenities: ["Ocean view window", "Flat-screen TV", "Private bathroom", "Hair dryer"]
    },
    {
      id: 3,
      type: "Balcony",
      size: "185 sq ft",
      occupancy: "2-4 guests",
      price: 1799,
      upgrade: 500,
      image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?auto=format&fit=crop&w=400&q=80",
      amenities: ["Private balcony", "Ocean view", "Flat-screen TV", "Private bathroom", "Hair dryer"]
    },
    {
      id: 4,
      type: "Suite",
      size: "350 sq ft",
      occupancy: "2-6 guests",
      price: 2999,
      upgrade: 1700,
      image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?auto=format&fit=crop&w=400&q=80",
      amenities: ["Separate living area", "Private balcony", "Priority boarding", "Concierge service"]
    }
  ];

  const addons = [
    {
      id: 1,
      name: "Unlimited Dining Package",
      description: "Access to all specialty restaurants",
      price: 299,
      image: "🍽️",
      category: "dining"
    },
    {
      id: 2,
      name: "Deluxe Beverage Package",
      description: "Unlimited alcoholic & non-alcoholic beverages",
      price: 459,
      image: "🍹",
      category: "beverage"
    },
    {
      id: 3,
      name: "VOOM Surf + Stream",
      description: "High-speed internet throughout the ship",
      price: 179,
      image: "📶",
      category: "internet"
    }
  ];

  const handleCabinSelect = (cabin: any) => {
    setSelectedCabin(cabin);
    onUpdate({ cabin, cruise });
  };

  const handleAddonToggle = (addon: any) => {
    const newAddons = selectedAddons.includes(addon.id)
      ? selectedAddons.filter(id => id !== addon.id)
      : [...selectedAddons, addon.id];
    setSelectedAddons(newAddons);
    onUpdate({ addons: newAddons.map(id => addons.find(a => a.id === id)) });
  };

  const calculateTotal = () => {
    const cabinPrice = selectedCabin ? selectedCabin.price * occupancy : 0;
    const addonPrice = selectedAddons.reduce((total, id) => {
      const addon = addons.find(a => a.id === id);
      return total + (addon ? addon.price * occupancy : 0);
    }, 0);
    return cabinPrice + addonPrice;
  };

  return (
    <div className="space-y-8">
      {/* Cruise Summary Hero */}
      <Card className="overflow-hidden">
        <div className="relative h-48 bg-gradient-to-r from-ocean-blue to-deep-navy">
          <img src={cruise.image} alt={cruise.shipName} className="w-full h-full object-cover opacity-80" />
          <div className="absolute inset-0 bg-black/40" />
          <div className="absolute bottom-4 left-6 text-white">
            <h2 className="text-2xl font-bold">{cruise.shipName}</h2>
            <p className="text-white/90">{cruise.cruiseLine} • {cruise.route}</p>
            <div className="flex items-center gap-4 mt-2 text-sm">
              <div className="flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                {new Date(cruise.departureDate).toLocaleDateString()}
              </div>
              <div className="flex items-center gap-1">
                <MapPin className="w-4 h-4" />
                {cruise.departurePort}
              </div>
              <div className="flex items-center gap-1">
                <Star className="w-4 h-4 fill-current text-yellow-400" />
                {cruise.rating} ({cruise.reviewCount.toLocaleString()})
              </div>
            </div>
          </div>
          <Button variant="outline" className="absolute top-4 right-4 text-white border-white hover:bg-white hover:text-charcoal">
            Change Selection
          </Button>
        </div>
      </Card>

      {/* Occupancy Selector */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="w-5 h-5" />
            Number of Guests
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => setOccupancy(Math.max(1, occupancy - 1))}
              disabled={occupancy <= 1}
            >
              -
            </Button>
            <span className="text-lg font-medium px-4">{occupancy} guests</span>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => setOccupancy(Math.min(6, occupancy + 1))}
              disabled={occupancy >= 6}
            >
              +
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Cabin Selection */}
      <div>
        <h3 className="text-xl font-semibold text-charcoal mb-4">Choose Your Cabin</h3>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
          {cabinTypes.map((cabin) => (
            <Card 
              key={cabin.id} 
              className={`cursor-pointer transition-all ${
                selectedCabin?.id === cabin.id ? 'ring-2 ring-ocean-blue' : 'hover:shadow-md'
              }`}
              onClick={() => handleCabinSelect(cabin)}
            >
              <div className="relative">
                <img src={cabin.image} alt={cabin.type} className="w-full h-32 object-cover rounded-t-lg" />
                {cabin.upgrade > 0 && (
                  <Badge className="absolute top-2 right-2 bg-sunset-orange">
                    +${cabin.upgrade}
                  </Badge>
                )}
              </div>
              <CardContent className="p-4">
                <h4 className="font-semibold text-charcoal">{cabin.type}</h4>
                <p className="text-sm text-slate-gray">{cabin.size} • {cabin.occupancy}</p>
                <div className="mt-2 space-y-1">
                  {cabin.amenities.slice(0, 2).map((amenity, index) => (
                    <p key={index} className="text-xs text-slate-gray">• {amenity}</p>
                  ))}
                  {cabin.amenities.length > 2 && (
                    <p className="text-xs text-ocean-blue">+{cabin.amenities.length - 2} more</p>
                  )}
                </div>
                <div className="mt-3 pt-3 border-t">
                  <div className="text-lg font-bold text-sunset-orange">
                    ${cabin.price * occupancy}
                  </div>
                  <div className="text-xs text-slate-gray">per booking</div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Add-on Services */}
      <div>
        <h3 className="text-xl font-semibold text-charcoal mb-4">Enhance Your Experience</h3>
        <div className="grid md:grid-cols-3 gap-4">
          {addons.map((addon) => (
            <Card 
              key={addon.id}
              className={`cursor-pointer transition-all ${
                selectedAddons.includes(addon.id) ? 'ring-2 ring-ocean-blue bg-blue-50' : 'hover:shadow-md'
              }`}
              onClick={() => handleAddonToggle(addon)}
            >
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <div className="text-2xl">{addon.image}</div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-charcoal">{addon.name}</h4>
                    <p className="text-sm text-slate-gray mt-1">{addon.description}</p>
                    <div className="mt-3">
                      <div className="text-lg font-bold text-sunset-orange">
                        ${addon.price * occupancy}
                      </div>
                      <div className="text-xs text-slate-gray">per booking</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Continue Button */}
      <div className="flex justify-end pt-6">
        <Button 
          onClick={onNext} 
          disabled={!selectedCabin}
          className="bg-ocean-blue hover:bg-deep-navy text-white px-8"
        >
          Continue to Travel Add-ons
        </Button>
      </div>
    </div>
  );
};

export default CruiseSelection;
