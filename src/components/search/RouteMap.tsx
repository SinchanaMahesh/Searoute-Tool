
import React, { useEffect, useRef, useState } from 'react';
import { CruiseData } from '@/api/mockCruiseData';
import { Maximize2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix for default markers in Leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

interface RouteMapProps {
  cruises: CruiseData[];
  hoveredCruise: string | null;
  selectedCruise?: string | null;
}

const RouteMap = ({ cruises, hoveredCruise, selectedCruise }: RouteMapProps) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const [map, setMap] = useState<L.Map | null>(null);
  const [routeLine, setRouteLine] = useState<L.Polyline | null>(null);
  const [markers, setMarkers] = useState<L.Marker[]>([]);
  const [isLargeView, setIsLargeView] = useState(false);
  
  // Use hovered cruise if available, otherwise use selected cruise, otherwise use first cruise
  const displayCruise = hoveredCruise 
    ? cruises.find(c => c.id === hoveredCruise)
    : selectedCruise 
    ? cruises.find(c => c.id === selectedCruise)
    : cruises.length > 0 ? cruises[0] : null;

  useEffect(() => {
    if (!mapRef.current) return;

    // Initialize Leaflet map
    const mapInstance = L.map(mapRef.current, {
      center: [35, -30], // Atlantic Ocean center
      zoom: 2,
      zoomControl: true,
      scrollWheelZoom: true
    });

    // Add OpenStreetMap tiles
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors'
    }).addTo(mapInstance);

    setMap(mapInstance);

    return () => {
      mapInstance.remove();
    };
  }, []);

  useEffect(() => {
    if (!map || !displayCruise) return;

    // Clear existing route and markers
    if (routeLine) {
      map.removeLayer(routeLine);
      setRouteLine(null);
    }
    
    markers.forEach(marker => map.removeLayer(marker));
    setMarkers([]);

    // Add route for display cruise - use coordinates directly from the port objects
    const coordinates = displayCruise.ports.map(port => port.coordinates);
    const latLngCoordinates = coordinates.map(coord => [coord[1], coord[0]] as L.LatLngTuple);
    
    // Create route line
    const polyline = L.polyline(latLngCoordinates, {
      color: '#ff6b35',
      weight: 3,
      opacity: 0.8
    }).addTo(map);
    
    setRouteLine(polyline);

    // Add port markers
    const newMarkers: L.Marker[] = [];
    coordinates.forEach((coord, index) => {
      const icon = L.divIcon({
        className: 'custom-cruise-marker',
        html: `<div style="
          width: 12px; 
          height: 12px; 
          border-radius: 50%; 
          background-color: ${index === 0 ? '#22c55e' : index === coordinates.length - 1 ? '#ef4444' : '#3b82f6'};
          border: 2px solid white;
          box-shadow: 0 2px 4px rgba(0,0,0,0.3);
        "></div>`,
        iconSize: [12, 12],
        iconAnchor: [6, 6]
      });

      const marker = L.marker([coord[1], coord[0]], { icon })
        .bindPopup(displayCruise.ports[index].name)
        .addTo(map);
      
      newMarkers.push(marker);
    });
    
    setMarkers(newMarkers);

    // Fit map to route
    if (latLngCoordinates.length > 0) {
      map.fitBounds(polyline.getBounds(), { padding: [50, 50] });
    }

  }, [map, displayCruise]);

  return (
    <div className="h-full bg-gradient-to-br from-blue-50 to-blue-100 relative overflow-hidden">
      {/* Compact Map Header - Reduced size */}
      <div className="absolute top-0 left-0 right-0 bg-white/90 backdrop-blur-sm p-2 border-b border-border-gray z-10">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-medium text-charcoal text-sm">Refine your search</h3>
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
            className="text-ocean-blue border-ocean-blue hover:bg-ocean-blue hover:text-white"
          >
            <Maximize2 className="w-3 h-3" />
          </Button>
        </div>
      </div>

      {/* Map Container */}
      <div ref={mapRef} className="absolute inset-0 pt-16 pb-16" />

      {/* Cruise Details - Compact at bottom */}
      <div className="absolute bottom-0 left-0 right-0 bg-white border-t border-border-gray p-2 z-10">
        {displayCruise ? (
          <div>
            <div className="flex items-center justify-between mb-1">
              <h4 className="font-semibold text-charcoal text-sm">{displayCruise.shipName}</h4>
              <span className="text-sm font-bold text-sunset-orange">${displayCruise.priceFrom}</span>
            </div>
            <p className="text-xs text-slate-gray">
              {displayCruise.cruiseLine} • {displayCruise.duration} nights
            </p>
          </div>
        ) : (
          <div className="text-center text-slate-gray">
            <p className="text-xs">Hover over a cruise to see route details</p>
          </div>
        )}
      </div>

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

export default RouteMap;
