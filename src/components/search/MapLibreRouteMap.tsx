
import React, { useEffect, useRef, useState } from 'react';
import { CruiseData } from '@/api/mockCruiseData';
import { Maximize2, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import LocationInsightsModal from './LocationInsightsModal';

interface MapLibreRouteMapProps {
  cruises: CruiseData[];
  hoveredCruise: string | null;
  selectedCruise?: string | null;
  onLocationClick?: (locationName: string, insights: any) => void;
}

const MapLibreRouteMap = ({ cruises, hoveredCruise, selectedCruise, onLocationClick }: MapLibreRouteMapProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const largeCanvasRef = useRef<HTMLCanvasElement>(null);
  const [isLargeView, setIsLargeView] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState<any>(null);
  const [isLocationModalOpen, setIsLocationModalOpen] = useState(false);
  
  // Use selectedCruise as primary, fallback to first cruise if none selected
  const displayCruise = selectedCruise 
    ? cruises.find(c => c.id === selectedCruise)
    : cruises.length > 0 ? cruises[0] : null;

  // Handle escape key for large view
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (isLargeView) {
          setIsLargeView(false);
        }
        if (isLocationModalOpen) {
          setIsLocationModalOpen(false);
        }
      }
    };

    document.addEventListener('keydown', handleEscape);
    
    if (isLargeView) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isLargeView, isLocationModalOpen]);

  // Convert real coordinates to canvas coordinates
  const convertToCanvasCoords = (longitude: number, latitude: number, canvasWidth: number, canvasHeight: number) => {
    if (!displayCruise || displayCruise.ports.length === 0) {
      return { x: canvasWidth / 2, y: canvasHeight / 2 };
    }

    const ports = displayCruise.ports;
    const lons = ports.map(p => p.coordinates[0]);
    const lats = ports.map(p => p.coordinates[1]);
    
    const minLon = Math.min(...lons) - 2;
    const maxLon = Math.max(...lons) + 2;
    const minLat = Math.min(...lats) - 2;
    const maxLat = Math.max(...lats) + 2;
    
    const x = ((longitude - minLon) / (maxLon - minLon)) * canvasWidth;
    const y = canvasHeight - ((latitude - minLat) / (maxLat - minLat)) * canvasHeight;
    
    return { x, y };
  };

  // Draw map on canvas with polyline support
  const drawMap = (canvas: HTMLCanvasElement, isLarge: boolean = false) => {
    if (!canvas || !displayCruise) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const { width, height } = canvas;
    
    // Clear canvas
    ctx.clearRect(0, 0, width, height);
    
    // Draw background (ocean)
    const gradient = ctx.createLinearGradient(0, 0, 0, height);
    gradient.addColorStop(0, '#e0f2fe');
    gradient.addColorStop(1, '#0284c7');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);
    
    // Draw route using polyline coordinates if available
    if (displayCruise.polylineCoordinates && displayCruise.polylineCoordinates.length > 0) {
      ctx.strokeStyle = '#ff6b35';
      ctx.lineWidth = isLarge ? 4 : 3;
      ctx.lineCap = 'round';
      
      ctx.beginPath();
      
      displayCruise.polylineCoordinates.forEach((coord, index) => {
        const canvasCoord = convertToCanvasCoords(coord[0], coord[1], width, height);
        
        if (index === 0) {
          ctx.moveTo(canvasCoord.x, canvasCoord.y);
        } else {
          ctx.lineTo(canvasCoord.x, canvasCoord.y);
        }
      });
      
      ctx.stroke();
    }
    
    // Convert port coordinates and draw markers
    const canvasCoords = displayCruise.ports.map(port => 
      convertToCanvasCoords(port.coordinates[0], port.coordinates[1], width, height)
    );
    
    // Draw port markers
    canvasCoords.forEach((coord, index) => {
      const port = displayCruise.ports[index];
      const color = index === 0 ? '#22c55e' : index === canvasCoords.length - 1 ? '#ef4444' : '#3b82f6';
      const radius = isLarge ? 12 : 8;
      
      // Port circle
      ctx.fillStyle = color;
      ctx.strokeStyle = 'white';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(coord.x, coord.y, radius, 0, 2 * Math.PI);
      ctx.fill();
      ctx.stroke();
      
      // Port label (only on large view)
      if (isLarge) {
        ctx.fillStyle = '#1f2937';
        ctx.font = '12px Arial';
        ctx.textAlign = 'center';
        ctx.fillText(port.name, coord.x, coord.y + radius + 15);
      }
      
      // Store port info for click detection
      (coord as any).port = port;
      (coord as any).radius = radius;
    });
    
    // Store coordinates for click detection
    (canvas as any).portCoords = canvasCoords;
  };

  // Handle canvas click for location insights
  const handleCanvasClick = (event: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isLargeView) return;
    
    const canvas = event.currentTarget;
    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    
    const portCoords = (canvas as any).portCoords || [];
    
    // Check if click is on a port
    for (const coord of portCoords) {
      const distance = Math.sqrt(Math.pow(x - coord.x, 2) + Math.pow(y - coord.y, 2));
      if (distance <= (coord as any).radius + 5) {
        const port = (coord as any).port;
        
        if (port.insights) {
          setSelectedLocation({
            name: port.name,
            insights: port.insights
          });
          setIsLocationModalOpen(true);
          
          // Call the optional callback
          if (onLocationClick) {
            onLocationClick(port.name, port.insights);
          }
        }
        break;
      }
    }
  };

  // Draw on canvas when cruise changes
  useEffect(() => {
    if (canvasRef.current) {
      drawMap(canvasRef.current);
    }
  }, [displayCruise]);

  useEffect(() => {
    if (largeCanvasRef.current && isLargeView) {
      drawMap(largeCanvasRef.current, true);
    }
  }, [displayCruise, isLargeView]);

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
              onClick={() => setIsLargeView(true)}
              className="text-ocean-blue border-ocean-blue hover:bg-ocean-blue hover:text-white h-6 w-6 p-0"
            >
              <Maximize2 className="w-3 h-3" />
            </Button>
          </div>
        </div>

        <canvas 
          ref={canvasRef}
          width={400}
          height={280}
          className="absolute inset-0 pt-12 w-full h-full cursor-pointer"
          style={{ width: '100%', height: 'calc(100% - 48px)', marginTop: '48px' }}
        />
      </div>

      {/* Large View Modal */}
      {isLargeView && (
        <>
          <div 
            className="fixed inset-0 bg-black/50 z-[999998]" 
            onClick={() => setIsLargeView(false)}
          />
          
          <div className="fixed inset-0 z-[999999] flex items-center justify-center p-4 pointer-events-none">
            <div className="bg-white rounded-lg w-full h-full max-w-7xl max-h-[95vh] flex flex-col relative pointer-events-auto shadow-2xl">
              <div className="p-4 border-b border-border-gray flex justify-between items-center bg-white relative z-[1000000]">
                <div>
                  <h3 className="font-semibold text-charcoal">Interactive Route Map</h3>
                  <p className="text-sm text-slate-gray mt-1">Click on ports to view location insights</p>
                </div>
                <Button
                  variant="outline"
                  onClick={() => setIsLargeView(false)}
                  className="text-slate-gray h-8 w-8 p-0"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
              
              <div className="flex-1 relative overflow-hidden">
                <canvas 
                  ref={largeCanvasRef}
                  width={800}
                  height={600}
                  onClick={handleCanvasClick}
                  className="w-full h-full cursor-pointer"
                  style={{ width: '100%', height: '100%' }}
                />
              </div>
              
              {displayCruise && (
                <div className="border-t border-border-gray bg-light-gray p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h5 className="font-medium text-charcoal">{displayCruise.shipName}</h5>
                      <p className="text-sm text-slate-gray">{displayCruise.route} • {displayCruise.duration} days</p>
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
        </>
      )}

      <LocationInsightsModal
        isOpen={isLocationModalOpen}
        onClose={() => setIsLocationModalOpen(false)}
        locationName={selectedLocation?.name || ''}
        insights={selectedLocation?.insights || null}
      />
    </>
  );
};

export default MapLibreRouteMap;
