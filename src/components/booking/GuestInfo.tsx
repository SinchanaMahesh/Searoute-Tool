
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { User, Upload, Shield, Gift, Accessibility } from 'lucide-react';

const GuestInfo = ({ onNext, onPrev, onUpdate, data }: any) => {
  const [guests, setGuests] = useState([
    {
      id: 1,
      type: 'primary',
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      dateOfBirth: '',
      gender: '',
      documents: null,
      specialRequests: ''
    }
  ]);

  const [billingInfo, setBillingInfo] = useState({
    sameAsGuest: true,
    address: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'US'
  });

  const addGuest = () => {
    const newGuest = {
      id: guests.length + 1,
      type: 'additional',
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      dateOfBirth: '',
      gender: '',
      documents: null,
      specialRequests: ''
    };
    setGuests([...guests, newGuest]);
  };

  const updateGuest = (id: number, field: string, value: any) => {
    setGuests(guests.map(guest => 
      guest.id === id ? { ...guest, [field]: value } : guest
    ));
  };

  const removeGuest = (id: number) => {
    if (guests.length > 1 && id !== 1) {
      setGuests(guests.filter(guest => guest.id !== id));
    }
  };

  const handleContinue = () => {
    onUpdate({ guests, billingInfo });
    onNext();
  };

  const validateForm = () => {
    return guests.every(guest => 
      guest.firstName && guest.lastName && guest.email && guest.dateOfBirth
    );
  };

  return (
    <div className="space-y-8">
      {/* Guest Information Cards */}
      <div>
        <h3 className="text-xl font-semibold text-charcoal mb-4">Guest Information</h3>
        <div className="space-y-6">
          {guests.map((guest, index) => (
            <Card key={guest.id} className={guest.type === 'primary' ? 'ring-2 ring-seafoam-green' : ''}>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <User className="w-5 h-5" />
                    {guest.type === 'primary' ? 'Primary Guest' : `Guest ${index + 1}`}
                  </div>
                  {guest.type !== 'primary' && (
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => removeGuest(guest.id)}
                      className="text-red-600 hover:text-red-700"
                    >
                      Remove
                    </Button>
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Personal Information */}
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor={`firstName-${guest.id}`}>First Name *</Label>
                    <Input
                      id={`firstName-${guest.id}`}
                      value={guest.firstName}
                      onChange={(e) => updateGuest(guest.id, 'firstName', e.target.value)}
                      placeholder="Enter first name"
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor={`lastName-${guest.id}`}>Last Name *</Label>
                    <Input
                      id={`lastName-${guest.id}`}
                      value={guest.lastName}
                      onChange={(e) => updateGuest(guest.id, 'lastName', e.target.value)}
                      placeholder="Enter last name"
                      className="mt-1"
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor={`email-${guest.id}`}>Email Address *</Label>
                    <Input
                      id={`email-${guest.id}`}
                      type="email"
                      value={guest.email}
                      onChange={(e) => updateGuest(guest.id, 'email', e.target.value)}
                      placeholder="Enter email address"
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor={`phone-${guest.id}`}>Phone Number</Label>
                    <Input
                      id={`phone-${guest.id}`}
                      type="tel"
                      value={guest.phone}
                      onChange={(e) => updateGuest(guest.id, 'phone', e.target.value)}
                      placeholder="Enter phone number"
                      className="mt-1"
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor={`dob-${guest.id}`}>Date of Birth *</Label>
                    <Input
                      id={`dob-${guest.id}`}
                      type="date"
                      value={guest.dateOfBirth}
                      onChange={(e) => updateGuest(guest.id, 'dateOfBirth', e.target.value)}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label>Gender</Label>
                    <Select value={guest.gender} onValueChange={(value) => updateGuest(guest.id, 'gender', value)}>
                      <SelectTrigger className="mt-1">
                        <SelectValue placeholder="Select gender" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="male">Male</SelectItem>
                        <SelectItem value="female">Female</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                        <SelectItem value="prefer-not-to-say">Prefer not to say</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Document Upload */}
                <div>
                  <Label className="flex items-center gap-2">
                    <Shield className="w-4 h-4" />
                    Travel Documents
                  </Label>
                  <div className="mt-2 border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                    <Upload className="w-8 h-8 mx-auto text-gray-400 mb-2" />
                    <p className="text-sm text-gray-600 mb-2">
                      Upload passport or government-issued ID
                    </p>
                    <Button variant="outline" size="sm">
                      Choose File
                    </Button>
                    <p className="text-xs text-gray-500 mt-2">
                      Accepted formats: PDF, JPG, PNG (Max 5MB)
                    </p>
                  </div>
                </div>

                {/* Special Requests */}
                <div>
                  <Label htmlFor={`special-${guest.id}`} className="flex items-center gap-2">
                    <Gift className="w-4 h-4" />
                    Special Requests & Dietary Restrictions
                  </Label>
                  <Textarea
                    id={`special-${guest.id}`}
                    value={guest.specialRequests}
                    onChange={(e) => updateGuest(guest.id, 'specialRequests', e.target.value)}
                    placeholder="Let us know about any dietary restrictions, accessibility needs, special occasions, or other requests..."
                    className="mt-1"
                    rows={3}
                  />
                </div>
              </CardContent>
            </Card>
          ))}

          <Button 
            variant="outline" 
            onClick={addGuest}
            className="w-full border-dashed"
          >
            + Add Another Guest
          </Button>
        </div>
      </div>

      {/* Accessibility & Special Services */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Accessibility className="w-5 h-5" />
            Accessibility & Special Services
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <Checkbox id="wheelchair" />
                <Label htmlFor="wheelchair">Wheelchair accessible cabin</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox id="mobility" />
                <Label htmlFor="mobility">Mobility assistance needed</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox id="hearing" />
                <Label htmlFor="hearing">Hearing assistance needed</Label>
              </div>
            </div>
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <Checkbox id="visual" />
                <Label htmlFor="visual">Visual assistance needed</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox id="service-animal" />
                <Label htmlFor="service-animal">Traveling with service animal</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox id="other-assistance" />
                <Label htmlFor="other-assistance">Other assistance needed</Label>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Travel Insurance */}
      <Card className="border-2 border-sunset-orange bg-orange-50">
        <CardHeader>
          <CardTitle className="text-sunset-orange">Protect Your Investment</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-start gap-4">
            <div className="flex-1">
              <h4 className="font-semibold text-charcoal mb-2">Travel Protection Plan</h4>
              <p className="text-sm text-slate-gray mb-3">
                Covers trip cancellation, medical emergencies, and more. Starting at $89 per person.
              </p>
              <ul className="text-sm text-slate-gray space-y-1">
                <li>• Trip cancellation/interruption coverage</li>
                <li>• Emergency medical coverage</li>
                <li>• Baggage protection</li>
                <li>• 24/7 travel assistance</li>
              </ul>
            </div>
            <div className="text-center">
              <Button className="bg-sunset-orange hover:bg-orange-600 text-white">
                Add Protection
              </Button>
              <p className="text-xs text-slate-gray mt-2">Optional coverage</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Navigation */}
      <div className="flex justify-between pt-6">
        <Button variant="outline" onClick={onPrev}>
          Back to Travel Add-ons
        </Button>
        <Button 
          onClick={handleContinue}
          disabled={!validateForm()}
          className="bg-ocean-blue hover:bg-deep-navy text-white"
        >
          Continue to Payment
        </Button>
      </div>
    </div>
  );
};

export default GuestInfo;
