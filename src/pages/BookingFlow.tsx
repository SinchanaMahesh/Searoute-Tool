
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { ChevronLeft, HelpCircle } from 'lucide-react';
import Header from '@/components/layout/Header';
import CruiseSelection from '@/components/booking/CruiseSelection';
import TravelAddons from '@/components/booking/TravelAddons';
import GuestInfo from '@/components/booking/GuestInfo';
import PaymentConfirmation from '@/components/booking/PaymentConfirmation';
import BookingSummary from '@/components/booking/BookingSummary';

const STEPS = [
  { id: 1, title: 'Cruise Selection', estimate: '5 min' },
  { id: 2, title: 'Travel Add-ons', estimate: '10 min' },
  { id: 3, title: 'Guest Info', estimate: '8 min' },
  { id: 4, title: 'Payment', estimate: '5 min' }
];

const BookingFlow = () => {
  const { cruiseId } = useParams();
  const [currentStep, setCurrentStep] = useState(1);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);
  const [bookingData, setBookingData] = useState({
    cruise: null,
    cabin: null,
    addons: [],
    flights: null,
    hotel: null,
    guests: [],
    payment: null
  });

  const progressPercentage = (currentStep / STEPS.length) * 100;

  const goToStep = (stepNumber: number) => {
    if (completedSteps.includes(stepNumber) || stepNumber === currentStep) {
      setCurrentStep(stepNumber);
    }
  };

  const nextStep = () => {
    if (currentStep < STEPS.length) {
      setCompletedSteps([...completedSteps, currentStep]);
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const updateBookingData = (stepData: any) => {
    setBookingData(prev => ({ ...prev, ...stepData }));
  };

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 1:
        return <CruiseSelection cruiseId={cruiseId} onNext={nextStep} onUpdate={updateBookingData} data={bookingData} />;
      case 2:
        return <TravelAddons onNext={nextStep} onPrev={prevStep} onUpdate={updateBookingData} data={bookingData} />;
      case 3:
        return <GuestInfo onNext={nextStep} onPrev={prevStep} onUpdate={updateBookingData} data={bookingData} />;
      case 4:
        return <PaymentConfirmation onPrev={prevStep} onUpdate={updateBookingData} data={bookingData} />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-light-gray">
      <Header />
      
      {/* Fixed Progress Header */}
      <div className="fixed top-20 left-0 right-0 z-40 bg-white border-b border-border-gray">
        <div className="container mx-auto px-4 lg:px-8 py-4">
          <div className="flex items-center justify-between mb-4">
            <Button variant="ghost" size="sm" onClick={prevStep} disabled={currentStep === 1}>
              <ChevronLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
            <h1 className="text-xl font-semibold text-charcoal">Complete Your Booking</h1>
            <Button variant="ghost" size="sm">
              <HelpCircle className="w-4 h-4 mr-2" />
              Help
            </Button>
          </div>

          {/* Desktop Progress Steps */}
          <div className="hidden md:flex items-center justify-between mb-4">
            {STEPS.map((step, index) => (
              <div key={step.id} className="flex items-center">
                <div 
                  className={`flex items-center cursor-pointer ${
                    completedSteps.includes(step.id) || currentStep === step.id ? 'opacity-100' : 'opacity-50'
                  }`}
                  onClick={() => goToStep(step.id)}
                >
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                    completedSteps.includes(step.id) 
                      ? 'bg-seafoam-green text-white' 
                      : currentStep === step.id 
                        ? 'bg-ocean-blue text-white' 
                        : 'bg-gray-200 text-gray-500'
                  }`}>
                    {completedSteps.includes(step.id) ? '✓' : step.id}
                  </div>
                  <div className="ml-3">
                    <div className="text-sm font-medium text-charcoal">{step.title}</div>
                    <div className="text-xs text-slate-gray">{step.estimate}</div>
                  </div>
                </div>
                {index < STEPS.length - 1 && (
                  <div className={`flex-1 h-0.5 mx-8 ${
                    completedSteps.includes(step.id) ? 'bg-seafoam-green' : 'bg-gray-200'
                  }`} />
                )}
              </div>
            ))}
          </div>

          {/* Mobile Progress Dots */}
          <div className="md:hidden flex items-center justify-center space-x-2 mb-4">
            {STEPS.map((step) => (
              <div
                key={step.id}
                className={`w-3 h-3 rounded-full ${
                  completedSteps.includes(step.id)
                    ? 'bg-seafoam-green'
                    : currentStep === step.id
                      ? 'bg-ocean-blue'
                      : 'bg-gray-200'
                }`}
              />
            ))}
          </div>

          {/* Progress Bar */}
          <Progress value={progressPercentage} className="h-2" />
        </div>
      </div>

      {/* Main Content */}
      <div className="pt-32">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="flex gap-8">
            {/* Main Content */}
            <div className="flex-1">
              {renderCurrentStep()}
            </div>

            {/* Booking Summary Sidebar - Desktop Only */}
            <div className="hidden lg:block w-80">
              <div className="sticky top-36">
                <BookingSummary data={bookingData} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingFlow;
