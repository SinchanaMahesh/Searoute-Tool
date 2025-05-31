
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { CruiseData } from '@/api/mockCruiseData';
import { Maximize2, X, Cloud, MapPin, Info, Shield, Utensils, Camera } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface LeafletSearchMapProps {
  cruises: CruiseData[];
  hoveredCruise: string | null;
  selectedCruise?: string | null;
  onLocationClick?: (locationName: string, insights: any) => void;
}

interface LocationInsights {
  name: string;
  weather: {
    condition: string;
    temperature: string;
    humidity: string;
  };
  places: string[];
  advisory: string[];
  crimes: string[];
  dishes: string[];
  attractions: string[];
  safetyRating: number;
}

// Extend Leaflet types for custom properties
declare global {
  interface Window {
    L: any;
  }
}

const LeafletSearchMap = ({ cruises, hoveredCruise, selectedCruise, onLocationClick }: LeafletSearchMapProps) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLeafletLoaded, setIsLeafletLoaded] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState<LocationInsights | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const mapRef = useRef<any>(null);
  const modalMapRef = useRef<any>(null);
  const drawnLayersRef = useRef<any>(null);
  const modalDrawnLayersRef = useRef<any>(null);
  
  // Use selectedCruise as primary, fallback to first cruise if none selected
  const displayCruise = selectedCruise 
    ? cruises.find(c => c.id === selectedCruise)
    : cruises.length > 0 ? cruises[0] : null;

  // Mock location insights data (simulating API calls)
  const getLocationInsights = useCallback(async (locationName: string): Promise<LocationInsights> => {
    setIsLoading(true);
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const mockInsights: Record<string, LocationInsights> = {
      'Miami': {
        name: 'Miami, Florida',
        weather: {
          condition: 'Sunny',
          temperature: '82°F (28°C)',
          humidity: '65%'
        },
        places: ['South Beach', 'Art Deco District', 'Wynwood Walls', 'Vizcaya Museum', 'Little Havana'],
        advisory: ['Use sunscreen', 'Stay hydrated', 'Hurricane season: June-November'],
        crimes: ['Petty theft in tourist areas', 'Car break-ins', 'Pickpocketing'],
        dishes: ['Cuban Sandwich', 'Stone Crab', 'Key Lime Pie', 'Ceviche', 'Arroz con Pollo'],
        attractions: ['Everglades National Park', 'Coral Gables', 'Coconut Grove'],
        safetyRating: 7
      },
      'Nassau': {
        name: 'Nassau, Bahamas',
        weather: {
          condition: 'Partly Cloudy',
          temperature: '78°F (26°C)',
          humidity: '72%'
        },
        places: ['Paradise Island', 'Atlantis Resort', 'Cable Beach', 'Fort Charlotte', 'Queen\'s Staircase'],
        advisory: ['Drink bottled water', 'Respect local customs', 'Tip in USD'],
        crimes: ['Tourist-targeted scams', 'Bag snatching', 'Overcharging'],
        dishes: ['Conch Fritters', 'Rock Lobster', 'Johnnycake', 'Rum Cake', 'Cracked Conch'],
        attractions: ['Blue Lagoon Island', 'Ardastra Gardens', 'National Art Gallery'],
        safetyRating: 6
      },
      'St. Thomas': {
        name: 'St. Thomas, USVI',
        weather: {
          condition: 'Tropical',
          temperature: '85°F (29°C)',
          humidity: '68%'
        },
        places: ['Magens Bay', 'Coral World', 'Paradise Point', 'Blackbeard\'s Castle', 'Charlotte Amalie'],
        advisory: ['No passport needed for US citizens', 'Duty-free shopping', 'Steep hills - wear good shoes'],
        crimes: ['Rare violent crime', 'Occasional theft from beaches', 'Traffic accidents on mountain roads'],
        dishes: ['Kallaloo', 'Johnny Cakes', 'Saltfish', 'Fungi', 'Maubi'],
        attractions: ['Skyride to Paradise Point', 'Coral World Ocean Park', 'Mountaintop'],
        safetyRating: 8
      },
      'Barbados': {
        name: 'Barbados',
        weather: {
          condition: 'Warm & Breezy',
          temperature: '80°F (27°C)',
          humidity: '70%'
        },
        places: ['Harrison\'s Cave', 'Animal Flower Cave', 'Bathsheba Beach', 'Bridgetown', 'St. Nicholas Abbey'],
        advisory: ['UV protection essential', 'Ocean currents can be strong', 'Respect marine life'],
        crimes: ['Generally very safe', 'Minor theft possible', 'Beach scams rare'],
        dishes: ['Flying Fish', 'Cou-Cou', 'Macaroni Pie', 'Rum Punch', 'Bajan Black Cake'],
        attractions: ['Mount Gay Rum Distillery', 'Barbados Wildlife Reserve', 'Flower Forest'],
        safetyRating: 9
      },
      'Kingston, Jamaica': {
        name: 'Kingston, Jamaica',
        weather: {
          condition: 'Hot & Humid',
          temperature: '86°F (30°C)',
          humidity: '75%'
        },
        places: ['Bob Marley Museum', 'Devon House', 'Blue Mountains', 'Port Royal', 'National Gallery'],
        advisory: ['Stay in tourist areas', 'Use reputable tour guides', 'Avoid displaying valuables'],
        crimes: ['Higher crime rates in some areas', 'Tourist areas generally safe', 'Petty theft possible'],
        dishes: ['Jerk Chicken', 'Ackee and Saltfish', 'Curry Goat', 'Patties', 'Blue Mountain Coffee'],
        attractions: ['Dunn\'s River Falls', 'Martha Brae River', 'Mystic Mountain'],
        safetyRating: 5
      },
      'Cozumel, Mexico': {
        name: 'Cozumel, Mexico',
        weather: {
          condition: 'Tropical Paradise',
          temperature: '84°F (29°C)',
          humidity: '73%'
        },
        places: ['Chankanaab Park', 'San Gervasio Ruins', 'Paradise Beach', 'Punta Sur', 'Downtown San Miguel'],
        advisory: ['Drink bottled water', 'Use reef-safe sunscreen', 'Respect Mayan heritage sites'],
        crimes: ['Very safe for tourists', 'Minor overcharging possible', 'Avoid isolated areas at night'],
        dishes: ['Cochinita Pibil', 'Fish Tacos', 'Mole', 'Margaritas', 'Tres Leches Cake'],
        attractions: ['Mesoamerican Reef', 'Palancar Reef', 'El Cielo Starfish Point'],
        safetyRating: 8
      }
    };
    
    setIsLoading(false);
    return mockInsights[locationName] || {
      name: locationName,
      weather: { condition: 'Sunny', temperature: '75°F', humidity: '60%' },
      places: ['Explore the local area'],
      advisory: ['Stay safe and enjoy'],
      crimes: ['General caution advised'],
      dishes: ['Local cuisine'],
      attractions: ['Beautiful scenery'],
      safetyRating: 7
    };
  }, []);

  // Load saved routes from localStorage
  const loadSavedRoutes = useCallback(() => {
    const saved = localStorage.getItem('sea_routes');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (error) {
        console.error('Error loading saved routes:', error);
        return [];
      }
    }
    return [];
  }, []);

  // Draw route on map
  const drawRouteOnMap = useCallback((map: any, cruise: CruiseData, drawnLayers: any) => {
    if (!map || !cruise || !window.L) return;

    const L = window.L;
    
    // Clear existing layers
    drawnLayers.clearLayers();

    // Check if we have a saved route for this cruise
    const savedRoutes = loadSavedRoutes();
    const originPort = cruise.ports[0];
    const destinationPort = cruise.ports[cruise.ports.length - 1];
    
    if (originPort && destinationPort) {
      const routeKey = `port_${originPort.name.toLowerCase().replace(/[^a-z0-9]/g, '_')}-port_${destinationPort.name.toLowerCase().replace(/[^a-z0-9]/g, '_')}`;
      const savedRoute = savedRoutes.find((route: any) => route.id === routeKey);
      
      if (savedRoute && savedRoute.polyline) {
        // Use saved route
        const polyline = L.polyline(savedRoute.polyline, {
          color: '#ff6b35',
          weight: 3,
          opacity: 0.8
        });
        drawnLayers.addLayer(polyline);
      } else {
        // Fallback: draw simple connecting lines between ports
        const routeCoords = cruise.ports.map(port => [port.coordinates[1], port.coordinates[0]]);
        const polyline = L.polyline(routeCoords, {
          color: '#ff6b35',
          weight: 3,
          opacity: 0.8
        });
        drawnLayers.addLayer(polyline);
      }
    }

    // Add port markers
    cruise.ports.forEach((port, index) => {
      const color = index === 0 ? 'green' : (index === cruise.ports.length - 1 ? 'red' : 'blue');
      
      const portIcon = new L.Icon({
        iconUrl: `https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-${color}.png`,
        iconSize: [25, 41],
        iconAnchor: [12, 41],
        popupAnchor: [1, -34],
        shadowSize: [41, 41]
      });

      const marker = L.marker([port.coordinates[1], port.coordinates[0]], { icon: portIcon })
        .addTo(map)
        .bindPopup(`<b>${port.name}</b><br>Click for location insights`);
      
      // Add click handler for location insights
      marker.on('click', async () => {
        const insights = await getLocationInsights(port.name);
        setSelectedLocation(insights);
        if (onLocationClick) {
          onLocationClick(port.name, insights);
        }
      });
    });

    // Fit map to show all ports
    if (cruise.ports.length > 0) {
      try {
        const allPoints = cruise.ports.map(p => [p.coordinates[1], p.coordinates[0]]);
        const bounds = L.latLngBounds(allPoints);
        map.fitBounds(bounds.pad(0.1));
      } catch (error) {
        console.error('Error fitting bounds:', error);
        map.setView([25.0, -80.0], 6);
      }
    }
  }, [onLocationClick, loadSavedRoutes, getLocationInsights]);

  // Leaflet initialization
  useEffect(() => {
    // Load Leaflet CSS
    const leafletLink = document.createElement('link');
    leafletLink.rel = 'stylesheet';
    leafletLink.href = 'https://unpkg.com/leaflet@1.7.1/dist/leaflet.css';
    document.head.appendChild(leafletLink);

    // Load Leaflet JS
    const leafletScript = document.createElement('script');
    leafletScript.src = 'https://unpkg.com/leaflet@1.7.1/dist/leaflet.js';
    leafletScript.onload = () => {
      setIsLeafletLoaded(true);
    };
    leafletScript.onerror = (e) => {
      console.error('Failed to load Leaflet script:', e);
    };
    document.body.appendChild(leafletScript);

    return () => {
      if (document.head.contains(leafletLink)) {
        document.head.removeChild(leafletLink);
      }
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
      if (modalMapRef.current) {
        modalMapRef.current.remove();
        modalMapRef.current = null;
      }
    };
  }, []);

  // Initialize small map
  useEffect(() => {
    if (!isLeafletLoaded || !window.L || !displayCruise) return;

    const L = window.L;

    // Fix for default marker icon issue
    if (L.Icon && L.Icon.Default && L.Icon.Default.prototype) {
      const DefaultIcon = L.Icon.Default.prototype as any;
      if (DefaultIcon._getIconUrl) {
        delete DefaultIcon._getIconUrl;
      }
      
      L.Icon.Default.mergeOptions({
        iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
        iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
        shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
      });
    }

    // Initialize the small map
    if (!mapRef.current) {
      const map = L.map('search-route-map').setView([25.0, -80.0], 6);

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      }).addTo(map);

      mapRef.current = map;
      drawnLayersRef.current = new L.FeatureGroup().addTo(map);
    }

    // Draw the route and set initial location
    drawRouteOnMap(mapRef.current, displayCruise, drawnLayersRef.current);
    
    // Set initial location insights
    if (displayCruise.ports.length > 0 && !selectedLocation) {
      getLocationInsights(displayCruise.ports[0].name).then(setSelectedLocation);
    }

  }, [isLeafletLoaded, displayCruise, drawRouteOnMap, selectedLocation, getLocationInsights]);

  // Initialize modal map when opened
  useEffect(() => {
    if (!isModalOpen || !isLeafletLoaded || !window.L || !displayCruise) return;

    const L = window.L;

    // Initialize the modal map
    if (!modalMapRef.current) {
      const map = L.map('modal-route-map').setView([25.0, -80.0], 6);

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      }).addTo(map);

      modalMapRef.current = map;
      modalDrawnLayersRef.current = new L.FeatureGroup().addTo(map);
    }

    // Draw the route on modal map
    drawRouteOnMap(modalMapRef.current, displayCruise, modalDrawnLayersRef.current);

  }, [isModalOpen, isLeafletLoaded, displayCruise, drawRouteOnMap]);

  // Handle escape key for modal
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isModalOpen) {
        setIsModalOpen(false);
      }
    };

    if (isModalOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
      return () => {
        document.removeEventListener('keydown', handleEscape);
        document.body.style.overflow = 'unset';
      };
    }
  }, [isModalOpen]);

  return (
    <>
      <div className="h-full bg-gradient-to-br from-blue-50 to-blue-100 relative overflow-hidden">
        {/* Compact Map Header */}
        <div className="absolute top-0 left-0 right-0 bg-white/95 backdrop-blur-sm p-2 border-b border-border-gray z-20">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-medium text-charcoal text-xs">Cruise Routes</h3>
              <p className="text-xs text-slate-gray">
                {displayCruise 
                  ? `${displayCruise.shipName}` 
                  : 'Hover over a cruise to see its route'}
              </p>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsModalOpen(true)}
              className="text-ocean-blue border-ocean-blue hover:bg-ocean-blue hover:text-white h-6 w-6 p-0"
            >
              <Maximize2 className="w-3 h-3" />
            </Button>
          </div>
        </div>

        {/* Map Container */}
        <div 
          id="search-route-map" 
          className="absolute inset-0 pt-12 w-full h-full bg-gray-200 flex items-center justify-center text-gray-500"
          style={{ marginTop: '48px', height: 'calc(100% - 48px)' }}
        >
          {!isLeafletLoaded && (
            <div className="flex flex-col items-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-ocean-blue"></div>
              <p className="mt-2 text-sm">Loading map...</p>
            </div>
          )}
        </div>
      </div>

      {/* Enhanced Modal with Location Insights - Fixed z-index using createPortal pattern */}
      {isModalOpen && (
        <div 
          className="fixed inset-0"
          style={{ 
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            zIndex: 999999,
            isolation: 'isolate'
          }}
        >
          {/* Backdrop */}
          <div 
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setIsModalOpen(false)}
            style={{ 
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: 'rgba(0, 0, 0, 0.6)',
              backdropFilter: 'blur(4px)'
            }}
          />
          
          {/* Modal content container */}
          <div 
            className="absolute inset-0 flex items-center justify-center p-4"
            style={{ 
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '1rem',
              zIndex: 1000000
            }}
          >
            <div 
              className="bg-white rounded-lg w-full h-full max-w-7xl max-h-[95vh] flex flex-col relative shadow-2xl"
              style={{
                backgroundColor: 'white',
                borderRadius: '0.5rem',
                width: '100%',
                height: '100%',
                maxWidth: '80rem',
                maxHeight: '95vh',
                display: 'flex',
                flexDirection: 'column',
                position: 'relative',
                boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
                zIndex: 1000001
              }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div 
                className="p-4 border-b border-border-gray flex justify-between items-center bg-white relative"
                style={{ 
                  backgroundColor: 'white',
                  borderBottom: '1px solid #e5e7eb',
                  zIndex: 1000002
                }}
              >
                <div>
                  <h3 className="font-semibold text-charcoal">Interactive Route Map</h3>
                  <p className="text-sm text-slate-gray mt-1">Click on ports to view detailed location insights</p>
                </div>
                <Button
                  variant="outline"
                  onClick={() => setIsModalOpen(false)}
                  className="text-slate-gray h-8 w-8 p-0"
                  style={{ zIndex: 1000003 }}
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
              
              {/* Two-pane content */}
              <div 
                className="flex-1 flex relative overflow-hidden bg-white"
                style={{ 
                  backgroundColor: 'white',
                  flex: 1,
                  display: 'flex',
                  position: 'relative',
                  overflow: 'hidden'
                }}
              >
                {/* Left Pane - Map */}
                <div 
                  className="flex-1 flex flex-col bg-white"
                  style={{ 
                    flex: 1,
                    display: 'flex',
                    flexDirection: 'column',
                    backgroundColor: 'white'
                  }}
                >
                  <div 
                    id="modal-route-map" 
                    className="w-full h-full bg-gray-200 flex items-center justify-center text-gray-500"
                    style={{ 
                      width: '100%', 
                      height: '100%',
                      backgroundColor: '#e5e7eb'
                    }}
                  >
                    {!isLeafletLoaded && (
                      <div className="flex flex-col items-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-ocean-blue"></div>
                        <p className="mt-4 text-lg">Loading detailed map...</p>
                      </div>
                    )}
                  </div>
                </div>
                
                {/* Right Pane - Location Information */}
                <div 
                  className="w-96 border-l border-border-gray bg-white flex flex-col"
                  style={{ 
                    width: '24rem',
                    borderLeft: '1px solid #e5e7eb',
                    backgroundColor: 'white',
                    display: 'flex',
                    flexDirection: 'column'
                  }}
                >
                  {isLoading ? (
                    <div className="flex-1 flex items-center justify-center bg-white">
                      <div className="text-slate-gray">Loading location insights...</div>
                    </div>
                  ) : selectedLocation ? (
                    <div className="flex-1 overflow-y-auto bg-white">
                      {/* Location Header */}
                      <div className="p-4 border-b border-border-gray">
                        <h4 className="font-semibold text-charcoal text-lg flex items-center gap-2">
                          <MapPin className="w-5 h-5 text-ocean-blue" />
                          {selectedLocation.name}
                        </h4>
                        <div className="flex items-center gap-4 mt-2 text-sm">
                          <div className="flex items-center gap-1">
                            <Cloud className="w-4 h-4 text-blue-500" />
                            <span>{selectedLocation.weather.condition}</span>
                          </div>
                          <span className="font-medium text-coral-pink">{selectedLocation.weather.temperature}</span>
                          <span className="text-slate-gray">Humidity: {selectedLocation.weather.humidity}</span>
                        </div>
                        {/* Safety Rating */}
                        <div className="flex items-center gap-2 mt-2">
                          <Shield className="w-4 h-4 text-green-500" />
                          <span className="text-sm font-medium">Safety Rating: </span>
                          <div className="flex">
                            {[...Array(10)].map((_, i) => (
                              <div
                                key={i}
                                className={`w-2 h-2 rounded-full mr-1 ${
                                  i < selectedLocation.safetyRating ? 'bg-green-500' : 'bg-gray-200'
                                }`}
                              />
                            ))}
                          </div>
                          <span className="text-sm text-slate-gray">({selectedLocation.safetyRating}/10)</span>
                        </div>
                      </div>
                      
                      {/* Places to Visit */}
                      <div className="p-4 border-b border-border-gray">
                        <h5 className="font-medium text-charcoal mb-2 flex items-center gap-2">
                          <Camera className="w-4 h-4 text-green-500" />
                          Places to Visit
                        </h5>
                        <ul className="space-y-1 text-sm text-slate-gray">
                          {selectedLocation.places.map((place, index) => (
                            <li key={index} className="flex items-center gap-2">
                              <div className="w-1 h-1 bg-ocean-blue rounded-full" />
                              {place}
                            </li>
                          ))}
                        </ul>
                      </div>
                      
                      {/* Local Dishes */}
                      <div className="p-4 border-b border-border-gray">
                        <h5 className="font-medium text-charcoal mb-2 flex items-center gap-2">
                          <Utensils className="w-4 h-4 text-orange-500" />
                          Local Dishes
                        </h5>
                        <ul className="space-y-1 text-sm text-slate-gray">
                          {selectedLocation.dishes.map((dish, index) => (
                            <li key={index} className="flex items-center gap-2">
                              <div className="w-1 h-1 bg-orange-500 rounded-full" />
                              {dish}
                            </li>
                          ))}
                        </ul>
                      </div>
                      
                      {/* Safety Advisory */}
                      <div className="p-4 border-b border-border-gray">
                        <h5 className="font-medium text-charcoal mb-2 flex items-center gap-2">
                          <Shield className="w-4 h-4 text-red-500" />
                          Safety & Advisory
                        </h5>
                        <ul className="space-y-1 text-sm text-slate-gray">
                          {selectedLocation.advisory.map((item, index) => (
                            <li key={index} className="flex items-center gap-2">
                              <div className="w-1 h-1 bg-blue-500 rounded-full" />
                              {item}
                            </li>
                          ))}
                        </ul>
                        <div className="mt-3">
                          <p className="text-xs font-medium text-red-600 mb-1">Crime Awareness:</p>
                          <ul className="space-y-1 text-xs text-slate-gray">
                            {selectedLocation.crimes.map((crime, index) => (
                              <li key={index} className="flex items-center gap-2">
                                <div className="w-1 h-1 bg-red-500 rounded-full" />
                                {crime}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                      
                      {/* Attractions */}
                      <div className="p-4">
                        <h5 className="font-medium text-charcoal mb-2 flex items-center gap-2">
                          <Info className="w-4 h-4 text-purple-500" />
                          Top Attractions
                        </h5>
                        <ul className="space-y-1 text-sm text-slate-gray">
                          {selectedLocation.attractions.map((attraction, index) => (
                            <li key={index} className="flex items-center gap-2">
                              <div className="w-1 h-1 bg-purple-500 rounded-full" />
                              {attraction}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  ) : (
                    <div className="flex-1 flex items-center justify-center bg-white">
                      <div className="text-slate-gray text-center">
                        <MapPin className="w-8 h-8 text-slate-gray mx-auto mb-2" />
                        Click on a port to view location insights
                      </div>
                    </div>
                  )}
                </div>
              </div>
              
              {/* Bottom Panel - Cruise Information */}
              {displayCruise && (
                <div 
                  className="border-t border-border-gray bg-light-gray p-4 relative"
                  style={{ 
                    borderTop: '1px solid #e5e7eb',
                    backgroundColor: '#f8fafc',
                    zIndex: 1000002
                  }}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h5 className="font-medium text-charcoal">{displayCruise.shipName}</h5>
                      <p className="text-sm text-slate-gray">{displayCruise.route} • {displayCruise.duration} days</p>
                      <div className="flex gap-2 mt-1">
                        {displayCruise.ports.map((port, index) => (
                          <button
                            key={index}
                            onClick={async () => {
                              const insights = await getLocationInsights(port.name);
                              setSelectedLocation(insights);
                            }}
                            className={`px-2 py-1 rounded-full text-xs font-medium transition-colors ${
                              selectedLocation?.name.includes(port.name)
                                ? 'bg-ocean-blue text-white'
                                : 'bg-white text-slate-gray hover:bg-ocean-blue hover:text-white'
                            }`}
                          >
                            {port.name}
                          </button>
                        ))}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-semibold text-ocean-blue">From ${displayCruise.priceFrom}</div>
                      <div className="text-xs text-slate-gray">per person</div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default LeafletSearchMap;
