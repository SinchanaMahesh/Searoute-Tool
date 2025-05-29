
import React, { useEffect, useRef, useState } from 'react';
import { CruiseData } from '@/api/mockCruiseData';
import { Maximize2 } from 'lucide-react';
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

interface RouteMapProps {
  cruises: CruiseData[];
  hoveredCruise: string | null;
  selectedCruise?: string | null;
}

const RouteMap = ({ cruises, hoveredCruise, selectedCruise }: RouteMapProps) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const [map, setMap] = useState<Map | null>(null);
  const [vectorSource, setVectorSource] = useState<VectorSource | null>(null);
  const [isLargeView, setIsLargeView] = useState(false);
  
  // Use hovered cruise if available, otherwise use selected cruise, otherwise use first cruise
  const displayCruise = hoveredCruise 
    ? cruises.find(c => c.id === hoveredCruise)
    : selectedCruise 
    ? cruises.find(c => c.id === selectedCruise)
    : cruises.length > 0 ? cruises[0] : null;

  useEffect(() => {
    if (!mapRef.current) return;

    const vectorSourceInstance = new VectorSource();
    
    const vectorLayer = new VectorLayer({
      source: vectorSourceInstance,
    });

    // Initialize OpenLayers map
    const mapInstance = new Map({
      target: mapRef.current,
      layers: [
        new TileLayer({
          source: new OSM(),
        }),
        vectorLayer,
      ],
      view: new View({
        center: fromLonLat([-30, 35]), // Atlantic Ocean center
        zoom: 2,
      }),
    });

    setMap(mapInstance);
    setVectorSource(vectorSourceInstance);

    return () => {
      mapInstance.setTarget(undefined);
    };
  }, []);

  useEffect(() => {
    if (!map || !vectorSource || !displayCruise) return;

    // Clear existing features
    vectorSource.clear();

    // Add route for display cruise
    const coordinates = displayCruise.ports.map(port => 
      fromLonLat([port.coordinates[0], port.coordinates[1]])
    );
    
    // Create route line
    const routeFeature = new Feature({
      geometry: new LineString(coordinates),
    });
    
    routeFeature.setStyle(new Style({
      stroke: new Stroke({
        color: '#ff6b35',
        width: 3,
      }),
    }));
    
    vectorSource.addFeature(routeFeature);

    // Add port markers
    coordinates.forEach((coord, index) => {
      const pointFeature = new Feature({
        geometry: new Point(coord),
      });
      
      const color = index === 0 ? '#22c55e' : index === coordinates.length - 1 ? '#ef4444' : '#3b82f6';
      
      pointFeature.setStyle(new Style({
        image: new Circle({
          radius: 6,
          fill: new Fill({ color }),
          stroke: new Stroke({ color: 'white', width: 2 }),
        }),
      }));
      
      vectorSource.addFeature(pointFeature);
    });

    // Fit map to route
    if (coordinates.length > 0) {
      const extent = vectorSource.getExtent();
      map.getView().fit(extent, { padding: [50, 50, 50, 50] });
    }

  }, [map, vectorSource, displayCruise]);

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
