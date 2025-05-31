
import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Heart, Share, MapPin, Calendar, Users, Star, Clock, Wifi, Car, Utensils } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Header from '@/components/layout/Header';
import { mockCruiseData } from '@/api/mockCruiseData';
import StarRating from '@/components/shared/StarRating';
import PriceDisplay from '@/components/shared/PriceDisplay';
import EnhancedModalMap from '@/components/search/EnhancedModalMap';

const CruiseDetails = () => {
  const { cruiseId } = useParams();
  const navigate = useNavigate();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isSaved, setIsSaved] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');
  const [showMap, setShowMap] = useState(false);
  
  const cruise = mockCruiseData.find(c => c.id === cruiseId);
  
  if (!cruise) {
    return (
      <div className="min-h-screen bg-light-gray">
        <Header />
        <div className="pt-16 p-8">
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

  // Enhanced cruise data structure with mock details
  const enhancedCruise = {
    ...cruise,
    shipYear: 2019,
    passengerCapacity: 2416,
    crewSize: 1200,
    grossTonnage: 90000,
    deckCount: 14,
    inclusions: [
      'All meals in main dining rooms',
      'Entertainment and shows',
      'Pool and deck activities', 
      'Kids club programs',
      'Fitness center access'
    ],
    exclusions: [
      'Specialty restaurant dining',
      'Alcoholic beverages',
      'Shore excursions',
      'Gratuities',
      'WiFi packages',
      'Spa services'
    ],
    detailedItinerary: [
      {
        day: 1,
        date: '2025-06-01',
        port: 'Miami, Florida',
        arrival: null,
        departure: '4:00 PM',
        description: 'Embarkation day - explore the vibrant city of Miami before setting sail.',
        highlights: ['Art Deco District', 'South Beach', 'Little Havana']
      },
      {
        day: 2,
        date: '2025-06-02',
        port: 'At Sea',
        arrival: null,
        departure: null,
        description: 'Enjoy a full day at sea with onboard activities and entertainment.',
        highlights: ['Pool activities', 'Live shows', 'Spa treatments', 'Deck parties']
      },
      {
        day: 3,
        date: '2025-06-03',
        port: 'Cozumel, Mexico',
        arrival: '8:00 AM',
        departure: '5:00 PM',
        description: 'Discover ancient Mayan ruins and pristine beaches in this tropical paradise.',
        highlights: ['Chankanaab Park', 'Mayan ruins', 'Snorkeling', 'Beach time']
      }
    ],
    cabinCategories: [
      {
        category: 'Interior',
        fromPrice: 599,
        size: '150-185 sq ft',
        occupancy: '2-4 guests',
        amenities: ['Twin beds convertible to queen', 'Private bathroom', 'Closet space', 'Safe']
      },
      {
        category: 'Ocean View',
        fromPrice: 799,
        size: '150-185 sq ft', 
        occupancy: '2-4 guests',
        amenities: ['Ocean view window', 'Twin beds convertible to queen', 'Private bathroom', 'Sitting area']
      },
      {
        category: 'Balcony',
        fromPrice: 1199,
        size: '185-205 sq ft',
        occupancy: '2-4 guests',
        amenities: ['Private balcony', 'Queen bed', 'Sitting area', 'Premium bathroom amenities']
      },
      {
        category: 'Suite',
        fromPrice: 2399,
        size: '350-1200 sq ft',
        occupancy: '2-6 guests',
        amenities: ['Separate living area', 'Priority boarding', 'Concierge service', 'Premium balcony']
      }
    ],
    diningOptions: [
      {
        name: 'Main Dining Room',
        type: 'Included',
        description: 'Multi-course dinners with rotating menus',
        hours: '6:00 PM - 9:30 PM'
      },
      {
        name: 'Specialty Steakhouse',
        type: 'Specialty ($45)',
        description: 'Premium cuts and fine dining experience',
        hours: '6:00 PM - 10:00 PM'
      },
      {
        name: 'Italian Trattoria',
        type: 'Specialty ($35)',
        description: 'Authentic Italian cuisine and wines',
        hours: '6:00 PM - 10:00 PM'
      }
    ],
    amenities: [
      { category: 'Pools & Recreation', items: ['Main pool deck', 'Adults-only solarium', 'Hot tubs', 'Mini golf'] },
      { category: 'Entertainment', items: ['Theater shows', 'Live music venues', 'Comedy club', 'Piano bar'] },
      { category: 'Dining', items: ['5 dining venues', 'Room service', 'Specialty coffee', 'Ice cream parlor'] },
      { category: 'Fitness & Wellness', items: ['Fitness center', 'Spa services', 'Jogging track', 'Rock climbing'] }
    ]
  };

  const handleBookNow = () => {
    navigate(`/cruise/${cruise.id}/book`);
  };

  return (
    <div className="min-h-screen bg-light-gray">
      <Header />
      
      {/* Hero Section */}
      <div className="pt-16">
        <div className="relative h-96 overflow-hidden">
          <img 
            src={cruise.images[currentImageIndex]} 
            alt={cruise.shipName}
            className="w-full h-full object-cover"
          />
          
          {/* Image Navigation */}
          {cruise.images.length > 1 && (
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
              {cruise.images.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentImageIndex(index)}
                  className={`w-3 h-3 rounded-full transition-colors ${
                    index === currentImageIndex ? 'bg-white' : 'bg-white/60'
                  }`}
                />
              ))}
            </div>
          )}
          
          {/* Overlay Content */}
          <div className="absolute inset-0 bg-black/30">
            <div className="max-w-7xl mx-auto px-4 h-full flex items-end pb-8">
              <div className="text-white">
                <h1 className="text-4xl font-bold mb-2">{cruise.shipName}</h1>
                <p className="text-xl mb-2">{cruise.cruiseLine}</p>
                <div className="flex items-center gap-4 mb-4">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-5 h-5" />
                    <span>{cruise.route}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="w-5 h-5" />
                    <span>{cruise.duration} nights</span>
                  </div>
                </div>
                <StarRating rating={cruise.rating} reviewCount={cruise.reviewCount} className="text-white" />
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="absolute top-4 right-4 flex gap-2">
            <Button
              size="icon"
              variant="secondary"
              className="bg-white/95 hover:bg-white"
              onClick={() => setIsSaved(!isSaved)}
            >
              <Heart className={`w-5 h-5 ${isSaved ? 'fill-coral-pink text-coral-pink' : 'text-charcoal'}`} />
            </Button>
            <Button
              size="icon"
              variant="secondary"
              className="bg-white/95 hover:bg-white"
            >
              <Share className="w-5 h-5 text-charcoal" />
            </Button>
          </div>

          {/* Back Button */}
          <div className="absolute top-4 left-4">
            <Button 
              variant="secondary"
              onClick={() => navigate(-1)}
              className="bg-white/95 hover:bg-white"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content Area */}
          <div className="lg:col-span-2">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-6 mb-6">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="itinerary">Itinerary</TabsTrigger>
                <TabsTrigger value="ship">Ship</TabsTrigger>
                <TabsTrigger value="staterooms">Staterooms</TabsTrigger>
                <TabsTrigger value="dining">Dining</TabsTrigger>
                <TabsTrigger value="reviews">Reviews</TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Cruise Highlights</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-ocean-blue">{enhancedCruise.duration}</div>
                        <div className="text-sm text-slate-gray">Nights</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-ocean-blue">{enhancedCruise.passengerCapacity}</div>
                        <div className="text-sm text-slate-gray">Passengers</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-ocean-blue">{enhancedCruise.shipYear}</div>
                        <div className="text-sm text-slate-gray">Built</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-ocean-blue">{enhancedCruise.deckCount}</div>
                        <div className="text-sm text-slate-gray">Decks</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>What's Included</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <h4 className="font-semibold text-green-600 mb-3">✓ Included</h4>
                        <ul className="space-y-2">
                          {enhancedCruise.inclusions.map((item, index) => (
                            <li key={index} className="flex items-start gap-2 text-sm">
                              <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                              {item}
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <h4 className="font-semibold text-slate-gray mb-3">Extra Cost</h4>
                        <ul className="space-y-2">
                          {enhancedCruise.exclusions.map((item, index) => (
                            <li key={index} className="flex items-start gap-2 text-sm text-slate-gray">
                              <div className="w-2 h-2 bg-slate-400 rounded-full mt-2 flex-shrink-0"></div>
                              {item}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      Route Map
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => setShowMap(true)}
                      >
                        <MapPin className="w-4 h-4 mr-2" />
                        View Full Map
                      </Button>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="bg-blue-50 rounded-lg p-6 text-center">
                      <MapPin className="w-12 h-12 mx-auto mb-4 text-ocean-blue" />
                      <p className="text-slate-gray">Interactive route map showing all ports of call</p>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="itinerary" className="space-y-4">
                {enhancedCruise.detailedItinerary.map((day, index) => (
                  <Card key={index}>
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-lg">Day {day.day} - {day.port}</CardTitle>
                        <Badge variant="outline">{day.date}</Badge>
                      </div>
                      {(day.arrival || day.departure) && (
                        <CardDescription className="flex items-center gap-4">
                          {day.arrival && (
                            <span className="flex items-center gap-1">
                              <Clock className="w-4 h-4" />
                              Arrive: {day.arrival}
                            </span>
                          )}
                          {day.departure && (
                            <span className="flex items-center gap-1">
                              <Clock className="w-4 h-4" />
                              Depart: {day.departure}
                            </span>
                          )}
                        </CardDescription>
                      )}
                    </CardHeader>
                    <CardContent>
                      <p className="mb-4">{day.description}</p>
                      <div className="flex flex-wrap gap-2">
                        {day.highlights.map((highlight, idx) => (
                          <Badge key={idx} variant="secondary">{highlight}</Badge>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </TabsContent>

              <TabsContent value="ship" className="space-y-6">
                {enhancedCruise.amenities.map((category, index) => (
                  <Card key={index}>
                    <CardHeader>
                      <CardTitle>{category.category}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                        {category.items.map((item, idx) => (
                          <div key={idx} className="flex items-center gap-2 p-3 bg-light-gray rounded-lg">
                            <div className="w-2 h-2 bg-ocean-blue rounded-full"></div>
                            <span className="text-sm">{item}</span>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </TabsContent>

              <TabsContent value="staterooms" className="space-y-4">
                {enhancedCruise.cabinCategories.map((cabin, index) => (
                  <Card key={index}>
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <CardTitle>{cabin.category}</CardTitle>
                        <PriceDisplay 
                          price={cabin.fromPrice} 
                          duration={cruise.duration}
                          className="text-right"
                        />
                      </div>
                      <CardDescription>
                        {cabin.size} • Up to {cabin.occupancy}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                        {cabin.amenities.map((amenity, idx) => (
                          <div key={idx} className="flex items-center gap-2 text-sm">
                            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                            {amenity}
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </TabsContent>

              <TabsContent value="dining" className="space-y-4">
                {enhancedCruise.diningOptions.map((dining, index) => (
                  <Card key={index}>
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <CardTitle className="flex items-center gap-2">
                          <Utensils className="w-5 h-5" />
                          {dining.name}
                        </CardTitle>
                        <Badge variant={dining.type.includes('Included') ? 'default' : 'secondary'}>
                          {dining.type}
                        </Badge>
                      </div>
                      <CardDescription>{dining.hours}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p>{dining.description}</p>
                    </CardContent>
                  </Card>
                ))}
              </TabsContent>

              <TabsContent value="reviews" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Guest Reviews</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center mb-6">
                      <div className="text-3xl font-bold text-ocean-blue mb-2">{cruise.rating}</div>
                      <StarRating rating={cruise.rating} reviewCount={cruise.reviewCount} className="justify-center" />
                      <p className="text-slate-gray mt-2">Based on {cruise.reviewCount} verified reviews</p>
                    </div>
                    
                    <div className="space-y-4">
                      <div className="p-4 bg-light-gray rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <div className="w-8 h-8 bg-ocean-blue rounded-full flex items-center justify-center text-white text-sm">J</div>
                            <span className="font-medium">John D.</span>
                          </div>
                          <StarRating rating={5} />
                        </div>
                        <p className="text-slate-gray">"Amazing cruise experience! The ship was beautiful and the staff was incredibly friendly. Would definitely book again."</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Pricing Card */}
            <Card className="sticky top-4">
              <CardHeader>
                <CardTitle>Book This Cruise</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-center">
                  <PriceDisplay 
                    price={cruise.priceFrom} 
                    duration={cruise.duration}
                    className="text-center"
                  />
                </div>
                
                <div className="space-y-3">
                  <Button 
                    className="w-full bg-ocean-blue hover:bg-deep-navy text-white"
                    onClick={handleBookNow}
                  >
                    Book Now
                  </Button>
                  <Button 
                    variant="outline" 
                    className="w-full"
                    onClick={() => setIsSaved(!isSaved)}
                  >
                    <Heart className={`w-4 h-4 mr-2 ${isSaved ? 'fill-coral-pink text-coral-pink' : ''}`} />
                    {isSaved ? 'Saved' : 'Save to Wishlist'}
                  </Button>
                </div>

                <div className="pt-4 border-t text-sm text-slate-gray space-y-2">
                  <div className="flex items-center gap-2">
                    <Wifi className="w-4 h-4" />
                    <span>Free WiFi available for purchase</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Car className="w-4 h-4" />
                    <span>Parking available at port</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4" />
                    <span>All ages welcome</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Similar Cruises */}
            <Card>
              <CardHeader>
                <CardTitle>Similar Cruises</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {mockCruiseData.slice(0, 2).filter(c => c.id !== cruise.id).map((similarCruise) => (
                  <div 
                    key={similarCruise.id} 
                    className="flex gap-3 p-3 bg-light-gray rounded-lg cursor-pointer hover:bg-border-gray transition-colors"
                    onClick={() => navigate(`/cruise/${similarCruise.id}`)}
                  >
                    <img 
                      src={similarCruise.images[0]} 
                      alt={similarCruise.shipName}
                      className="w-16 h-16 object-cover rounded"
                    />
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-sm truncate">{similarCruise.shipName}</h4>
                      <p className="text-xs text-slate-gray">{similarCruise.route}</p>
                      <div className="text-sm font-medium text-ocean-blue">
                        From ${similarCruise.priceFrom}
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Enhanced Modal Map */}
      {showMap && (
        <EnhancedModalMap
          isOpen={showMap}
          onClose={() => setShowMap(false)}
          cruises={[cruise]}
          selectedCruiseId={cruise.id}
        />
      )}
    </div>
  );
};

export default CruiseDetails;
