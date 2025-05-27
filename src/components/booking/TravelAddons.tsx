
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Plane, Hotel, Car, Train, Star, MapPin, Clock, DollarSign } from 'lucide-react';

const TravelAddons = ({ onNext, onPrev, onUpdate, data }: any) => {
  const [selectedFlight, setSelectedFlight] = useState(null);
  const [selectedHotel, setSelectedHotel] = useState(null);
  const [selectedTransport, setSelectedTransport] = useState(null);
  const [departureCity, setDepartureCity] = useState('');

  const flightOptions = [
    {
      id: 1,
      airline: "American Airlines",
      departure: "9:30 AM",
      arrival: "12:45 PM",
      duration: "3h 15m",
      price: 345,
      stops: "Nonstop",
      logo: "🛫"
    },
    {
      id: 2,
      airline: "Delta",
      departure: "2:15 PM", 
      arrival: "6:30 PM",
      duration: "4h 15m",
      price: 298,
      stops: "1 stop",
      logo: "✈️"
    }
  ];

  const hotelOptions = [
    {
      id: 1,
      name: "Miami Airport Marriott",
      rating: 4.5,
      distance: "0.2 miles from airport",
      terminalDistance: "15 min to cruise terminal",
      price: 189,
      image: "🏨",
      amenities: ["Free WiFi", "Pool", "Gym", "Restaurant"]
    },
    {
      id: 2,
      name: "InterContinental Miami",
      rating: 4.8,
      distance: "Downtown Miami",
      terminalDistance: "10 min to cruise terminal",
      price: 245,
      image: "🏨",
      amenities: ["Ocean view", "Spa", "Pool", "Fine dining"]
    }
  ];

  const transportOptions = [
    {
      id: 1,
      type: "Shared Transfer",
      description: "Shared shuttle service",
      duration: "45-60 min",
      price: 35,
      icon: "🚐"
    },
    {
      id: 2,
      type: "Private Transfer",
      description: "Private vehicle with driver",
      duration: "30 min",
      price: 85,
      icon: "🚗"
    },
    {
      id: 3,
      type: "Rental Car",
      description: "Economy car rental + parking",
      duration: "30 min + parking",
      price: 45,
      icon: "🚙"
    }
  ];

  const calculatePackageSavings = () => {
    const individualTotal = (selectedFlight?.price || 0) + (selectedHotel?.price || 0) + (selectedTransport?.price || 0);
    const packageDiscount = individualTotal * 0.08; // 8% package discount
    return packageDiscount;
  };

  const getPackageTotal = () => {
    const individualTotal = (selectedFlight?.price || 0) + (selectedHotel?.price || 0) + (selectedTransport?.price || 0);
    return individualTotal - calculatePackageSavings();
  };

  const handleContinue = () => {
    onUpdate({
      flights: selectedFlight,
      hotel: selectedHotel,
      transport: selectedTransport
    });
    onNext();
  };

  return (
    <div className="space-y-8">
      {/* Package Savings Header */}
      {(selectedFlight || selectedHotel || selectedTransport) && (
        <Card className="bg-gradient-to-r from-seafoam-green to-ocean-blue text-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xl font-bold">Dynamic Package Savings</h3>
                <p className="text-white/90">Book together and save more</p>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold">${calculatePackageSavings().toFixed(0)} OFF</div>
                <div className="text-white/90">8% package discount</div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Flight Selection */}
      <div>
        <div className="flex items-center gap-2 mb-4">
          <Plane className="w-5 h-5 text-ocean-blue" />
          <h3 className="text-xl font-semibold text-charcoal">Add Flights</h3>
        </div>
        
        <Card className="mb-4">
          <CardContent className="p-4">
            <div className="flex items-center gap-4">
              <div className="flex-1">
                <label className="text-sm font-medium text-charcoal">Departure City</label>
                <Input 
                  placeholder="Enter city or airport code"
                  value={departureCity}
                  onChange={(e) => setDepartureCity(e.target.value)}
                  className="mt-1"
                />
              </div>
              <div className="text-center text-slate-gray">
                <div className="text-lg">→</div>
                <div className="text-xs">to</div>
              </div>
              <div className="flex-1">
                <label className="text-sm font-medium text-charcoal">Destination</label>
                <Input value="Miami, FL (MIA)" disabled className="mt-1" />
              </div>
            </div>
          </CardContent>
        </Card>

        {departureCity && (
          <div className="grid md:grid-cols-2 gap-4">
            {flightOptions.map((flight) => (
              <Card 
                key={flight.id}
                className={`cursor-pointer transition-all ${
                  selectedFlight?.id === flight.id ? 'ring-2 ring-ocean-blue' : 'hover:shadow-md'
                }`}
                onClick={() => setSelectedFlight(flight)}
              >
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <span className="text-xl">{flight.logo}</span>
                      <span className="font-semibold">{flight.airline}</span>
                    </div>
                    <Badge variant="outline">{flight.stops}</Badge>
                  </div>
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <div className="font-semibold">{flight.departure}</div>
                      <div className="text-sm text-slate-gray">{departureCity}</div>
                    </div>
                    <div className="text-center">
                      <div className="text-sm text-slate-gray">{flight.duration}</div>
                      <div className="text-xs">━━━━►</div>
                    </div>
                    <div className="text-right">
                      <div className="font-semibold">{flight.arrival}</div>
                      <div className="text-sm text-slate-gray">Miami, FL</div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="text-lg font-bold text-sunset-orange">${flight.price}</div>
                    <div className="text-sm text-slate-gray">per person</div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Hotel Selection */}
      <div>
        <div className="flex items-center gap-2 mb-4">
          <Hotel className="w-5 h-5 text-ocean-blue" />
          <h3 className="text-xl font-semibold text-charcoal">Pre-Cruise Hotel Stay</h3>
        </div>
        
        <div className="grid md:grid-cols-2 gap-4">
          {hotelOptions.map((hotel) => (
            <Card 
              key={hotel.id}
              className={`cursor-pointer transition-all ${
                selectedHotel?.id === hotel.id ? 'ring-2 ring-ocean-blue' : 'hover:shadow-md'
              }`}
              onClick={() => setSelectedHotel(hotel)}
            >
              <CardContent className="p-4">
                <div className="flex items-start gap-3 mb-3">
                  <span className="text-2xl">{hotel.image}</span>
                  <div className="flex-1">
                    <h4 className="font-semibold text-charcoal">{hotel.name}</h4>
                    <div className="flex items-center gap-1 mt-1">
                      <Star className="w-4 h-4 fill-current text-yellow-400" />
                      <span className="text-sm">{hotel.rating}</span>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-2 mb-3">
                  <div className="flex items-center gap-2 text-sm text-slate-gray">
                    <MapPin className="w-4 h-4" />
                    {hotel.distance}
                  </div>
                  <div className="flex items-center gap-2 text-sm text-slate-gray">
                    <Clock className="w-4 h-4" />
                    {hotel.terminalDistance}
                  </div>
                </div>

                <div className="flex flex-wrap gap-1 mb-3">
                  {hotel.amenities.slice(0, 3).map((amenity, index) => (
                    <Badge key={index} variant="secondary" className="text-xs">
                      {amenity}
                    </Badge>
                  ))}
                </div>

                <div className="flex items-center justify-between">
                  <div className="text-lg font-bold text-sunset-orange">${hotel.price}</div>
                  <div className="text-sm text-slate-gray">per night</div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Ground Transportation */}
      <div>
        <div className="flex items-center gap-2 mb-4">
          <Car className="w-5 h-5 text-ocean-blue" />
          <h3 className="text-xl font-semibold text-charcoal">Ground Transportation</h3>
        </div>
        
        <div className="grid md:grid-cols-3 gap-4">
          {transportOptions.map((transport) => (
            <Card 
              key={transport.id}
              className={`cursor-pointer transition-all ${
                selectedTransport?.id === transport.id ? 'ring-2 ring-ocean-blue' : 'hover:shadow-md'
              }`}
              onClick={() => setSelectedTransport(transport)}
            >
              <CardContent className="p-4 text-center">
                <div className="text-3xl mb-3">{transport.icon}</div>
                <h4 className="font-semibold text-charcoal mb-2">{transport.type}</h4>
                <p className="text-sm text-slate-gray mb-2">{transport.description}</p>
                <div className="text-xs text-slate-gray mb-3">{transport.duration}</div>
                <div className="text-lg font-bold text-sunset-orange">${transport.price}</div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Package Summary */}
      {(selectedFlight || selectedHotel || selectedTransport) && (
        <Card className="border-2 border-seafoam-green">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <DollarSign className="w-5 h-5 text-seafoam-green" />
              Package Summary
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {selectedFlight && (
                <div className="flex justify-between">
                  <span>Flights ({selectedFlight.airline})</span>
                  <span>${selectedFlight.price}</span>
                </div>
              )}
              {selectedHotel && (
                <div className="flex justify-between">
                  <span>Hotel ({selectedHotel.name})</span>
                  <span>${selectedHotel.price}</span>
                </div>
              )}
              {selectedTransport && (
                <div className="flex justify-between">
                  <span>Transportation ({selectedTransport.type})</span>
                  <span>${selectedTransport.price}</span>
                </div>
              )}
              <hr />
              <div className="flex justify-between text-red-600">
                <span>Package Discount (8%)</span>
                <span>-${calculatePackageSavings().toFixed(0)}</span>
              </div>
              <div className="flex justify-between font-bold text-lg">
                <span>Total</span>
                <span>${getPackageTotal().toFixed(0)}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Navigation */}
      <div className="flex justify-between pt-6">
        <Button variant="outline" onClick={onPrev}>
          Back to Cruise Selection
        </Button>
        <Button 
          onClick={handleContinue}
          className="bg-ocean-blue hover:bg-deep-navy text-white"
        >
          Continue to Guest Information
        </Button>
      </div>
    </div>
  );
};

export default TravelAddons;
