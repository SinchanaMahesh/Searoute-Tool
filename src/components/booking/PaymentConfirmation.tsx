
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Separator } from '@/components/ui/separator';
import { CreditCard, Lock, Shield, Calendar, DollarSign, CheckCircle } from 'lucide-react';

const PaymentConfirmation = ({ onPrev, onUpdate, data }: any) => {
  const [paymentMethod, setPaymentMethod] = useState('credit-card');
  const [paymentOption, setPaymentOption] = useState('full');
  const [cardInfo, setCardInfo] = useState({
    number: '',
    expiry: '',
    cvv: '',
    name: '',
    billingAddress: '',
    city: '',
    state: '',
    zipCode: ''
  });
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [bookingConfirmed, setBookingConfirmed] = useState(false);

  const calculateTotal = () => {
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

  const calculateDeposit = () => {
    return Math.round(calculateTotal() * 0.25); // 25% deposit
  };

  const calculateTaxes = () => {
    return Math.round(calculateTotal() * 0.12); // 12% taxes and fees
  };

  const handlePayment = async () => {
    setIsProcessing(true);
    
    // Simulate payment processing
    setTimeout(() => {
      setIsProcessing(false);
      setBookingConfirmed(true);
    }, 3000);
  };

  if (bookingConfirmed) {
    return (
      <div className="max-w-2xl mx-auto text-center space-y-6">
        <div className="w-20 h-20 bg-seafoam-green rounded-full flex items-center justify-center mx-auto">
          <CheckCircle className="w-12 h-12 text-white" />
        </div>
        
        <div>
          <h2 className="text-3xl font-bold text-charcoal mb-2">Booking Confirmed!</h2>
          <p className="text-slate-gray">Your cruise vacation is all set. Get ready for an amazing adventure!</p>
        </div>

        <Card className="text-left">
          <CardHeader>
            <CardTitle>Booking Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between">
              <span className="font-semibold">Booking Reference:</span>
              <span className="font-mono text-ocean-blue">RC-{Math.random().toString(36).substr(2, 8).toUpperCase()}</span>
            </div>
            <div className="flex justify-between">
              <span>Cruise:</span>
              <span>{data.cruise?.shipName} - {data.cruise?.route}</span>
            </div>
            <div className="flex justify-between">
              <span>Departure:</span>
              <span>{new Date(data.cruise?.departureDate).toLocaleDateString()}</span>
            </div>
            <div className="flex justify-between">
              <span>Cabin Type:</span>
              <span>{data.cabin?.type}</span>
            </div>
            <Separator />
            <div className="flex justify-between font-bold text-lg">
              <span>Total Paid:</span>
              <span>${paymentOption === 'full' ? calculateTotal() + calculateTaxes() : calculateDeposit()}</span>
            </div>
          </CardContent>
        </Card>

        <div className="space-y-4">
          <Button className="w-full bg-ocean-blue hover:bg-deep-navy text-white">
            <Calendar className="w-4 h-4 mr-2" />
            Add to Calendar
          </Button>
          
          <div className="grid md:grid-cols-2 gap-4">
            <Button variant="outline" className="w-full">
              Email Confirmation
            </Button>
            <Button variant="outline" className="w-full">
              Share with Friends
            </Button>
          </div>
        </div>

        <Card className="bg-blue-50 border-ocean-blue">
          <CardContent className="p-4">
            <h4 className="font-semibold text-charcoal mb-2">What's Next?</h4>
            <ul className="text-sm text-slate-gray space-y-1">
              <li>• Check-in opens 45 days before departure</li>
              <li>• Complete required travel documents</li>
              <li>• Download the Royal Caribbean app</li>
              <li>• Review packing guidelines</li>
            </ul>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Payment Options */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <DollarSign className="w-5 h-5" />
            Payment Options
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <Card 
              className={`cursor-pointer transition-all ${
                paymentOption === 'full' ? 'ring-2 ring-ocean-blue bg-blue-50' : ''
              }`}
              onClick={() => setPaymentOption('full')}
            >
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-semibold">Pay in Full</h4>
                  <div className="w-4 h-4 rounded-full border-2 border-ocean-blue">
                    {paymentOption === 'full' && <div className="w-2 h-2 bg-ocean-blue rounded-full m-0.5" />}
                  </div>
                </div>
                <p className="text-sm text-slate-gray mb-3">Pay the complete amount today</p>
                <div className="text-xl font-bold text-charcoal">
                  ${(calculateTotal() + calculateTaxes()).toLocaleString()}
                </div>
                <div className="text-sm text-seafoam-green font-medium">Save 5% early booking discount</div>
              </CardContent>
            </Card>

            <Card 
              className={`cursor-pointer transition-all ${
                paymentOption === 'deposit' ? 'ring-2 ring-ocean-blue bg-blue-50' : ''
              }`}
              onClick={() => setPaymentOption('deposit')}
            >
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-semibold">Pay Deposit</h4>
                  <div className="w-4 h-4 rounded-full border-2 border-ocean-blue">
                    {paymentOption === 'deposit' && <div className="w-2 h-2 bg-ocean-blue rounded-full m-0.5" />}
                  </div>
                </div>
                <p className="text-sm text-slate-gray mb-3">Pay 25% now, balance due 75 days before sailing</p>
                <div className="text-xl font-bold text-charcoal">
                  ${calculateDeposit().toLocaleString()}
                </div>
                <div className="text-sm text-slate-gray">
                  Remaining: ${(calculateTotal() + calculateTaxes() - calculateDeposit()).toLocaleString()}
                </div>
              </CardContent>
            </Card>
          </div>
        </CardContent>
      </Card>

      {/* Payment Methods */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CreditCard className="w-5 h-5" />
            Payment Method
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Payment Method Tabs */}
          <div className="flex gap-2">
            <Button 
              variant={paymentMethod === 'credit-card' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setPaymentMethod('credit-card')}
            >
              Credit Card
            </Button>
            <Button 
              variant={paymentMethod === 'paypal' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setPaymentMethod('paypal')}
            >
              PayPal
            </Button>
            <Button 
              variant={paymentMethod === 'financing' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setPaymentMethod('financing')}
            >
              Financing
            </Button>
          </div>

          {/* Credit Card Form */}
          {paymentMethod === 'credit-card' && (
            <div className="space-y-4">
              <div>
                <Label htmlFor="card-number">Card Number</Label>
                <Input
                  id="card-number"
                  placeholder="1234 5678 9012 3456"
                  value={cardInfo.number}
                  onChange={(e) => setCardInfo({...cardInfo, number: e.target.value})}
                  className="mt-1"
                />
              </div>
              
              <div className="grid md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="expiry">Expiry Date</Label>
                  <Input
                    id="expiry"
                    placeholder="MM/YY"
                    value={cardInfo.expiry}
                    onChange={(e) => setCardInfo({...cardInfo, expiry: e.target.value})}
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="cvv">CVV</Label>
                  <Input
                    id="cvv"
                    placeholder="123"
                    value={cardInfo.cvv}
                    onChange={(e) => setCardInfo({...cardInfo, cvv: e.target.value})}
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="card-name">Name on Card</Label>
                  <Input
                    id="card-name"
                    placeholder="John Doe"
                    value={cardInfo.name}
                    onChange={(e) => setCardInfo({...cardInfo, name: e.target.value})}
                    className="mt-1"
                  />
                </div>
              </div>

              {/* Billing Address */}
              <div className="space-y-4">
                <h4 className="font-semibold text-charcoal">Billing Address</h4>
                <div className="flex items-center space-x-2 mb-4">
                  <Checkbox id="same-as-guest" defaultChecked />
                  <Label htmlFor="same-as-guest">Same as guest address</Label>
                </div>
              </div>
            </div>
          )}

          {/* PayPal Option */}
          {paymentMethod === 'paypal' && (
            <div className="text-center py-8">
              <Button className="bg-blue-600 hover:bg-blue-700 text-white px-8">
                Continue with PayPal
              </Button>
              <p className="text-sm text-slate-gray mt-2">
                You'll be redirected to PayPal to complete your payment
              </p>
            </div>
          )}

          {/* Financing Option */}
          {paymentMethod === 'financing' && (
            <div className="space-y-4">
              <div className="bg-blue-50 p-4 rounded-lg">
                <h4 className="font-semibold text-charcoal mb-2">12 Month Payment Plan</h4>
                <div className="text-2xl font-bold text-ocean-blue">
                  ${Math.round((calculateTotal() + calculateTaxes()) / 12)}/month
                </div>
                <p className="text-sm text-slate-gray">0% APR for qualified buyers</p>
              </div>
              <Button className="w-full bg-ocean-blue hover:bg-deep-navy text-white">
                Check Eligibility
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Final Review */}
      <Card>
        <CardHeader>
          <CardTitle>Final Review</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <div className="flex justify-between">
              <span>Cruise & Cabin</span>
              <span>${((data.cabin?.price || 0) * 2).toLocaleString()}</span>
            </div>
            {data.addons?.length > 0 && (
              <div className="flex justify-between">
                <span>Add-ons</span>
                <span>${data.addons.reduce((sum: number, addon: any) => sum + (addon.price * 2), 0).toLocaleString()}</span>
              </div>
            )}
            {data.flights && (
              <div className="flex justify-between">
                <span>Flights</span>
                <span>${(data.flights.price * 2).toLocaleString()}</span>
              </div>
            )}
            {data.hotel && (
              <div className="flex justify-between">
                <span>Hotel</span>
                <span>${data.hotel.price.toLocaleString()}</span>
              </div>
            )}
            {data.transport && (
              <div className="flex justify-between">
                <span>Transportation</span>
                <span>${data.transport.price.toLocaleString()}</span>
              </div>
            )}
            <Separator />
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span>${calculateTotal().toLocaleString()}</span>
            </div>
            <div className="flex justify-between">
              <span>Taxes & Fees</span>
              <span>${calculateTaxes().toLocaleString()}</span>
            </div>
            <Separator />
            <div className="flex justify-between font-bold text-lg">
              <span>Total</span>
              <span>${(calculateTotal() + calculateTaxes()).toLocaleString()}</span>
            </div>
            {paymentOption === 'deposit' && (
              <div className="flex justify-between font-bold text-ocean-blue">
                <span>Due Today</span>
                <span>${calculateDeposit().toLocaleString()}</span>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Terms and Security */}
      <div className="space-y-4">
        <div className="flex items-center space-x-2">
          <Checkbox 
            id="terms" 
            checked={agreedToTerms}
            onCheckedChange={(checked) => setAgreedToTerms(checked as boolean)}
          />
          <Label htmlFor="terms" className="text-sm">
            I agree to the <a href="#" className="text-ocean-blue hover:underline">Terms & Conditions</a> and <a href="#" className="text-ocean-blue hover:underline">Cancellation Policy</a>
          </Label>
        </div>

        <div className="flex items-center gap-2 text-sm text-slate-gray">
          <Shield className="w-4 h-4" />
          <span>Your payment information is encrypted and secure</span>
        </div>
      </div>

      {/* Navigation */}
      <div className="flex justify-between pt-6">
        <Button variant="outline" onClick={onPrev} disabled={isProcessing}>
          Back to Guest Information
        </Button>
        <Button 
          onClick={handlePayment}
          disabled={!agreedToTerms || isProcessing}
          className="bg-seafoam-green hover:bg-green-600 text-white px-8"
        >
          {isProcessing ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              Processing...
            </>
          ) : (
            <>
              <Lock className="w-4 h-4 mr-2" />
              Complete Booking
            </>
          )}
        </Button>
      </div>
    </div>
  );
};

export default PaymentConfirmation;
