
import React, { useEffect, useRef, useState } from 'react';
import { CruiseData } from '@/api/mockCruiseData';
import { Maximize2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import EnhancedModalMap from './EnhancedModalMap';

interface MapLibreRouteMapProps {
  cruises: CruiseData[];
  hoveredCruise: string | null;
  selectedCruise?: string | null;
  onLocationClick?: (locationName: string, insights: any) => void;
}

const MapLibreRouteMap = ({ cruises, hoveredCruise, selectedCruise, onLocationClick }: MapLibreRouteMapProps) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [maplibre, setMaplibre] = useState<any>(null);
  
  // Use selectedCruise as primary, fallback to first cruise if none selected
  const displayCruise = selectedCruise 
    ? cruises.find(c => c.id === selectedCruise)
    : cruises.length > 0 ? cruises[0] : null;

  // Load MapLibre GL JS dynamically
  useEffect(() => {
    const loadMapLibre = async () => {
      try {
        const maplibregl = await import('maplibre-gl');
        setMaplibre(maplibregl.default);
      } catch (error) {
        console.error('Failed to load MapLibre GL:', error);
      }
    };
    loadMapLibre();
  }, []);

  // Initialize map
  useEffect(() => {
    if (!maplibre || !mapContainer.current || !displayCruise) return;

    // Calculate bounds for the cruise route
    const coordinates = displayCruise.ports.map(port => port.coordinates);
    const lngs = coordinates.map(coord => coord[0]);
    const lats = coordinates.map(coord => coord[1]);
    
    const minLng = Math.min(...lngs) - 1;
    const maxLng = Math.max(...lngs) + 1;
    const minLat = Math.min(...lats) - 1;
    const maxLat = Math.max(...lats) + 1;
    
    const centerLng = (minLng + maxLng) / 2;
    const centerLat = (minLat + maxLat) / 2;

    // Initialize the map
    map.current = new maplibre.Map({
      container: mapContainer.current,
      style: {
        version: 8,
        sources: {
          'osm': {
            type: 'raster',
            tiles: [
              'https://a.tile.openstreetmap.org/{z}/{x}/{y}.png',
              'https://b.tile.openstreetmap.org/{z}/{x}/{y}.png',
              'https://c.tile.openstreetmap.org/{z}/{x}/{y}.png'
            ],
            tileSize: 256,
            attribution: '© OpenStreetMap contributors'
          }
        },
        layers: [
          {
            id: 'osm-tiles',
            type: 'raster',
            source: 'osm',
            minzoom: 0,
            maxzoom: 19
          }
        ]
      },
      center: [centerLng, centerLat],
      zoom: 4,
      attributionControl: false
    });

    map.current.on('load', () => {
      // Add route line if available
      if (displayCruise.polylineCoordinates && displayCruise.polylineCoordinates.length > 0) {
        map.current.addSource('route', {
          type: 'geojson',
          data: {
            type: 'Feature',
            properties: {},
            geometry: {
              type: 'LineString',
              coordinates: displayCruise.polylineCoordinates
            }
          }
        });

        map.current.addLayer({
          id: 'route-line',
          type: 'line',
          source: 'route',
          layout: {
            'line-join': 'round',
            'line-cap': 'round'
          },
          paint: {
            'line-color': '#ff6b35',
            'line-width': 3
          }
        });
      }

      // Add port markers
      displayCruise.ports.forEach((port, index) => {
        const color = index === 0 ? '#22c55e' : index === displayCruise.ports.length - 1 ? '#ef4444' : '#3b82f6';
        
        const el = document.createElement('div');
        el.className = 'cruise-port-marker';
        el.style.cssText = `
          background-color: ${color};
          width: 16px;
          height: 16px;
          border-radius: 50%;
          border: 2px solid white;
          box-shadow: 0 2px 4px rgba(0,0,0,0.3);
          cursor: pointer;
        `;

        const marker = new maplibre.Marker({ element: el })
          .setLngLat(port.coordinates)
          .addTo(map.current);

        // Add click handler
        el.addEventListener('click', () => {
          if (onLocationClick) {
            onLocationClick(port.name, { port });
          }
        });
      });

      // Fit map to show all ports with padding
      const bounds = new maplibre.LngLatBounds();
      displayCruise.ports.forEach(port => {
        bounds.extend(port.coordinates);
      });
      
      map.current.fitBounds(bounds, {
        padding: { top: 20, bottom: 20, left: 20, right: 20 }
      });
    });

    return () => {
      if (map.current) {
        map.current.remove();
      }
    };
  }, [maplibre, displayCruise, onLocationClick]);

  return (
    <>
      <div className="h-full bg-gradient-to-br from-blue-50 to-blue-100 relative overflow-hidden">
        {/* Compact Map Header */}
        <div className="absolute top-0 left-0 right-0 bg-white/95 backdrop-blur-sm p-2 border-b border-border-gray z-20">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-medium text-charcoal text-xs">Route Map</h3>
              <p className="text-xs text-slate-gray">
                {displayCruise 
                  ? `${displayCruise.shipName} - ${displayCruise.ports.length} ports` 
                  : 'Click a cruise to view its route'}
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

        <div 
          ref={mapContainer}
          className="absolute inset-0 pt-12 w-full h-full cursor-pointer"
          style={{ width: '100%', height: 'calc(100% - 48px)', marginTop: '48px' }}
          onClick={() => setIsModalOpen(true)}
        />
      </div>

      <EnhancedModalMap
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        cruises={cruises}
        selectedCruise={selectedCruise}
      />
    </>
  );
};

export default MapLibreRouteMap;
