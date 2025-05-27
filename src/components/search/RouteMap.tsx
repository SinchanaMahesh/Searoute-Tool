
import React, { useEffect, useRef, useState } from 'react';
import { Cruise } from '@/pages/Search';

interface RouteMapProps {
  cruises: Cruise[];
  hoveredCruise: string | null;
}

const RouteMap = ({ cruises, hoveredCruise }: RouteMapProps) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const [map, setMap] = useState<any>(null);
  const [mapboxToken, setMapboxToken] = useState('');
  const hoveredCruiseData = cruises.find(c => c.id === hoveredCruise);

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
      document.head.removeChild(script);
      document.head.removeChild(link);
    };
  }, []);

  const initializeMap = () => {
    if (!mapRef.current || !window.mapboxgl) return;

    // For demo purposes, using a placeholder token message
    if (!mapboxToken) {
      return;
    }

    window.mapboxgl.accessToken = mapboxToken;
    
    const mapInstance = new window.mapboxgl.Map({
      container: mapRef.current,
      style: 'mapbox://styles/mapbox/satellite-streets-v12',
      center: [-30, 35], // Atlantic Ocean center
      zoom: 2,
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

  // Mock port coordinates for demonstration
  const getPortCoordinates = (portName: string): [number, number] => {
    const portCoords: { [key: string]: [number, number] } = {
      'Seattle': [-122.3321, 47.6062],
      'Vancouver': [-123.1207, 49.2827],
      'Miami': [-80.1918, 25.7617],
      'Fort Lauderdale': [-80.1373, 26.1224],
      'Barcelona': [2.1734, 41.3851],
      'Rome/Civitavecchia': [11.7988, 42.0942],
      'Southampton': [-1.4044, 50.9097],
      'Ketchikan': [-131.6461, 55.3422],
      'Juneau': [-134.4197, 58.3019],
      'Skagway': [-135.3101, 59.4600],
      'Victoria/Canada': [-123.3656, 48.4284],
      'Rhodes': [28.2278, 36.4341],
      'Istanbul': [28.9784, 41.0082],
      'Santorini': [25.4615, 36.3932],
      'Athens/Piraeus': [23.7275, 37.9755],
      'Valletta': [14.5146, 35.8989],
      'Dubrovnik': [18.0945, 42.6507],
      'Venice': [12.3155, 45.4408],
      'Naples': [14.2681, 40.8518],
      'Palma de Mallorca': [2.6502, 39.5696],
      'Marseille': [5.3698, 43.2965],
      'Gibraltar': [-5.3536, 36.1408],
      'Lisbon': [-9.1393, 38.7223],
      'Madeira': [-16.9595, 32.7607],
      'Canary Islands': [-15.4138, 28.1235],
      'Reykjavik': [-21.8174, 64.1466],
      'Bergen': [5.3221, 60.3913],
      'Stockholm': [18.0686, 59.3293],
      'Copenhagen': [12.5683, 55.6761],
      'St. Petersburg': [30.3141, 59.9311],
      'Helsinki': [24.9384, 60.1699],
      'Tallinn': [24.7536, 59.4370],
      'Oslo': [10.7522, 59.9139]
    };
    
    // Default to random coordinates if port not found
    return portCoords[portName] || [-30 + Math.random() * 60, 20 + Math.random() * 40];
  };

  useEffect(() => {
    if (!map || !hoveredCruiseData) return;

    // Clear existing route
    if (map.getLayer('route')) {
      map.removeLayer('route');
    }
    if (map.getSource('route')) {
      map.removeSource('route');
    }

    // Add route for hovered cruise
    const coordinates = hoveredCruiseData.ports.map(port => getPortCoordinates(port));
    
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
        .addTo(map);
    });

    // Fit map to route
    const bounds = new window.mapboxgl.LngLatBounds();
    coordinates.forEach(coord => bounds.extend(coord));
    map.fitBounds(bounds, { padding: 50 });

  }, [map, hoveredCruiseData]);

  return (
    <div className="h-full bg-gradient-to-br from-blue-50 to-blue-100 relative overflow-hidden">
      {/* Map Header */}
      <div className="absolute top-0 left-0 right-0 bg-white/90 backdrop-blur-sm p-3 border-b border-border-gray z-10">
        <h3 className="font-semibold text-charcoal text-sm">Route Visualization</h3>
        <p className="text-xs text-slate-gray">
          {hoveredCruiseData 
            ? `Viewing route for ${hoveredCruiseData.shipName}` 
            : 'Hover over a cruise to see its route'}
        </p>
      </div>

      {/* Mapbox Token Input (if not set) */}
      {!mapboxToken && (
        <div className="absolute inset-0 pt-16 flex items-center justify-center bg-white/95">
          <div className="p-6 max-w-md text-center">
            <h4 className="font-semibold text-charcoal mb-3">Enable Interactive Maps</h4>
            <p className="text-sm text-slate-gray mb-4">
              Enter your Mapbox public token to see cruise routes on an interactive map.
              Get your token at <a href="https://mapbox.com" target="_blank" rel="noopener noreferrer" className="text-ocean-blue hover:underline">mapbox.com</a>
            </p>
            <input
              type="text"
              placeholder="pk.eyJ1..."
              className="w-full p-2 border border-border-gray rounded mb-3 text-sm"
              onChange={(e) => setMapboxToken(e.target.value)}
            />
            <p className="text-xs text-slate-gray">
              This is only stored temporarily for this session
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
          <svg viewBox="0 0 400 200" className="w-full h-full">
            {/* Ocean Background */}
            <rect width="400" height="200" fill="#e0f2fe" />
            
            {/* Simplified coastlines */}
            <path
              d="M 50 20 L 150 30 L 200 50 L 250 40 L 300 60 L 350 50"
              stroke="#64748b"
              strokeWidth="2"
              fill="none"
            />
            <path
              d="M 80 80 L 120 85 L 160 90 L 200 85 L 240 90 L 280 85"
              stroke="#64748b"
              strokeWidth="2"
              fill="none"
            />
            
            {/* Sample ports */}
            <circle cx="100" cy="100" r="4" fill="#0ea5e9" />
            <text x="105" y="95" fontSize="8" fill="#0f172a">Miami</text>
            
            <circle cx="180" cy="130" r="3" fill="#0ea5e9" />
            <text x="185" y="125" fontSize="8" fill="#0f172a">Cozumel</text>
            
            <circle cx="220" cy="110" r="3" fill="#0ea5e9" />
            <text x="225" y="105" fontSize="8" fill="#0f172a">Nassau</text>

            {/* Route line when cruise is hovered */}
            {hoveredCruiseData && (
              <g>
                <path
                  d="M 100 100 Q 140 120 180 130 Q 200 115 220 110 Q 160 95 100 100"
                  stroke="#f97316"
                  strokeWidth="3"
                  fill="none"
                  strokeDasharray="5,5"
                  className="animate-pulse"
                />
                <circle cx="100" cy="100" r="5" fill="#f97316" className="animate-pulse" />
                <circle cx="180" cy="130" r="5" fill="#f97316" className="animate-pulse" />
                <circle cx="220" cy="110" r="5" fill="#f97316" className="animate-pulse" />
              </g>
            )}
          </svg>
        </div>
      )}

      {/* Cruise Details Placeholder */}
      <div className="absolute bottom-0 left-0 right-0 bg-white border-t border-border-gray p-4">
        {hoveredCruiseData ? (
          <div>
            <div className="flex items-center justify-between mb-2">
              <h4 className="font-semibold text-charcoal">{hoveredCruiseData.shipName}</h4>
              <span className="text-lg font-bold text-sunset-orange">${hoveredCruiseData.priceFrom}</span>
            </div>
            <p className="text-sm text-slate-gray mb-2">
              {hoveredCruiseData.cruiseLine} • {hoveredCruiseData.duration} nights • {hoveredCruiseData.route}
            </p>
            <div className="text-xs text-ocean-blue">
              <strong>Ports:</strong> {hoveredCruiseData.ports.join(' → ')}
            </div>
          </div>
        ) : (
          <div className="text-center text-slate-gray">
            <p className="text-sm">Hover over a cruise to see route details</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default RouteMap;
