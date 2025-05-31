
import React, { useState } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { ArrowLeft, Heart, Share, MapPin, Calendar, Users, Star, Clock, Wifi, Car, Utensils, Anchor, Activity, Coffee } from 'lucide-react';
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
  const [searchParams] = useSearchParams();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isSaved, setIsSaved] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');
  const [showMap, setShowMap] = useState(false);
  const [selectedCabinCategory, setSelectedCabinCategory] = useState('Interior');
  
  // Extract search context
  const sailDate = searchParams.get('sailDate');
  const guests = searchParams.get('guests') || '2';
  const cabins = searchParams.get('cabins') || '1';
  
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
      'Fitness center access',
      'Basic WiFi'
    ],
    exclusions: [
      'Specialty restaurant dining',
      'Premium alcoholic beverages',
      'Shore excursions',
      'Gratuities',
      'Premium WiFi packages',
      'Spa services'
    ],
    detailedItinerary: [
      {
        day: 1,
        date: sailDate || '2025-06-01',
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
        adjustedPrice: 599 + (parseInt(guests) - 2) * 150,
        size: '150-185 sq ft',
        occupancy: '2-4 guests',
        amenities: ['Twin beds convertible to queen', 'Private bathroom', 'Closet space', 'Safe'],
        available: 12
      },
      {
        category: 'Ocean View',
        fromPrice: 799,
        adjustedPrice: 799 + (parseInt(guests) - 2) * 200,
        size: '150-185 sq ft', 
        occupancy: '2-4 guests',
        amenities: ['Ocean view window', 'Twin beds convertible to queen', 'Private bathroom', 'Sitting area'],
        available: 8
      },
      {
        category: 'Balcony',
        fromPrice: 1199,
        adjustedPrice: 1199 + (parseInt(guests) - 2) * 300,
        size: '185-205 sq ft',
        occupancy: '2-4 guests',
        amenities: ['Private balcony', 'Queen bed', 'Sitting area', 'Premium bathroom amenities'],
        available: 5
      },
      {
        category: 'Suite',
        fromPrice: 2399,
        adjustedPrice: 2399 + (parseInt(guests) - 2) * 500,
        size: '350-1200 sq ft',
        occupancy: '2-6 guests',
        amenities: ['Separate living area', 'Priority boarding', 'Concierge service', 'Premium balcony'],
        available: 2
      }
    ],
    diningOptions: [
      {
        name: 'Main Dining Room',
        type: 'Included',
        description: 'Multi-course dinners with rotating menus featuring international cuisine',
        hours: '6:00 PM - 9:30 PM',
        image: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=300'
      },
      {
        name: 'Specialty Steakhouse',
        type: 'Specialty ($45)',
        description: 'Premium cuts and fine dining experience with wine pairings',
        hours: '6:00 PM - 10:00 PM',
        image: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=300'
      },
      {
        name: 'Italian Trattoria',
        type: 'Specialty ($35)',
        description: 'Authentic Italian cuisine with fresh pasta and regional wines',
        hours: '6:00 PM - 10:00 PM',
        image: 'https://images.unsplash.com/photo-1551218808-94e220e084d2?w=300'
      }
    ],
    amenities: [
      { category: 'Entertainment', items: ['Theater shows', 'Live music venues', 'Comedy club', 'Casino'], icon: Activity },
      { category: 'Dining', items: ['5 dining venues', '24/7 room service', 'Specialty coffee', 'Ice cream parlor'], icon: Utensils },
      { category: 'Recreation', items: ['Main pool deck', 'Adults-only solarium', 'Hot tubs', 'Mini golf'], icon: Anchor },
      { category: 'Wellness', items: ['Fitness center', 'Spa services', 'Jogging track', 'Rock climbing'], icon: Coffee }
    ]
  };

  const selectedCabin = enhancedCruise.cabinCategories.find(c => c.category === selectedCabinCategory);

  const handleBookNow = () => {
    const bookingParams = new URLSearchParams();
    bookingParams.set('sailDate', sailDate || cruise.departureDate);
    bookingParams.set('guests', guests);
    bookingParams.set('cabins', cabins);
    bookingParams.set('cabinCategory', selectedCabinCategory);
    navigate(`/cruise/${cruise.id}/book?${bookingParams.toString()}`);
  };

  return (
    <div className="min-h-screen bg-light-gray">
      <Header />
      
      {/* Enhanced Hero Section */}
      <div className="pt-16">
        <div className="relative h-[500px] overflow-hidden">
          <img 
            src={cruise.images[currentImageIndex]} 
            alt={cruise.shipName}
            className="w-full h-full object-cover"
          />
          
          {/* Enhanced Image Navigation */}
          {cruise.images.length > 1 && (
            <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex space-x-3">
              {cruise.images.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentImageIndex(index)}
                  className={`w-4 h-4 rounded-full transition-colors ${
                    index === currentImageIndex ? 'bg-white shadow-lg' : 'bg-white/60'
                  }`}
                />
              ))}
            </div>
          )}
          
          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent">
            <div className="max-w-7xl mx-auto px-6 h-full flex items-end pb-12">
              <div className="text-white max-w-2xl">
                <h1 className="text-5xl font-bold mb-3">{cruise.shipName}</h1>
                <p className="text-2xl mb-4 opacity-90">{cruise.cruiseLine}</p>
                <div className="flex items-center gap-6 mb-6">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-6 h-6" />
                    <span className="text-lg">{cruise.route}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="w-6 h-6" />
                    <span className="text-lg">{cruise.duration} nights</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users className="w-6 h-6" />
                    <span className="text-lg">{guests} guests</span>
                  </div>
                </div>
                <StarRating rating={cruise.rating} reviewCount={cruise.reviewCount} className="text-white text-lg" />
              </div>
            </div>
          </div>

          {/* Enhanced Quick Actions */}
          <div className="absolute top-6 right-6 flex gap-3">
            <Button
              size="icon"
              variant="secondary"
              className="w-12 h-12 bg-white/95 hover:bg-white shadow-lg"
              onClick={() => setIsSaved(!isSaved)}
            >
              <Heart className={`w-6 h-6 ${isSaved ? 'fill-coral-pink text-coral-pink' : 'text-charcoal'}`} />
            </Button>
            <Button
              size="icon"
              variant="secondary"
              className="w-12 h-12 bg-white/95 hover:bg-white shadow-lg"
            >
              <Share className="w-6 h-6 text-charcoal" />
            </Button>
          </div>

          {/* Enhanced Back Button */}
          <div className="absolute top-6 left-6">
            <Button 
              variant="secondary"
              onClick={() => navigate(-1)}
              className="bg-white/95 hover:bg-white shadow-lg px-4 py-2"
            >
              <ArrowLeft className="w-5 h-5 mr-2" />
              Back to Search
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content Area */}
          <div className="lg:col-span-2">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-4 mb-8 h-14">
                <TabsTrigger value="overview" className="text-sm font-medium">Overview</TabsTrigger>
                <TabsTrigger value="itinerary" className="text-sm font-medium">Itinerary & Ports</TabsTrigger>
                <TabsTrigger value="ship" className="text-sm font-medium">Ship & Dining</TabsTrigger>
                <TabsTrigger value="staterooms" className="text-sm font-medium">Staterooms & Pricing</TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="space-y-8">
                {/* Ship Stats */}
                <Card className="overflow-hidden">
                  <CardHeader className="bg-gradient-to-r from-ocean-blue to-deep-navy text-white">
                    <CardTitle className="text-2xl">Ship Highlights</CardTitle>
                  </CardHeader>
                  <CardContent className="p-6">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                      <div className="text-center">
                        <div className="text-3xl font-bold text-ocean-blue mb-1">{enhancedCruise.duration}</div>
                        <div className="text-sm text-slate-gray">Nights</div>
                      </div>
                      <div className="text-center">
                        <div className="text-3xl font-bold text-ocean-blue mb-1">{enhancedCruise.passengerCapacity}</div>
                        <div className="text-sm text-slate-gray">Passengers</div>
                      </div>
                      <div className="text-center">
                        <div className="text-3xl font-bold text-ocean-blue mb-1">{enhancedCruise.shipYear}</div>
                        <div className="text-sm text-slate-gray">Built</div>
                      </div>
                      <div className="text-center">
                        <div className="text-3xl font-bold text-ocean-blue mb-1">{enhancedCruise.deckCount}</div>
                        <div className="text-sm text-slate-gray">Decks</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* What's Included */}
                <div className="grid md:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-green-600 flex items-center gap-2">
                        ✓ What's Included
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-3">
                        {enhancedCruise.inclusions.map((item, index) => (
                          <li key={index} className="flex items-start gap-3">
                            <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                            <span className="text-sm">{item}</span>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="text-slate-gray flex items-center gap-2">
                        Extra Cost Items
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-3">
                        {enhancedCruise.exclusions.map((item, index) => (
                          <li key={index} className="flex items-start gap-3">
                            <div className="w-2 h-2 bg-slate-400 rounded-full mt-2 flex-shrink-0"></div>
                            <span className="text-sm text-slate-gray">{item}</span>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                </div>

                {/* Route Map */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      Interactive Route Map
                      <Button 
                        variant="outline" 
                        onClick={() => setShowMap(true)}
                      >
                        <MapPin className="w-4 h-4 mr-2" />
                        View Full Map
                      </Button>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl p-8 text-center">
                      <MapPin className="w-16 h-16 mx-auto mb-4 text-ocean-blue" />
                      <h3 className="text-lg font-semibold text-charcoal mb-2">Explore Your Route</h3>
                      <p className="text-slate-gray">Interactive map showing all ports of call with local insights</p>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="itinerary" className="space-y-6">
                {enhancedCruise.detailedItinerary.map((day, index) => (
                  <Card key={index} className="overflow-hidden">
                    <CardHeader className="bg-light-gray">
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-xl">Day {day.day} - {day.port}</CardTitle>
                        <Badge variant="outline" className="text-sm">{day.date}</Badge>
                      </div>
                      {(day.arrival || day.departure) && (
                        <CardDescription className="flex items-center gap-6 text-base">
                          {day.arrival && (
                            <span className="flex items-center gap-2">
                              <Clock className="w-4 h-4" />
                              Arrive: {day.arrival}
                            </span>
                          )}
                          {day.departure && (
                            <span className="flex items-center gap-2">
                              <Clock className="w-4 h-4" />
                              Depart: {day.departure}
                            </span>
                          )}
                        </CardDescription>
                      )}
                    </CardHeader>
                    <CardContent className="p-6">
                      <p className="text-base mb-4">{day.description}</p>
                      <div className="flex flex-wrap gap-2">
                        {day.highlights.map((highlight, idx) => (
                          <Badge key={idx} variant="secondary" className="text-sm">{highlight}</Badge>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </TabsContent>

              <TabsContent value="ship" className="space-y-8">
                {/* Ship Amenities */}
                <div className="grid md:grid-cols-2 gap-6">
                  {enhancedCruise.amenities.map((category, index) => {
                    const IconComponent = category.icon;
                    return (
                      <Card key={index}>
                        <CardHeader>
                          <CardTitle className="flex items-center gap-3">
                            <IconComponent className="w-6 h-6 text-ocean-blue" />
                            {category.category}
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="grid grid-cols-1 gap-3">
                            {category.items.map((item, idx) => (
                              <div key={idx} className="flex items-center gap-3 p-3 bg-light-gray rounded-lg">
                                <div className="w-2 h-2 bg-ocean-blue rounded-full"></div>
                                <span>{item}</span>
                              </div>
                            ))}
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>

                {/* Dining Options */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-2xl">Dining Options</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid md:grid-cols-3 gap-6">
                      {enhancedCruise.diningOptions.map((dining, index) => (
                        <div key={index} className="border border-border-gray rounded-lg overflow-hidden">
                          <img 
                            src={dining.image} 
                            alt={dining.name}
                            className="w-full h-40 object-cover"
                          />
                          <div className="p-4">
                            <div className="flex items-center justify-between mb-2">
                              <h4 className="font-semibold">{dining.name}</h4>
                              <Badge variant={dining.type.includes('Included') ? 'default' : 'secondary'}>
                                {dining.type}
                              </Badge>
                            </div>
                            <p className="text-sm text-slate-gray mb-2">{dining.hours}</p>
                            <p className="text-sm">{dining.description}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="staterooms" className="space-y-6">
                <div className="grid gap-6">
                  {enhancedCruise.cabinCategories.map((cabin, index) => (
                    <Card 
                      key={index} 
                      className={`cursor-pointer transition-all ${
                        selectedCabinCategory === cabin.category ? 'ring-2 ring-ocean-blue shadow-lg' : ''
                      }`}
                      onClick={() => setSelectedCabinCategory(cabin.category)}
                    >
                      <CardHeader>
                        <div className="flex items-center justify-between">
                          <div>
                            <CardTitle className="text-xl">{cabin.category}</CardTitle>
                            <CardDescription className="text-base">
                              {cabin.size} • Up to {cabin.occupancy}
                            </CardDescription>
                          </div>
                          <div className="text-right">
                            <div className="text-2xl font-bold text-ocean-blue">
                              ${cabin.adjustedPrice.toLocaleString()}
                            </div>
                            <div className="text-sm text-slate-gray">
                              ${Math.round(cabin.adjustedPrice / cruise.duration)} per night
                            </div>
                            <div className="text-xs text-green-600">
                              {cabin.available} rooms available
                            </div>
                          </div>
                        </div>
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
                </div>
              </TabsContent>
            </Tabs>
          </div>

          {/* Enhanced Sticky Sidebar */}
          <div className="space-y-6">
            <Card className="sticky top-24">
              <CardHeader>
                <CardTitle>Complete Your Booking</CardTitle>
                <CardDescription>
                  Sailing {sailDate || cruise.departureDate} • {guests} guests • {cabins} cabin(s)
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="text-center bg-gradient-to-r from-ocean-blue/10 to-deep-navy/10 rounded-lg p-4">
                  <div className="text-sm text-slate-gray mb-1">Total Price for {selectedCabinCategory}</div>
                  <div className="text-3xl font-bold text-ocean-blue">
                    ${(selectedCabin?.adjustedPrice || cruise.priceFrom).toLocaleString()}
                  </div>
                  <div className="text-sm text-slate-gray">
                    ${Math.round((selectedCabin?.adjustedPrice || cruise.priceFrom) / cruise.duration)} per night
                  </div>
                </div>
                
                <div className="space-y-3">
                  <Button 
                    className="w-full bg-ocean-blue hover:bg-deep-navy text-white py-3 text-lg"
                    onClick={handleBookNow}
                  >
                    Book Now - ${(selectedCabin?.adjustedPrice || cruise.priceFrom).toLocaleString()}
                  </Button>
                  <Button 
                    variant="outline" 
                    className="w-full py-3"
                    onClick={() => setIsSaved(!isSaved)}
                  >
                    <Heart className={`w-4 h-4 mr-2 ${isSaved ? 'fill-coral-pink text-coral-pink' : ''}`} />
                    {isSaved ? 'Saved to Wishlist' : 'Save to Wishlist'}
                  </Button>
                </div>

                <div className="pt-4 border-t text-sm text-slate-gray space-y-3">
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
          </div>
        </div>
      </div>

      {/* Enhanced Modal Map */}
      {showMap && (
        <EnhancedModalMap
          isOpen={showMap}
          onClose={() => setShowMap(false)}
          cruises={[cruise]}
          selectedCruise={cruise.id}
        />
      )}
    </div>
  );
};

export default CruiseDetails;
