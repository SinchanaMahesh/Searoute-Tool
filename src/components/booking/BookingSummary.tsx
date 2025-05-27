
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Calendar, MapPin, Users, Phone, HelpCircle } from 'lucide-react';

const BookingSummary = ({ data }: any) => {
  const calculateSubtotal = () => {
    let total = 0;
    
    // Cruise and cabin
    if (data.cabin && data.cruise) {
      total += data.cabin.price * 2; // Assuming 2 guests
    }
    
    // Add-ons
    if (data.addons) {
      total += data.addons.reduce((sum: number, addon: any) => sum + (addon.price * 2), 0);
    }
    
    // Travel add-ons
    if (data.flights) total += data.flights.price * 2;
    if (data.hotel) total += data.hotel.price;
    if (data.transport) total += data.transport.price;
    
    return total;
  };

  const calculateTaxes = () => {
    return Math.round(calculateSubtotal() * 0.12);
  };

  const calculateTotal = () => {
    return calculateSubtotal() + calculateTaxes();
  };

  const guestCount = data.guests?.length || 2;

  return (
    <div className="space-y-4">
      {/* Booking Summary Card */}
      <Card className="sticky top-0">
        <CardHeader>
          <CardTitle className="text-lg">Booking Summary</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Cruise Details */}
          {data.cruise && (
            <div className="space-y-3">
              <div className="flex gap-3">
                <img 
                  src={data.cruise.image} 
                  alt={data.cruise.shipName}
                  className="w-16 h-16 rounded-lg object-cover"
                />
                <div className="flex-1">
                  <h4 className="font-semibold text-charcoal text-sm">{data.cruise.shipName}</h4>
                  <p className="text-xs text-slate-gray">{data.cruise.route}</p>
                  <div className="flex items-center gap-1 mt-1">
                    <Calendar className="w-3 h-3 text-slate-gray" />
                    <span className="text-xs text-slate-gray">
                      {new Date(data.cruise.departureDate).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </div>
              
              {data.cabin && (
                <div className="flex justify-between text-sm">
                  <span>{data.cabin.type} Cabin</span>
                  <span className="font-medium">${(data.cabin.price * guestCount).toLocaleString()}</span>
                </div>
              )}
            </div>
          )}

          <Separator />

          {/* Guests */}
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 text-slate-gray" />
              <span>Guests</span>
            </div>
            <span className="font-medium">{guestCount}</span>
          </div>

          {/* Add-ons */}
          {data.addons && data.addons.length > 0 && (
            <>
              <Separator />
              <div className="space-y-2">
                <h5 className="font-medium text-sm text-charcoal">Add-ons</h5>
                {data.addons.map((addon: any, index: number) => (
                  <div key={index} className="flex justify-between text-sm">
                    <span className="text-slate-gray">{addon.name}</span>
                    <span className="font-medium">${(addon.price * guestCount).toLocaleString()}</span>
                  </div>
                ))}
              </div>
            </>
          )}

          {/* Travel Add-ons */}
          {(data.flights || data.hotel || data.transport) && (
            <>
              <Separator />
              <div className="space-y-2">
                <h5 className="font-medium text-sm text-charcoal">Travel</h5>
                {data.flights && (
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-gray">Flights ({data.flights.airline})</span>
                    <span className="font-medium">${(data.flights.price * guestCount).toLocaleString()}</span>
                  </div>
                )}
                {data.hotel && (
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-gray">Hotel (1 night)</span>
                    <span className="font-medium">${data.hotel.price.toLocaleString()}</span>
                  </div>
                )}
                {data.transport && (
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-gray">{data.transport.type}</span>
                    <span className="font-medium">${data.transport.price.toLocaleString()}</span>
                  </div>
                )}
              </div>
            </>
          )}

          <Separator />

          {/* Pricing */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Subtotal</span>
              <span className="font-medium">${calculateSubtotal().toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span>Taxes & Fees</span>
              <span className="font-medium">${calculateTaxes().toLocaleString()}</span>
            </div>
            <Separator />
            <div className="flex justify-between font-bold">
              <span>Total</span>
              <span className="text-sunset-orange">${calculateTotal().toLocaleString()}</span>
            </div>
          </div>

          {/* Price Lock Timer */}
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
            <div className="flex items-center gap-2 mb-1">
              <div className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse"></div>
              <span className="text-sm font-medium text-yellow-800">Price Locked</span>
            </div>
            <p className="text-xs text-yellow-700">This price is held for 30 minutes</p>
          </div>
        </CardContent>
      </Card>

      {/* Help & Support */}
      <Card>
        <CardContent className="p-4">
          <div className="text-center space-y-3">
            <HelpCircle className="w-8 h-8 text-ocean-blue mx-auto" />
            <div>
              <h4 className="font-semibold text-charcoal">Need Help?</h4>
              <p className="text-sm text-slate-gray">Our cruise experts are here to assist</p>
            </div>
            <div className="space-y-2">
              <Button variant="outline" size="sm" className="w-full">
                <Phone className="w-4 h-4 mr-2" />
                Call 1-800-CRUISE
              </Button>
              <Button variant="ghost" size="sm" className="w-full text-ocean-blue">
                Chat with Expert
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Savings Indicator */}
      {calculateSubtotal() > 2000 && (
        <Card className="bg-seafoam-green text-white">
          <CardContent className="p-4 text-center">
            <Badge className="bg-white text-seafoam-green mb-2">
              Package Savings
            </Badge>
            <div className="text-lg font-bold">Save $156</div>
            <p className="text-sm text-white/90">vs booking separately</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default BookingSummary;
