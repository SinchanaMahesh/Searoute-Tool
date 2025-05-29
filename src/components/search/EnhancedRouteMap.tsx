
import React, { useEffect, useRef, useState } from 'react';
import { CruiseData } from '@/api/mockCruiseData';
import { Maximize2, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Map from 'ol/Map';
import View from 'ol/View';
import TileLayer from 'ol/layer/Tile';
import OSM from 'ol/source/OSM';
import VectorLayer from 'ol/layer/Vector';
import VectorSource from 'ol/source/Vector';
import Feature from 'ol/Feature';
import Point from 'ol/geom/Point';
import LineString from 'ol/geom/LineString';
import { Style, Circle, Fill, Stroke } from 'ol/style';
import { fromLonLat } from 'ol/proj';
import 'ol/ol.css';

interface EnhancedRouteMapProps {
  cruises: CruiseData[];
  hoveredCruise: string | null;
  selectedCruise?: string | null;
}

// Helper function to create curved sea routes
const createSeaRoute = (startCoord: number[], endCoord: number[]) => {
  const [startLon, startLat] = startCoord;
  const [endLon, endLat] = endCoord;
  
  // Calculate midpoint
  const midLon = (startLon + endLon) / 2;
  const midLat = (startLat + endLat) / 2;
  
  // Calculate distance to determine curve depth
  const distance = Math.sqrt(Math.pow(endLon - startLon, 2) + Math.pow(endLat - startLat, 2));
  
  // Create curve points - push the route deeper into the sea
  const curveDepth = distance * 0.3; // 30% of distance for curve depth
  
  // Determine if we should curve north or south based on route
  const shouldCurveNorth = midLat > 0; // Northern hemisphere curves north, southern curves south
  const curveFactor = shouldCurveNorth ? 1 : -1;
  
  // Create multiple intermediate points for smooth curve
  const points = [];
  points.push(fromLonLat([startLon, startLat]));
  
  // Add curve points
  for (let i = 1; i <= 3; i++) {
    const ratio = i / 4;
    const curveRatio = Math.sin(ratio * Math.PI); // Sine curve for natural arc
    
    const curveLon = startLon + (endLon - startLon) * ratio;
    let curveLat = startLat + (endLat - startLat) * ratio;
    
    // Add curve offset to push into sea
    curveLat += curveDepth * curveRatio * curveFactor;
    
    points.push(fromLonLat([curveLon, curveLat]));
  }
  
  points.push(fromLonLat([endLon, endLat]));
  
  return points;
};

const EnhancedRouteMap = ({ cruises, hoveredCruise, selectedCruise }: EnhancedRouteMapProps) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const largeMapRef = useRef<HTMLDivElement>(null);
  const [map, setMap] = useState<Map | null>(null);
  const [largeMap, setLargeMap] = useState<Map | null>(null);
  const [vectorSource, setVectorSource] = useState<VectorSource | null>(null);
  const [largeVectorSource, setLargeVectorSource] = useState<VectorSource | null>(null);
  const [isLargeView, setIsLargeView] = useState(false);
  
  // Use hovered cruise if available, otherwise use selected cruise, otherwise use first cruise
  const displayCruise = hoveredCruise 
    ? cruises.find(c => c.id === hoveredCruise)
    : selectedCruise 
    ? cruises.find(c => c.id === selectedCruise)
    : cruises.length > 0 ? cruises[0] : null;

  // Handle escape key to close large view
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isLargeView) {
        setIsLargeView(false);
      }
    };

    if (isLargeView) {
      document.addEventListener('keydown', handleEscape);
      return () => document.removeEventListener('keydown', handleEscape);
    }
  }, [isLargeView]);

  // Initialize main map
  useEffect(() => {
    if (!mapRef.current) return;

    const vectorSourceInstance = new VectorSource();
    
    const vectorLayer = new VectorLayer({
      source: vectorSourceInstance,
    });

    const mapInstance = new Map({
      target: mapRef.current,
      layers: [
        new TileLayer({
          source: new OSM(),
        }),
        vectorLayer,
      ],
      view: new View({
        center: fromLonLat([10, 50]),
        zoom: 3,
      }),
    });

    setMap(mapInstance);
    setVectorSource(vectorSourceInstance);

    return () => {
      mapInstance.setTarget(undefined);
    };
  }, []);

  // Initialize large map when opened
  useEffect(() => {
    if (!largeMapRef.current || !isLargeView) return;

    const vectorSourceInstance = new VectorSource();
    
    const vectorLayer = new VectorLayer({
      source: vectorSourceInstance,
    });

    const mapInstance = new Map({
      target: largeMapRef.current,
      layers: [
        new TileLayer({
          source: new OSM(),
        }),
        vectorLayer,
      ],
      view: new View({
        center: fromLonLat([10, 50]),
        zoom: 3,
      }),
    });

    setLargeMap(mapInstance);
    setLargeVectorSource(vectorSourceInstance);

    return () => {
      mapInstance.setTarget(undefined);
      setLargeMap(null);
      setLargeVectorSource(null);
    };
  }, [isLargeView]);

  // Update both maps when cruise changes
  useEffect(() => {
    const updateMap = (mapInstance: Map | null, vectorSourceInstance: VectorSource | null) => {
      if (!mapInstance || !vectorSourceInstance || !displayCruise) return;

      // Clear existing features
      vectorSourceInstance.clear();

      // Add route for display cruise with curved sea routes
      const ports = displayCruise.ports;
      
      for (let i = 0; i < ports.length - 1; i++) {
        const startPort = ports[i];
        const endPort = ports[i + 1];
        
        // Create curved sea route
        const routePoints = createSeaRoute(startPort.coordinates, endPort.coordinates);
        
        const routeFeature = new Feature({
          geometry: new LineString(routePoints),
        });
        
        routeFeature.setStyle(new Style({
          stroke: new Stroke({
            color: '#ff6b35',
            width: 3,
          }),
        }));
        
        vectorSourceInstance.addFeature(routeFeature);
      }

      // Add port markers
      ports.forEach((port, index) => {
        const coord = fromLonLat([port.coordinates[0], port.coordinates[1]]);
        const pointFeature = new Feature({
          geometry: new Point(coord),
        });
        
        const color = index === 0 ? '#22c55e' : index === ports.length - 1 ? '#ef4444' : '#3b82f6';
        
        pointFeature.setStyle(new Style({
          image: new Circle({
            radius: 6,
            fill: new Fill({ color }),
            stroke: new Stroke({ color: 'white', width: 2 }),
          }),
        }));
        
        vectorSourceInstance.addFeature(pointFeature);
      });

      // Fit map to route
      if (ports.length > 0) {
        const extent = vectorSourceInstance.getExtent();
        mapInstance.getView().fit(extent, { padding: [20, 20, 20, 20] });
      }
    };

    // Update main map
    updateMap(map, vectorSource);
    
    // Update large map if it's open
    if (isLargeView) {
      updateMap(largeMap, largeVectorSource);
    }

  }, [map, vectorSource, largeMap, largeVectorSource, displayCruise, isLargeView]);

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

        {/* Map Container */}
        <div ref={mapRef} className="absolute inset-0 pt-12" />
      </div>

      {/* Large View Modal - Highest z-index */}
      {isLargeView && (
        <div className="fixed inset-0 bg-black/50 z-[9999] flex items-center justify-center p-4">
          <div className="bg-white rounded-lg w-full h-full max-w-6xl max-h-[90vh] flex flex-col relative">
            <div className="p-4 border-b border-border-gray flex justify-between items-center relative z-[10000]">
              <h3 className="font-semibold text-charcoal">Route Map - Large View</h3>
              <Button
                variant="outline"
                onClick={() => setIsLargeView(false)}
                className="text-slate-gray h-8 w-8 p-0"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
            <div className="flex-1 relative">
              <div ref={largeMapRef} className="w-full h-full" />
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default EnhancedRouteMap;
