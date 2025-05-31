
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { CruiseData } from '@/api/mockCruiseData';
import { Maximize2, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface LeafletSearchMapProps {
  cruises: CruiseData[];
  hoveredCruise: string | null;
  selectedCruise?: string | null;
  onLocationClick?: (locationName: string, insights: any) => void;
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
  const mapRef = useRef<any>(null);
  const modalMapRef = useRef<any>(null);
  const drawnLayersRef = useRef<any>(null);
  const modalDrawnLayersRef = useRef<any>(null);
  
  // Use selectedCruise as primary, fallback to first cruise if none selected
  const displayCruise = selectedCruise 
    ? cruises.find(c => c.id === selectedCruise)
    : cruises.length > 0 ? cruises[0] : null;

  // Predefined ports (from mockCruiseData)
  const ports = [
    { id: 'port_miami', name: 'Miami', lat: 25.7617, lng: -80.1918 },
    { id: 'port_nassau', name: 'Nassau', lat: 25.0343, lng: -77.3554 },
    { id: 'port_st_thomas', name: 'St. Thomas', lat: 18.3381, lng: -64.9306 },
    { id: 'port_barbados', name: 'Barbados', lat: 13.1939, lng: -59.5432 },
    { id: 'port_kingston', name: 'Kingston, Jamaica', lat: 17.9712, lng: -76.7936 },
    { id: 'port_cozumel', name: 'Cozumel, Mexico', lat: 20.4230, lng: -86.9223 },
  ];

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
        .bindPopup(`<b>${port.name}</b><br>Port`);
      
      // Add click handler
      if (onLocationClick) {
        marker.on('click', () => {
          onLocationClick(port.name, { port });
        });
      }
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
  }, [onLocationClick, loadSavedRoutes]);

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

    // Draw the route
    drawRouteOnMap(mapRef.current, displayCruise, drawnLayersRef.current);

  }, [isLeafletLoaded, displayCruise, drawRouteOnMap]);

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

      {/* Large View Modal */}
      {isModalOpen && (
        <div 
          className="fixed inset-0 z-[99999] bg-black/60" 
          style={{ 
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            zIndex: 99999
          }}
        >
          <div 
            className="absolute inset-0 flex items-center justify-center p-4" 
            style={{ 
              position: 'absolute',
              inset: 0,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '1rem'
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
                boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)'
              }}
            >
              {/* Header */}
              <div className="p-4 border-b border-border-gray flex justify-between items-center bg-white relative z-10">
                <div>
                  <h3 className="font-semibold text-charcoal">Interactive Route Map</h3>
                  <p className="text-sm text-slate-gray mt-1">Detailed view of cruise route with saved maritime paths</p>
                </div>
                <Button
                  variant="outline"
                  onClick={() => setIsModalOpen(false)}
                  className="text-slate-gray h-8 w-8 p-0"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
              
              {/* Map Content */}
              <div className="flex-1 relative overflow-hidden bg-white">
                <div 
                  id="modal-route-map" 
                  className="w-full h-full bg-gray-200 flex items-center justify-center text-gray-500"
                  style={{ width: '100%', height: '100%' }}
                >
                  {!isLeafletLoaded && (
                    <div className="flex flex-col items-center">
                      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-ocean-blue"></div>
                      <p className="mt-4 text-lg">Loading detailed map...</p>
                    </div>
                  )}
                </div>
              </div>
              
              {/* Bottom Panel - Cruise Information */}
              {displayCruise && (
                <div className="border-t border-border-gray bg-light-gray p-4 relative z-10">
                  <div className="flex items-center justify-between">
                    <div>
                      <h5 className="font-medium text-charcoal">{displayCruise.shipName}</h5>
                      <p className="text-sm text-slate-gray">{displayCruise.route} • {displayCruise.duration} days</p>
                      <div className="flex gap-2 mt-1">
                        {displayCruise.ports.map((port, index) => (
                          <span
                            key={index}
                            className="px-2 py-1 rounded-full text-xs font-medium bg-white text-slate-gray"
                          >
                            {port.name}
                          </span>
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
