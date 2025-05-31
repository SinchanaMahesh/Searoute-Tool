
import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Header from '@/components/layout/Header';
import { mockCruiseData } from '@/api/mockCruiseData';

const CruiseDetails = () => {
  const { cruiseId } = useParams();
  const navigate = useNavigate();
  
  const cruise = mockCruiseData.find(c => c.id === cruiseId);
  
  if (!cruise) {
    return (
      <div className="min-h-screen bg-light-gray">
        <Header />
        <div className="pt-20 p-8">
          <div className="max-w-4xl mx-auto">
            <Button 
              variant="ghost" 
              onClick={() => navigate(-1)}
              className="mb-4"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Search
            </Button>
            <div className="text-center">
              <h1 className="text-2xl font-bold text-charcoal mb-4">Cruise Not Found</h1>
              <p className="text-slate-gray">The cruise you're looking for doesn't exist.</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-light-gray">
      <Header />
      <div className="pt-20 p-8">
        <div className="max-w-4xl mx-auto">
          <Button 
            variant="ghost" 
            onClick={() => navigate(-1)}
            className="mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Search
          </Button>
          
          <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            <img 
              src={cruise.images[0]} 
              alt={cruise.shipName}
              className="w-full h-64 object-cover"
            />
            <div className="p-6">
              <h1 className="text-3xl font-bold text-charcoal mb-2">{cruise.shipName}</h1>
              <p className="text-xl text-slate-gray mb-4">{cruise.cruiseLine}</p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-semibold mb-2">Cruise Details</h3>
                  <p>Duration: {cruise.duration} nights</p>
                  <p>Route: {cruise.route}</p>
                  <p>Departure: {cruise.departurePort}</p>
                  <p>Price from: ${cruise.priceFrom.toLocaleString()}</p>
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-2">Amenities</h3>
                  <div className="flex flex-wrap gap-2">
                    {cruise.amenities.map((amenity) => (
                      <span key={amenity} className="px-3 py-1 bg-light-gray rounded-full text-sm">
                        {amenity}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CruiseDetails;
