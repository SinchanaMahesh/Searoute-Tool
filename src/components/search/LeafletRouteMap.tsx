
import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { CruiseData } from '@/api/mockCruiseData';

// Fix for default markers in Leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
});

interface LeafletRouteMapProps {
  cruise: CruiseData;
  height?: string;
  onPortClick?: (portName: string, port: any) => void;
  className?: string;
}

const LeafletRouteMap = ({ cruise, height = '300px', onPortClick, className = '' }: LeafletRouteMapProps) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<L.Map | null>(null);
  const markersRef = useRef<L.Marker[]>([]);
  const routeLineRef = useRef<L.Polyline | null>(null);

  useEffect(() => {
    if (!mapContainer.current || !cruise) return;

    // Initialize map
    map.current = L.map(mapContainer.current, {
      zoomControl: true,
      attributionControl: false
    });

    // Add OpenStreetMap tiles
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors'
    }).addTo(map.current);

    // Clear existing markers and routes
    markersRef.current.forEach(marker => marker.remove());
    markersRef.current = [];
    if (routeLineRef.current) {
      routeLineRef.current.remove();
    }

    if (cruise.ports && cruise.ports.length > 0) {
      const bounds = L.latLngBounds([]);

      // Add port markers
      cruise.ports.forEach((port, index) => {
        const [lng, lat] = port.coordinates;
        const latLng = L.latLng(lat, lng);
        bounds.extend(latLng);

        // Create custom icon based on port type
        let iconColor = '#3b82f6'; // Blue for intermediate ports
        if (index === 0) iconColor = '#22c55e'; // Green for start
        if (index === cruise.ports.length - 1) iconColor = '#ef4444'; // Red for end

        const customIcon = L.divIcon({
          html: `<div style="background-color: ${iconColor}; width: 16px; height: 16px; border-radius: 50%; border: 2px solid white; box-shadow: 0 2px 4px rgba(0,0,0,0.3);"></div>`,
          iconSize: [16, 16],
          iconAnchor: [8, 8],
          className: 'custom-port-marker'
        });

        const marker = L.marker(latLng, { icon: customIcon }).addTo(map.current!);
        
        // Add popup
        marker.bindPopup(`<b>${port.name}</b><br/>Click for more details`);
        
        // Add click handler
        if (onPortClick) {
          marker.on('click', () => {
            onPortClick(port.name, port);
          });
        }

        markersRef.current.push(marker);
      });

      // Draw route using polylineCoordinates if available, otherwise connect ports in order
      if (cruise.polylineCoordinates && cruise.polylineCoordinates.length > 0) {
        const routeCoords = cruise.polylineCoordinates.map(coord => L.latLng(coord[1], coord[0]));
        routeLineRef.current = L.polyline(routeCoords, {
          color: '#ff6b35',
          weight: 3,
          opacity: 0.8
        }).addTo(map.current);
      } else {
        // Fallback: connect ports in order
        const routeCoords = cruise.ports.map(port => L.latLng(port.coordinates[1], port.coordinates[0]));
        routeLineRef.current = L.polyline(routeCoords, {
          color: '#ff6b35',
          weight: 3,
          opacity: 0.8
        }).addTo(map.current);
      }

      // Fit map to show all ports with padding
      if (bounds.isValid()) {
        map.current.fitBounds(bounds, { padding: [20, 20] });
      }
    }

    return () => {
      if (map.current) {
        map.current.remove();
        map.current = null;
      }
    };
  }, [cruise, onPortClick]);

  return (
    <div 
      ref={mapContainer}
      className={`w-full ${className}`}
      style={{ height }}
    />
  );
};

export default LeafletRouteMap;
