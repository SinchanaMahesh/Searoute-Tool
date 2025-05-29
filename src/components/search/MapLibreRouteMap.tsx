
import React, { useEffect, useRef, useState } from 'react';
import { Map, NavigationControl, LngLatBounds } from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import { CruiseData } from '@/api/mockCruiseData';
import { Maximize2, X, Cloud, MapPin, Info, Anchor, Calendar, Ship, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { MaritimeRouteCalculator, Port } from '@/utils/maritimeRouteCalculator';
import { getPortByName } from '@/utils/portData';

interface MapLibreRouteMapProps {
  cruises: CruiseData[];
  hoveredCruise: string | null;
  selectedCruise?: string | null;
}

const MapLibreRouteMap = ({ cruises, hoveredCruise, selectedCruise }: MapLibreRouteMapProps) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const largeMapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<Map | null>(null);
  const largeMap = useRef<Map | null>(null);
  const [isLargeView, setIsLargeView] = useState(false);
  const [selectedPort, setSelectedPort] = useState<Port | null>(null);
  const [isMapLoaded, setIsMapLoaded] = useState(false);
  const [isLargeMapLoaded, setIsLargeMapLoaded] = useState(false);
  const routeCalculator = useRef(new MaritimeRouteCalculator());
  const animationRef = useRef<number | null>(null);
  
  const displayCruise = hoveredCruise 
    ? cruises.find(c => c.id === hoveredCruise)
    : selectedCruise 
    ? cruises.find(c => c.id === selectedCruise)
    : cruises.length > 0 ? cruises[0] : null;

  // Initialize small map
  useEffect(() => {
    if (!mapContainer.current || map.current) return;

    map.current = new Map({
      container: mapContainer.current,
      style: {
        version: 8,
        sources: {
          'osm': {
            type: 'raster',
            tiles: ['https://tile.openstreetmap.org/{z}/{x}/{y}.png'],
            tileSize: 256,
            attribution: '© OpenStreetMap contributors'
          }
        },
        layers: [
          {
            id: 'osm',
            type: 'raster',
            source: 'osm'
          }
        ]
      },
      center: [-75, 25],
      zoom: 5,
      maxZoom: 18,
      minZoom: 2
    });

    map.current.addControl(new NavigationControl(), 'top-right');
    map.current.on('load', () => setIsMapLoaded(true));

    return () => {
      map.current?.remove();
    };
  }, []);

  // Initialize large map when modal opens
  useEffect(() => {
    if (!isLargeView || !largeMapContainer.current || largeMap.current) return;

    largeMap.current = new Map({
      container: largeMapContainer.current,
      style: {
        version: 8,
        sources: {
          'osm': {
            type: 'raster',
            tiles: ['https://tile.openstreetmap.org/{z}/{x}/{y}.png'],
            tileSize: 256,
            attribution: '© OpenStreetMap contributors'
          }
        },
        layers: [
          {
            id: 'osm',
            type: 'raster',
            source: 'osm'
          }
        ]
      },
      center: [-75, 25],
      zoom: 5,
      maxZoom: 18,
      minZoom: 2
    });

    largeMap.current.addControl(new NavigationControl(), 'top-right');
    
    largeMap.current.on('load', () => {
      setIsLargeMapLoaded(true);
    });

    largeMap.current.on('click', 'large-ports', (e) => {
      if (e.features && e.features[0] && e.features[0].properties) {
        const portName = e.features[0].properties.name;
        const port = getPortByName(portName);
        if (port) {
          setSelectedPort(port);
        }
      }
    });

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      largeMap.current?.remove();
      largeMap.current = null;
      setIsLargeMapLoaded(false);
    };
  }, [isLargeView]);

  // Handle escape key for large view
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

  // Animate route direction
  const animateRoute = (mapInstance: Map, routeId: string) => {
    if (!mapInstance.getLayer(routeId)) return;

    let dashOffset = 0;
    const animate = () => {
      dashOffset = (dashOffset + 0.5) % 10;
      
      if (mapInstance.getLayer(routeId)) {
        mapInstance.setPaintProperty(routeId, 'line-dasharray', [2, 2]);
        mapInstance.setPaintProperty(routeId, 'line-translate', [dashOffset, 0]);
      }
      
      animationRef.current = requestAnimationFrame(animate);
    };
    
    animate();
  };

  // Update routes for both maps
  const updateRoutes = (mapInstance: Map, isLarge: boolean = false) => {
    if (!mapInstance || (!isMapLoaded && !isLarge) || (!isLargeMapLoaded && isLarge) || !displayCruise) return;

    const routeLayerId = isLarge ? 'large-cruise-route' : 'cruise-route';
    const routeSourceId = isLarge ? 'large-cruise-route' : 'cruise-route';
    const portsLayerId = isLarge ? 'large-ports' : 'ports';
    const portsSourceId = isLarge ? 'large-ports' : 'ports';
    const portLabelsId = isLarge ? 'large-port-labels' : 'port-labels';

    // Clear existing layers
    if (mapInstance.getLayer(routeLayerId)) mapInstance.removeLayer(routeLayerId);
    if (mapInstance.getSource(routeSourceId)) mapInstance.removeSource(routeSourceId);
    if (mapInstance.getLayer(portsLayerId)) mapInstance.removeLayer(portsLayerId);
    if (mapInstance.getSource(portsSourceId)) mapInstance.removeSource(portsSourceId);
    if (mapInstance.getLayer(portLabelsId)) mapInstance.removeLayer(portLabelsId);

    const ports: Port[] = [];
    displayCruise.ports.forEach((cruisePort) => {
      const port = getPortByName(cruisePort.name);
      if (port) {
        ports.push(port);
      }
    });

    // Add port markers
    if (ports.length > 0) {
      mapInstance.addSource(portsSourceId, {
        type: 'geojson',
        data: {
          type: 'FeatureCollection',
          features: ports.map((port, index) => ({
            type: 'Feature',
            geometry: {
              type: 'Point',
              coordinates: port.coordinates
            },
            properties: {
              name: port.name,
              type: port.type,
              index: index
            }
          }))
        }
      });

      mapInstance.addLayer({
        id: portsLayerId,
        type: 'circle',
        source: portsSourceId,
        paint: {
          'circle-radius': isLarge ? [
            'case',
            ['==', ['get', 'index'], 0], 15,
            ['==', ['get', 'index'], ports.length - 1], 15,
            10
          ] : [
            'case',
            ['==', ['get', 'index'], 0], 12,
            ['==', ['get', 'index'], ports.length - 1], 12,
            8
          ],
          'circle-color': [
            'case',
            ['==', ['get', 'index'], 0], '#22c55e',
            ['==', ['get', 'index'], ports.length - 1], '#ef4444',
            '#3b82f6'
          ],
          'circle-stroke-width': 2,
          'circle-stroke-color': '#ffffff'
        }
      });

      if (isLarge) {
        mapInstance.addLayer({
          id: portLabelsId,
          type: 'symbol',
          source: portsSourceId,
          layout: {
            'text-field': ['get', 'name'],
            'text-font': ['Open Sans Regular'],
            'text-offset': [0, 2],
            'text-anchor': 'top',
            'text-size': 14
          },
          paint: {
            'text-color': '#1f2937',
            'text-halo-color': '#ffffff',
            'text-halo-width': 2
          }
        });
      }
    }

    // Calculate and add maritime routes
    if (ports.length > 1) {
      const allRouteSegments: any[] = [];
      
      for (let i = 0; i < ports.length - 1; i++) {
        const route = routeCalculator.current.calculateSeaRoute(ports[i], ports[i + 1]);
        
        route.segments.forEach((segment, segIndex) => {
          allRouteSegments.push({
            type: 'Feature',
            geometry: {
              type: 'LineString',
              coordinates: [segment.start, segment.end]
            },
            properties: {
              segmentType: segment.type,
              routeIndex: i,
              segmentIndex: segIndex
            }
          });
        });
      }

      if (allRouteSegments.length > 0) {
        mapInstance.addSource(routeSourceId, {
          type: 'geojson',
          data: {
            type: 'FeatureCollection',
            features: allRouteSegments
          }
        });

        mapInstance.addLayer({
          id: routeLayerId,
          type: 'line',
          source: routeSourceId,
          layout: {
            'line-join': 'round',
            'line-cap': 'round'
          },
          paint: {
            'line-color': [
              'case',
              ['==', ['get', 'segmentType'], 'sea'], '#006994',
              '#ff4444'
            ],
            'line-width': isLarge ? [
              'case',
              ['==', ['get', 'segmentType'], 'sea'], 4,
              3
            ] : [
              'case',
              ['==', ['get', 'segmentType'], 'sea'], 3,
              2
            ],
            'line-dasharray': [
              'case',
              ['==', ['get', 'segmentType'], 'sea'], ['literal', [1, 0]],
              ['literal', [5, 5]]
            ]
          }
        });

        // Start route animation for large view
        if (isLarge) {
          setTimeout(() => animateRoute(mapInstance, routeLayerId), 500);
        }
      }

      // Fit map to show all ports
      const coordinates = ports.map(port => port.coordinates);
      const bounds = coordinates.reduce(
        (bounds, coord) => bounds.extend(coord),
        new LngLatBounds(coordinates[0], coordinates[0])
      );
      
      mapInstance.fitBounds(bounds, { padding: isLarge ? 80 : 50 });
    }
  };

  // Update small map routes
  useEffect(() => {
    if (map.current && isMapLoaded) {
      updateRoutes(map.current, false);
    }
  }, [displayCruise, isMapLoaded]);

  // Update large map routes
  useEffect(() => {
    if (largeMap.current && isLargeMapLoaded) {
      updateRoutes(largeMap.current, true);
    }
  }, [displayCruise, isLargeMapLoaded]);

  // Set initial selected port
  useEffect(() => {
    if (displayCruise && displayCruise.ports.length > 0 && !selectedPort) {
      const firstPort = getPortByName(displayCruise.ports[0].name);
      if (firstPort) {
        setSelectedPort(firstPort);
      }
    }
  }, [displayCruise, selectedPort]);

  return (
    <>
      <div className="h-full bg-gradient-to-br from-blue-50 to-blue-100 relative overflow-hidden">
        {/* Compact Map Header */}
        <div className="absolute top-0 left-0 right-0 bg-white/95 backdrop-blur-sm p-2 border-b border-border-gray z-20">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-medium text-charcoal text-xs flex items-center gap-1">
                <Anchor className="w-3 h-3 text-ocean-blue" />
                Maritime Routes
              </h3>
              <p className="text-xs text-slate-gray">
                {displayCruise 
                  ? `${displayCruise.shipName} - ${displayCruise.ports.length} ports` 
                  : 'Select a cruise to view route'}
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

        {/* Map Container */}
        <div 
          ref={mapContainer} 
          className="absolute inset-0 pt-12 w-full h-full"
          style={{ height: 'calc(100% - 48px)', marginTop: '48px' }}
        />
      </div>

      {/* Large View Modal - Maximum Z-Index */}
      {isLargeView && (
        <>
          {/* Backdrop overlay - Highest priority */}
          <div 
            className="fixed inset-0 bg-black/60 z-[9999998]" 
            onClick={() => setIsLargeView(false)}
          />
          
          {/* Modal content - Top layer */}
          <div 
            className="fixed inset-0 z-[9999999] flex items-center justify-center p-6 pointer-events-none"
          >
            <div className="bg-white rounded-xl w-full h-full max-w-[95vw] max-h-[95vh] flex flex-col relative pointer-events-auto shadow-2xl border border-gray-200">
              {/* Header */}
              <div className="p-6 border-b border-border-gray flex justify-between items-center bg-white relative z-[10000000] rounded-t-xl">
                <h3 className="font-semibold text-charcoal flex items-center gap-2 text-lg">
                  <Anchor className="w-6 h-6 text-ocean-blue" />
                  Maritime Navigation - Interactive View
                </h3>
                <Button
                  variant="outline"
                  onClick={() => setIsLargeView(false)}
                  className="text-slate-gray h-8 w-8 p-0 hover:bg-gray-100"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
              
              {/* Main Content - Two Pane Layout */}
              <div className="flex-1 flex relative overflow-hidden">
                {/* Left Pane - Map (75%) + Sailing Info (25%) */}
                <div className="flex-1 flex flex-col border-r border-border-gray">
                  {/* Map Section - 75% */}
                  <div className="h-3/4 relative">
                    <div 
                      ref={largeMapContainer}
                      className="w-full h-full"
                    />
                  </div>
                  
                  {/* Sailing Info Section - 25% */}
                  {displayCruise && (
                    <div className="h-1/4 border-t border-border-gray bg-gradient-to-r from-blue-50 to-white p-4 overflow-y-auto">
                      <div className="grid grid-cols-2 gap-4 h-full">
                        <div>
                          <h5 className="font-semibold text-charcoal mb-2 flex items-center gap-2">
                            <Ship className="w-4 h-4 text-ocean-blue" />
                            Cruise Details
                          </h5>
                          <div className="space-y-1 text-sm">
                            <p><span className="font-medium">Ship:</span> {displayCruise.shipName}</p>
                            <p><span className="font-medium">Line:</span> {displayCruise.cruiseLine}</p>
                            <p><span className="font-medium">Duration:</span> {displayCruise.duration} nights</p>
                            <p><span className="font-medium">From:</span> <span className="text-coral-pink font-bold">${displayCruise.priceFrom}</span></p>
                          </div>
                        </div>
                        <div>
                          <h5 className="font-semibold text-charcoal mb-2 flex items-center gap-2">
                            <Calendar className="w-4 h-4 text-sunset-orange" />
                            Route Information
                          </h5>
                          <div className="space-y-1 text-sm">
                            <p><span className="font-medium">Ports:</span> {displayCruise.ports.length} destinations</p>
                            <p><span className="font-medium">Departure:</span> {displayCruise.ports[0]?.name}</p>
                            <p><span className="font-medium">Region:</span> {displayCruise.region}</p>
                            <div className="flex gap-1 mt-2 flex-wrap">
                              {displayCruise.ports.slice(0, 3).map((port, idx) => (
                                <span key={idx} className="px-2 py-1 bg-ocean-blue/10 text-ocean-blue text-xs rounded-full">
                                  {port.name}
                                </span>
                              ))}
                              {displayCruise.ports.length > 3 && (
                                <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                                  +{displayCruise.ports.length - 3} more
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
                
                {/* Right Panel - Port Information */}
                {selectedPort && (
                  <div className="w-80 bg-white flex flex-col">
                    {/* Port Header */}
                    <div className="p-6 border-b border-border-gray">
                      <h4 className="font-semibold text-charcoal text-xl flex items-center gap-2 mb-2">
                        <MapPin className="w-6 h-6 text-ocean-blue" />
                        {selectedPort.name}
                      </h4>
                      <p className="text-slate-gray mb-3">{selectedPort.country}</p>
                      <div className="flex items-center gap-4 text-sm">
                        <div className="flex items-center gap-2 bg-blue-50 px-3 py-1 rounded-full">
                          <Cloud className="w-4 h-4 text-blue-500" />
                          <span>{selectedPort.weather.condition}</span>
                        </div>
                        <span className="font-bold text-lg text-coral-pink">{selectedPort.weather.temp}°F</span>
                      </div>
                    </div>
                    
                    {/* Port Description */}
                    <div className="p-6 border-b border-border-gray">
                      <p className="text-slate-gray leading-relaxed">{selectedPort.description}</p>
                    </div>
                    
                    {/* Attractions */}
                    <div className="p-6 border-b border-border-gray flex-1 overflow-y-auto">
                      <h5 className="font-semibold text-charcoal mb-3">Top Attractions</h5>
                      <ul className="space-y-2">
                        {selectedPort.attractions.map((attraction, index) => (
                          <li key={index} className="flex items-start gap-3 text-sm">
                            <div className="w-2 h-2 bg-ocean-blue rounded-full mt-2 flex-shrink-0" />
                            <span className="text-slate-gray">{attraction}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    
                    {/* Port Info */}
                    <div className="p-6 bg-light-gray">
                      <h5 className="font-semibold text-charcoal mb-3 flex items-center gap-2">
                        <Info className="w-5 h-5 text-sunset-orange" />
                        Port Details
                      </h5>
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div className="text-center">
                          <div className="font-bold text-lg text-ocean-blue">{selectedPort.capacity.toLocaleString()}</div>
                          <div className="text-slate-gray">Capacity</div>
                        </div>
                        <div className="text-center">
                          <div className="font-bold text-lg text-sunset-orange">{selectedPort.rating}/5</div>
                          <div className="text-slate-gray">{selectedPort.reviews.toLocaleString()} reviews</div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
              
              {/* Bottom Panel - Route Navigation */}
              {displayCruise && (
                <div className="border-t border-border-gray bg-light-gray p-4">
                  <h5 className="font-medium text-charcoal mb-3">Cruise Itinerary</h5>
                  <div className="flex gap-2 flex-wrap">
                    {displayCruise.ports.map((port, index) => {
                      const portData = getPortByName(port.name);
                      return (
                        <button
                          key={index}
                          onClick={() => portData && setSelectedPort(portData)}
                          className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                            selectedPort?.name === port.name
                              ? 'bg-ocean-blue text-white shadow-md'
                              : 'bg-white text-slate-gray hover:bg-ocean-blue hover:text-white border border-gray-200'
                          }`}
                        >
                          {index + 1}. {port.name}
                        </button>
                      );
                    })}
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

export default MapLibreRouteMap;
