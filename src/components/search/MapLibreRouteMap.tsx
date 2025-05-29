
import React, { useEffect, useRef, useState } from 'react';
import { Map, NavigationControl, Popup } from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import { CruiseData } from '@/api/mockCruiseData';
import { Maximize2, X, Cloud, MapPin, Info, Anchor } from 'lucide-react';
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
  const map = useRef<Map | null>(null);
  const [isLargeView, setIsLargeView] = useState(false);
  const [selectedPort, setSelectedPort] = useState<Port | null>(null);
  const [isMapLoaded, setIsMapLoaded] = useState(false);
  const routeCalculator = useRef(new MaritimeRouteCalculator());
  
  const displayCruise = hoveredCruise 
    ? cruises.find(c => c.id === hoveredCruise)
    : selectedCruise 
    ? cruises.find(c => c.id === selectedCruise)
    : cruises.length > 0 ? cruises[0] : null;

  // Initialize map
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
      center: [-75, 25], // Caribbean center
      zoom: 5,
      maxZoom: 18,
      minZoom: 2
    });

    // Add navigation controls
    map.current.addControl(new NavigationControl(), 'top-right');

    map.current.on('load', () => {
      setIsMapLoaded(true);
    });

    map.current.on('click', 'ports', (e) => {
      if (e.features && e.features[0] && e.features[0].properties) {
        const portName = e.features[0].properties.name;
        const port = getPortByName(portName);
        if (port) {
          setSelectedPort(port);
        }
      }
    });

    // Add hover cursor for ports
    map.current.on('mouseenter', 'ports', () => {
      if (map.current) {
        map.current.getCanvas().style.cursor = 'pointer';
      }
    });

    map.current.on('mouseleave', 'ports', () => {
      if (map.current) {
        map.current.getCanvas().style.cursor = '';
      }
    });

    return () => {
      map.current?.remove();
    };
  }, []);

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

  // Update routes when cruise changes
  useEffect(() => {
    if (!map.current || !isMapLoaded || !displayCruise) return;

    // Clear existing routes and ports
    if (map.current.getLayer('cruise-route')) map.current.removeLayer('cruise-route');
    if (map.current.getSource('cruise-route')) map.current.removeSource('cruise-route');
    if (map.current.getLayer('ports')) map.current.removeLayer('ports');
    if (map.current.getSource('ports')) map.current.removeSource('ports');

    // Convert cruise ports to Port objects and calculate routes
    const ports: Port[] = [];
    const routeCoordinates: [number, number][] = [];

    displayCruise.ports.forEach((cruisePort, index) => {
      const port = getPortByName(cruisePort.name);
      if (port) {
        ports.push(port);
        routeCoordinates.push(port.coordinates);
      }
    });

    // Add port markers
    if (ports.length > 0) {
      map.current.addSource('ports', {
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

      // Add port symbols
      map.current.addLayer({
        id: 'ports',
        type: 'circle',
        source: 'ports',
        paint: {
          'circle-radius': [
            'case',
            ['==', ['get', 'index'], 0], 12, // Start port - larger
            ['==', ['get', 'index'], ports.length - 1], 12, // End port - larger
            8 // Other ports
          ],
          'circle-color': [
            'case',
            ['==', ['get', 'index'], 0], '#22c55e', // Start port - green
            ['==', ['get', 'index'], ports.length - 1], '#ef4444', // End port - red
            '#3b82f6' // Other ports - blue
          ],
          'circle-stroke-width': 2,
          'circle-stroke-color': '#ffffff'
        }
      });

      // Add port labels
      map.current.addLayer({
        id: 'port-labels',
        type: 'symbol',
        source: 'ports',
        layout: {
          'text-field': ['get', 'name'],
          'text-font': ['Open Sans Regular'],
          'text-offset': [0, 2],
          'text-anchor': 'top',
          'text-size': 12
        },
        paint: {
          'text-color': '#1f2937',
          'text-halo-color': '#ffffff',
          'text-halo-width': 1
        }
      });
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
        map.current.addSource('cruise-route', {
          type: 'geojson',
          data: {
            type: 'FeatureCollection',
            features: allRouteSegments
          }
        });

        map.current.addLayer({
          id: 'cruise-route',
          type: 'line',
          source: 'cruise-route',
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
            'line-width': [
              'case',
              ['==', ['get', 'segmentType'], 'sea'], 3,
              2
            ],
            'line-dasharray': [
              'case',
              ['==', ['get', 'segmentType'], 'sea'], [1, 0],
              [5, 5]
            ]
          }
        });
      }

      // Fit map to show all ports
      const coordinates = ports.map(port => port.coordinates);
      const bounds = coordinates.reduce(
        (bounds, coord) => bounds.extend(coord),
        new maplibregl.LngLatBounds(coordinates[0], coordinates[0])
      );
      
      map.current.fitBounds(bounds, { padding: 50 });
    }
  }, [displayCruise, isMapLoaded]);

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

      {/* Large View Modal */}
      {isLargeView && (
        <>
          {/* Backdrop overlay */}
          <div 
            className="fixed inset-0 bg-black/50 z-[999998]" 
            onClick={() => setIsLargeView(false)}
            style={{ zIndex: 999998 }}
          />
          
          {/* Modal content */}
          <div 
            className="fixed inset-0 z-[999999] flex items-center justify-center p-4 pointer-events-none"
            style={{ zIndex: 999999 }}
          >
            <div className="bg-white rounded-lg w-full h-full max-w-7xl max-h-[95vh] flex flex-col relative pointer-events-auto shadow-2xl">
              {/* Header */}
              <div className="p-4 border-b border-border-gray flex justify-between items-center bg-white relative z-[1000000]">
                <h3 className="font-semibold text-charcoal flex items-center gap-2">
                  <Anchor className="w-5 h-5 text-ocean-blue" />
                  Maritime Navigation - Interactive View
                </h3>
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
                  <div 
                    className="w-full h-full"
                    style={{ height: '100%' }}
                  />
                </div>
                
                {/* Right Panel - Port Information */}
                {selectedPort && (
                  <div className="w-80 border-l border-border-gray bg-white flex flex-col">
                    {/* Port Header */}
                    <div className="p-4 border-b border-border-gray">
                      <h4 className="font-semibold text-charcoal text-lg flex items-center gap-2">
                        <MapPin className="w-5 h-5 text-ocean-blue" />
                        {selectedPort.name}
                      </h4>
                      <p className="text-sm text-slate-gray">{selectedPort.country}</p>
                      <div className="flex items-center gap-4 mt-2 text-sm">
                        <div className="flex items-center gap-1">
                          <Cloud className="w-4 h-4 text-blue-500" />
                          <span>{selectedPort.weather.condition}</span>
                        </div>
                        <span className="font-medium text-coral-pink">{selectedPort.weather.temp}°F</span>
                      </div>
                    </div>
                    
                    {/* Port Description */}
                    <div className="p-4 border-b border-border-gray">
                      <p className="text-sm text-slate-gray">{selectedPort.description}</p>
                    </div>
                    
                    {/* Attractions */}
                    <div className="p-4 border-b border-border-gray">
                      <h5 className="font-medium text-charcoal mb-2">Top Attractions</h5>
                      <ul className="space-y-1 text-sm text-slate-gray">
                        {selectedPort.attractions.map((attraction, index) => (
                          <li key={index} className="flex items-center gap-2">
                            <div className="w-1 h-1 bg-ocean-blue rounded-full" />
                            {attraction}
                          </li>
                        ))}
                      </ul>
                    </div>
                    
                    {/* Port Info */}
                    <div className="p-4">
                      <h5 className="font-medium text-charcoal mb-2 flex items-center gap-2">
                        <Info className="w-4 h-4 text-sunset-orange" />
                        Port Details
                      </h5>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-slate-gray">Capacity:</span>
                          <span className="font-medium">{selectedPort.capacity.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-gray">Rating:</span>
                          <span className="font-medium">{selectedPort.rating}/5</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-gray">Reviews:</span>
                          <span className="font-medium">{selectedPort.reviews.toLocaleString()}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
              
              {/* Bottom Panel - Route Info */}
              {displayCruise && (
                <div className="border-t border-border-gray bg-light-gray p-4">
                  <h5 className="font-medium text-charcoal mb-2">Maritime Route</h5>
                  <div className="flex gap-2 flex-wrap">
                    {displayCruise.ports.map((port, index) => {
                      const portData = getPortByName(port.name);
                      return (
                        <button
                          key={index}
                          onClick={() => portData && setSelectedPort(portData)}
                          className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                            selectedPort?.name === port.name
                              ? 'bg-ocean-blue text-white'
                              : 'bg-white text-slate-gray hover:bg-ocean-blue hover:text-white'
                          }`}
                        >
                          {port.name}
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
