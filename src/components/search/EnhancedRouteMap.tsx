
import React, { useEffect, useRef, useState } from 'react';
import { CruiseData } from '@/api/mockCruiseData';
import { Maximize2, X, Cloud, MapPin, Info } from 'lucide-react';
import { Button } from '@/components/ui/button';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

interface EnhancedRouteMapProps {
  cruises: CruiseData[];
  hoveredCruise: string | null;
  selectedCruise?: string | null;
}

interface LocationInfo {
  name: string;
  weather: string;
  temperature: string;
  places: string[];
  trivia: string;
}

// Sample location data
const locationData: Record<string, LocationInfo> = {
  'Miami': {
    name: 'Miami, Florida',
    weather: 'Sunny',
    temperature: '82°F',
    places: ['South Beach', 'Art Deco District', 'Wynwood Walls', 'Vizcaya Museum'],
    trivia: 'Miami is known as the "Magic City" due to its rapid growth in the early 20th century.'
  },
  'Nassau': {
    name: 'Nassau, Bahamas',
    weather: 'Partly Cloudy',
    temperature: '78°F',
    places: ['Paradise Island', 'Atlantis Resort', 'Cable Beach', 'Fort Charlotte'],
    trivia: 'Nassau was once a haven for pirates in the 18th century and is named after William III of Orange-Nassau.'
  },
  'St. Thomas': {
    name: 'St. Thomas, USVI',
    weather: 'Tropical',
    temperature: '85°F',
    places: ['Magens Bay', 'Coral World', 'Paradise Point', 'Blackbeard\'s Castle'],
    trivia: 'St. Thomas is famous for duty-free shopping and has one of the most beautiful beaches in the world.'
  },
  'Barbados': {
    name: 'Barbados',
    weather: 'Sunny',
    temperature: '83°F',
    places: ['Harrison\'s Cave', 'Animal Flower Cave', 'Rum Distilleries', 'Crane Beach'],
    trivia: 'Barbados is the birthplace of rum and has been producing it for over 350 years.'
  }
};

// Helper function to create curved sea routes avoiding land
const createSeaRoute = (startCoord: number[], endCoord: number[]) => {
  const [startLon, startLat] = startCoord;
  const [endLon, endLat] = endCoord;
  
  // Calculate distance and direction
  const distance = Math.sqrt(Math.pow(endLon - startLon, 2) + Math.pow(endLat - startLat, 2));
  
  // For Caribbean routes, create deeper sea curves
  const curveDepth = distance * 0.6; // Even deeper curve for sea routes
  
  // Determine curve direction based on geography
  const midLon = (startLon + endLon) / 2;
  const midLat = (startLat + endLat) / 2;
  
  // For Caribbean, curve outward into Atlantic or Caribbean Sea
  const isEastWestRoute = Math.abs(endLon - startLon) > Math.abs(endLat - startLat);
  const curveFactor = isEastWestRoute ? 
    (midLat > 25 ? -1 : 1) : // North of 25°N curve south, south curve north
    (midLon > -70 ? 1 : -1); // East of 70°W curve east, west curve west
  
  const points: [number, number][] = [];
  points.push([startLat, startLon]);
  
  // Create smooth curve with multiple points
  for (let i = 1; i <= 5; i++) {
    const ratio = i / 6;
    const curveRatio = Math.sin(ratio * Math.PI); // Sine curve for natural arc
    
    let curveLon = startLon + (endLon - startLon) * ratio;
    let curveLat = startLat + (endLat - startLat) * ratio;
    
    // Apply curve offset deeper into sea
    if (isEastWestRoute) {
      curveLat += curveDepth * curveRatio * curveFactor;
    } else {
      curveLon += curveDepth * curveRatio * curveFactor;
    }
    
    points.push([curveLat, curveLon]);
  }
  
  points.push([endLat, endLon]);
  return points;
};

