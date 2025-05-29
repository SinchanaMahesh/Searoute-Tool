
import React, { useEffect, useRef, useState } from 'react';
import { CruiseData } from '@/api/mockCruiseData';
import { Maximize2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface EnhancedRouteMapProps {
  cruises: CruiseData[];
  hoveredCruise: string | null;
  selectedCruise?: string | null;
}

const EnhancedRouteMap = ({ cruises, hoveredCruise, selectedCruise }: EnhancedRouteMapProps) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const [map, setMap] = useState<any>(null);
  const [mapboxToken, setMapboxToken] = useState('');
  const [isLargeView, setIsLargeView] = useState(false);
  
  // Use hovered cruise if available, otherwise use selected cruise, otherwise use first cruise
  const displayCruise = hoveredCruise 
    ? cruises.find(c => c.id === hoveredCruise)
    : selectedCruise 
    ? cruises.find(c => c.id === selectedCruise)
    : cruises.length > 0 ? cruises[0] : null;

  useEffect(() => {
    // Load Mapbox GL JS
    const script = document.createElement('script');
    script.src = 'https://api.mapbox.com/mapbox-gl-js/v2.15.0/mapbox-gl.js';
    script.onload = initializeMap;
    document.head.appendChild(script);

    const link = document.createElement('link');
    link.href = 'https://api.mapbox.com/mapbox-gl-js/v2.15.0/mapbox-gl.css';
    link.rel = 'stylesheet';
    document.head.appendChild(link);

    return () => {
      if (document.head.contains(script)) document.head.removeChild(script);
      if (document.head.contains(link)) document.head.removeChild(link);
    };
  }, []);

  const initializeMap = () => {
    if (!mapRef.current || !window.mapboxgl || !mapboxToken) return;

    window.mapboxgl.accessToken = mapboxToken;
    
    const mapInstance = new window.mapboxgl.Map({
      container: mapRef.current,
      style: 'mapbox://styles/mapbox/streets-v12',
      center: [10, 50], // Europe center
      zoom: 3,
      projection: 'globe'
    });

    mapInstance.on('load', () => {
      // Add atmosphere for globe view
      mapInstance.setFog({
        color: 'rgb(186, 210, 235)',
        'high-color': 'rgb(36, 92, 223)',
        'horizon-blend': 0.02,
        'space-color': 'rgb(11, 11, 25)',
        'star-intensity': 0.6
      });
    });

    setMap(mapInstance);
  };

  useEffect(() => {
    if (!map || !displayCruise) return;

    // Clear existing routes and markers
    if (map.getLayer('route')) {
      map.removeLayer('route');
    }
    if (map.getSource('route')) {
      map.removeSource('route');
    }

    // Clear existing markers
    const markers = document.querySelectorAll('.mapboxgl-marker');
    markers.forEach(marker => marker.remove());

    // Add route for display cruise
    const coordinates = displayCruise.ports.map(port => port.coordinates);
    
    map.addSource('route', {
      type: 'geojson',
      data: {
        type: 'Feature',
        properties: {},
        geometry: {
          type: 'LineString',
          coordinates: coordinates
        }
      }
    });

    map.addLayer({
      id: 'route',
      type: 'line',
      source: 'route',
      layout: {
        'line-join': 'round',
        'line-cap': 'round'
      },
      paint: {
        'line-color': '#ff6b35',
        'line-width': 3,
        'line-opacity': 0.8
      }
    });

    // Add port markers
    coordinates.forEach((coord, index) => {
      const marker = new window.mapboxgl.Marker({
        color: index === 0 ? '#22c55e' : index === coordinates.length - 1 ? '#ef4444' : '#3b82f6'
      })
        .setLngLat(coord)
        .setPopup(new window.mapboxgl.Popup().setText(displayCruise.ports[index].name))
        .addTo(map);
    });

    // Fit map to route
    if (coordinates.length > 0) {
      const bounds = new window.mapboxgl.LngLatBounds();
      coordinates.forEach(coord => bounds.extend(coord));
      map.fitBounds(bounds, { padding: 20 });
    }

  }, [map, displayCruise]);

  return (
    <div className="h-full bg-gradient-to-br from-blue-50 to-blue-100 relative overflow-hidden">
      {/* Map Header */}
      <div className="absolute top-0 left-0 right-0 bg-white/95 backdrop-blur-sm p-3 border-b border-border-gray z-20">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-semibold text-charcoal text-sm">Cruise Routes</h3>
            <p className="text-xs text-slate-gray">
              {displayCruise 
                ? `${displayCruise.shipName} - ${displayCruise.route}` 
                : 'Hover over a cruise to see its route'}
            </p>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsLargeView(true)}
            className="text-ocean-blue border-ocean-blue hover:bg-ocean-blue hover:text-white"
          >
            <Maximize2 className="w-3 h-3" />
          </Button>
        </div>
      </div>

      {/* Mapbox Token Input */}
      {!mapboxToken && (
        <div className="absolute inset-0 pt-16 flex items-center justify-center bg-white/95 z-10">
          <div className="p-4 max-w-sm text-center">
            <h4 className="font-semibold text-charcoal mb-2 text-sm">Enable Interactive Maps</h4>
            <p className="text-xs text-slate-gray mb-3">
              Enter your Mapbox token to see cruise routes.
            </p>
            <input
              type="text"
              placeholder="pk.eyJ1..."
              className="w-full p-2 border border-border-gray rounded mb-2 text-xs"
              onChange={(e) => setMapboxToken(e.target.value)}
            />
            <p className="text-xs text-slate-gray">
              Get your token from <a href="https://mapbox.com" target="_blank" rel="noopener noreferrer" className="text-ocean-blue underline">mapbox.com</a>
            </p>
          </div>
        </div>
      )}

      {/* Map Container */}
      {mapboxToken && (
        <div ref={mapRef} className="absolute inset-0 pt-16" />
      )}

      {/* Fallback Map for Demo */}
      {!mapboxToken && (
        <div className="absolute inset-0 pt-16">
          <svg viewBox="0 0 400 300" className="w-full h-full">
            {/* Ocean Background */}
            <rect width="400" height="300" fill="#e0f2fe" />
            
            {/* Simplified coastlines */}
            <path
              d="M 50 50 L 150 60 L 200 80 L 250 70 L 300 90 L 350 80"
              stroke="#64748b"
              strokeWidth="2"
              fill="none"
            />
            <path
              d="M 80 120 L 120 125 L 160 130 L 200 125 L 240 130 L 280 125"
              stroke="#64748b"
              strokeWidth="2"
              fill="none"
            />
            
            {displayCruise && (
              <g>
                {/* Route line */}
                <path
                  d="M 100 140 Q 140 160 180 170 Q 220 155 260 150 Q 200 135 100 140"
                  stroke="#f97316"
                  strokeWidth="3"
                  fill="none"
                  strokeDasharray="5,5"
                  className="animate-pulse"
                />
                {/* Port markers */}
                <circle cx="100" cy="140" r="5" fill="#22c55e" className="animate-pulse" />
                <circle cx="180" cy="170" r="4" fill="#3b82f6" className="animate-pulse" />
                <circle cx="260" cy="150" r="5" fill="#ef4444" className="animate-pulse" />
                
                {/* Port labels */}
                <text x="105" y="135" fontSize="10" fill="#0f172a">{displayCruise.ports[0]?.name}</text>
                <text x="265" y="145" fontSize="10" fill="#0f172a">{displayCruise.ports[displayCruise.ports.length - 1]?.name}</text>
              </g>
            )}
          </svg>
        </div>
      )}

      {/* Large View Modal */}
      {isLargeView && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg w-full h-full max-w-6xl max-h-[90vh] flex flex-col">
            <div className="p-4 border-b border-border-gray flex justify-between items-center">
              <h3 className="font-semibold text-charcoal">Route Map - Large View</h3>
              <Button
                variant="outline"
                onClick={() => setIsLargeView(false)}
                className="text-slate-gray"
              >
                Close
              </Button>
            </div>
            <div className="flex-1 relative">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center">
                <p className="text-slate-gray">Large map view would be rendered here</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EnhancedRouteMap;