const EnhancedRouteMap = ({ cruises, hoveredCruise, selectedCruise }: EnhancedRouteMapProps) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const largeMapRef = useRef<HTMLDivElement>(null);
  const [map, setMap] = useState<L.Map | null>(null);
  const [largeMap, setLargeMap] = useState<L.Map | null>(null);
  const [isLargeView, setIsLargeView] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState<LocationInfo | null>(null);
  
  const displayCruise = hoveredCruise 
    ? cruises.find(c => c.id === hoveredCruise)
    : selectedCruise 
    ? cruises.find(c => c.id === selectedCruise)
    : cruises.length > 0 ? cruises[0] : null;

  // Initialize location info with first port
  useEffect(() => {
    if (displayCruise && displayCruise.ports.length > 0) {
      const firstPort = displayCruise.ports[0].name;
      setSelectedLocation(locationData[firstPort] || {
        name: firstPort,
        weather: 'Sunny',
        temperature: '75°F',
        places: ['Explore the local area'],
        trivia: 'A beautiful cruise destination.'
      });
    }
  }, [displayCruise]);

  // Handle escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isLargeView) {
        setIsLargeView(false);
      }
    };

    if (isLargeView) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
      return () => {
        document.removeEventListener('keydown', handleEscape);
        document.body.style.overflow = 'unset';
      };
    }
  }, [isLargeView]);

  // Initialize main map
  useEffect(() => {
    if (!mapRef.current) return;

    // Fix for default markers
    delete (L.Icon.Default.prototype as any)._getIconUrl;
    L.Icon.Default.mergeOptions({
      iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
      iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
      shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
    });

    const mapInstance = L.map(mapRef.current).setView([20, -75], 4);
    
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors'
    }).addTo(mapInstance);

    setMap(mapInstance);

    return () => mapInstance.remove();
  }, []);

  // Initialize large map
  useEffect(() => {
    if (!largeMapRef.current || !isLargeView) return;

    const mapInstance = L.map(largeMapRef.current).setView([20, -75], 4);
    
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors'
    }).addTo(mapInstance);

    // Add click handler for large map
    mapInstance.on('click', async (e) => {
      const lat = e.latlng.lat;
      const lng = e.latlng.lng;
      
      // Query nearby locations using Overpass API
      try {
        const response = await fetch(`https://overpass-api.de/api/interpreter?data=[out:json];node(around:1000,${lat},${lng})["name"];out;`);
        const data = await response.json();
        
        if (data.elements && data.elements.length > 0) {
          const nearestPlace = data.elements[0];
          const placeName = nearestPlace.tags?.name || 'Unknown Location';
          
          // Check if we have data for this location
          const locationInfo = Object.values(locationData).find(loc => 
            loc.name.toLowerCase().includes(placeName.toLowerCase())
          ) || locationData[placeName] || {
            name: placeName,
            weather: 'Sunny',
            temperature: '75°F',
            places: ['Explore the local area'],
            trivia: 'A beautiful destination with rich history and culture.'
          };
          
          setSelectedLocation(locationInfo);
        }
      } catch (error) {
        console.log('Could not fetch location data:', error);
      }
    });

    setLargeMap(mapInstance);

    return () => {
      mapInstance.remove();
      setLargeMap(null);
    };
  }, [isLargeView]);

  // Update maps when cruise changes
  useEffect(() => {
    const updateMap = (mapInstance: L.Map | null) => {
      if (!mapInstance || !displayCruise) return;

      // Clear existing layers
      mapInstance.eachLayer((layer) => {
        if (layer instanceof L.Polyline || layer instanceof L.Marker) {
          mapInstance.removeLayer(layer);
        }
      });
      
      const ports = displayCruise.ports;
      
      // Add curved sea routes
      for (let i = 0; i < ports.length - 1; i++) {
        const routePoints = createSeaRoute(ports[i].coordinates, ports[i + 1].coordinates);
        
        const routeLine = L.polyline(routePoints, {
          color: '#ff6b35',
          weight: 3,
          opacity: 0.8
        }).addTo(mapInstance);
      }

      // Add port markers
      ports.forEach((port, index) => {
        const color = index === 0 ? '#22c55e' : index === ports.length - 1 ? '#ef4444' : '#3b82f6';
        
        const marker = L.circleMarker([port.coordinates[1], port.coordinates[0]], {
          radius: 8,
          fillColor: color,
          color: 'white',
          weight: 2,
          opacity: 1,
          fillOpacity: 0.8
        }).addTo(mapInstance);

        marker.bindPopup(`<b>${port.name}</b><br/>Port ${index + 1}`);
        
        // Add click handler for large map
        if (mapInstance === largeMap) {
          marker.on('click', () => {
            const locationInfo = locationData[port.name] || {
              name: port.name,
              weather: 'Sunny',
              temperature: '75°F',
              places: ['Explore the local area'],
              trivia: 'A beautiful cruise destination.'
            };
            setSelectedLocation(locationInfo);
          });
        }
      });

      // Fit map to route
      if (ports.length > 0) {
        const group = new L.FeatureGroup();
        ports.forEach(port => {
          group.addLayer(L.marker([port.coordinates[1], port.coordinates[0]]));
        });
        mapInstance.fitBounds(group.getBounds(), { padding: [20, 20] });
      }
    };

    updateMap(map);
    if (isLargeView) {
      updateMap(largeMap);
    }

  }, [map, largeMap, displayCruise, isLargeView]);

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
              onClick={() => setIsLargeView(true)}
              className="text-ocean-blue border-ocean-blue hover:bg-ocean-blue hover:text-white h-6 w-6 p-0"
            >
              <Maximize2 className="w-3 h-3" />
            </Button>
          </div>
        </div>

        <div ref={mapRef} className="absolute inset-0 pt-12" />
      </div>

      {/* Large View Modal - Fixed z-index and overlay */}
      {isLargeView && (
        <>
          {/* Backdrop overlay with highest z-index */}
          <div 
            className="fixed inset-0 bg-black/50 z-[999998]" 
            onClick={() => setIsLargeView(false)}
            style={{ zIndex: 999998 }}
          />
          
          {/* Modal content with even higher z-index */}
          <div 
            className="fixed inset-0 z-[999999] flex items-center justify-center p-4 pointer-events-none"
            style={{ zIndex: 999999 }}
          >
            <div className="bg-white rounded-lg w-full h-full max-w-7xl max-h-[95vh] flex flex-col relative pointer-events-auto shadow-2xl">
              {/* Header */}
              <div className="p-4 border-b border-border-gray flex justify-between items-center bg-white relative z-[1000000]">
                <h3 className="font-semibold text-charcoal">Route Map - OpenStreetMap View</h3>
                <Button
                  variant="outline"
                  onClick={() => setIsLargeView(false)}
                  className="text-slate-gray h-8 w-8 p-0"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
              
              {/* Content */}
              <div className="flex-1 flex relative overflow-hidden">
                {/* Map Section */}
                <div className="flex-1 relative">
                  <div ref={largeMapRef} className="w-full h-full" />
                </div>
                
                {/* Right Panel - Location Information */}
                <div className="w-80 border-l border-border-gray bg-white flex flex-col">
                  {selectedLocation && (
                    <>
                      {/* Location Header */}
                      <div className="p-4 border-b border-border-gray">
                        <h4 className="font-semibold text-charcoal text-lg flex items-center gap-2">
                          <MapPin className="w-5 h-5 text-ocean-blue" />
                          {selectedLocation.name}
                        </h4>
                        <div className="flex items-center gap-4 mt-2 text-sm">
                          <div className="flex items-center gap-1">
                            <Cloud className="w-4 h-4 text-blue-500" />
                            <span>{selectedLocation.weather}</span>
                          </div>
                          <span className="font-medium text-coral-pink">{selectedLocation.temperature}</span>
                        </div>
                      </div>
                      
                      {/* Places to Visit */}
                      <div className="p-4 border-b border-border-gray">
                        <h5 className="font-medium text-charcoal mb-2">Places to Visit</h5>
                        <ul className="space-y-1 text-sm text-slate-gray">
                          {selectedLocation.places.map((place, index) => (
                            <li key={index} className="flex items-center gap-2">
                              <div className="w-1 h-1 bg-ocean-blue rounded-full" />
                              {place}
                            </li>
                          ))}
                        </ul>
                      </div>
                      
                      {/* Trivia */}
                      <div className="p-4">
                        <h5 className="font-medium text-charcoal mb-2 flex items-center gap-2">
                          <Info className="w-4 h-4 text-sunset-orange" />
                          Did You Know?
                        </h5>
                        <p className="text-sm text-slate-gray">{selectedLocation.trivia}</p>
                      </div>
                    </>
                  )}
                </div>
              </div>
              
              {/* Bottom Panel - Ports */}
              {displayCruise && (
                <div className="border-t border-border-gray bg-light-gray p-4">
                  <h5 className="font-medium text-charcoal mb-2">Cruise Ports</h5>
                  <div className="flex gap-2 flex-wrap">
                    {displayCruise.ports.map((port, index) => (
                      <button
                        key={index}
                        onClick={() => {
                          const locationInfo = locationData[port.name] || {
                            name: port.name,
                            weather: 'Sunny',
                            temperature: '75°F',
                            places: ['Explore the local area'],
                            trivia: 'A beautiful cruise destination.'
                          };
                          setSelectedLocation(locationInfo);
                        }}
                        className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
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
              )}
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default EnhancedRouteMap;
