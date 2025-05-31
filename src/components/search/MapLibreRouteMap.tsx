
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
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // Use selectedCruise as primary, fallback to first cruise if none selected
  const displayCruise = selectedCruise 
    ? cruises.find(c => c.id === selectedCruise)
    : cruises.length > 0 ? cruises[0] : null;

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

  // Draw simplified map representation with land masses
  const drawMap = (canvas: HTMLCanvasElement) => {
    if (!canvas || !displayCruise) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const { width, height } = canvas;
    
    // Clear canvas
    ctx.clearRect(0, 0, width, height);
    
    // Draw ocean background
    const oceanGradient = ctx.createLinearGradient(0, 0, 0, height);
    oceanGradient.addColorStop(0, '#87CEEB');
    oceanGradient.addColorStop(1, '#4682B4');
    ctx.fillStyle = oceanGradient;
    ctx.fillRect(0, 0, width, height);
    
    // Draw simplified land masses (Caribbean region)
    ctx.fillStyle = '#8FBC8F';
    ctx.strokeStyle = '#556B2F';
    ctx.lineWidth = 1;
    
    // Simplified Caribbean islands representation
    const islands = [
      { x: width * 0.2, y: height * 0.3, w: width * 0.15, h: height * 0.1 }, // Cuba-like
      { x: width * 0.4, y: height * 0.4, w: width * 0.08, h: height * 0.06 }, // Jamaica-like
      { x: width * 0.6, y: height * 0.5, w: width * 0.12, h: height * 0.08 }, // Puerto Rico-like
      { x: width * 0.7, y: height * 0.6, w: width * 0.06, h: height * 0.04 }, // Dominican Republic-like
      { x: width * 0.8, y: height * 0.7, w: width * 0.04, h: height * 0.03 }, // Small island
    ];
    
    islands.forEach(island => {
      ctx.beginPath();
      ctx.ellipse(island.x, island.y, island.w, island.h, 0, 0, 2 * Math.PI);
      ctx.fill();
      ctx.stroke();
    });
    
    // Draw route using polyline coordinates if available
    if (displayCruise.polylineCoordinates && displayCruise.polylineCoordinates.length > 0) {
      ctx.strokeStyle = '#ff6b35';
      ctx.lineWidth = 3;
      ctx.lineCap = 'round';
      ctx.shadowColor = 'rgba(255, 107, 53, 0.3)';
      ctx.shadowBlur = 4;
      
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
      ctx.shadowBlur = 0; // Reset shadow
    }
    
    // Convert port coordinates and draw markers
    const canvasCoords = displayCruise.ports.map(port => 
      convertToCanvasCoords(port.coordinates[0], port.coordinates[1], width, height)
    );
    
    // Draw port markers with enhanced styling
    canvasCoords.forEach((coord, index) => {
      const port = displayCruise.ports[index];
      const color = index === 0 ? '#22c55e' : index === canvasCoords.length - 1 ? '#ef4444' : '#3b82f6';
      const radius = 8;
      
      // Port circle with glow effect
      ctx.fillStyle = color;
      ctx.strokeStyle = 'white';
      ctx.lineWidth = 2;
      ctx.shadowColor = color;
      ctx.shadowBlur = 6;
      
      ctx.beginPath();
      ctx.arc(coord.x, coord.y, radius, 0, 2 * Math.PI);
      ctx.fill();
      ctx.stroke();
      
      ctx.shadowBlur = 0; // Reset shadow
      
      // Port label for start and end ports
      if (index === 0 || index === canvasCoords.length - 1) {
        ctx.fillStyle = '#333';
        ctx.font = '10px Arial';
        ctx.textAlign = 'center';
        ctx.fillText(
          index === 0 ? 'Start' : 'End', 
          coord.x, 
          coord.y - radius - 5
        );
      }
    });
  };

  // Draw on canvas when cruise changes
  useEffect(() => {
    if (canvasRef.current) {
      drawMap(canvasRef.current);
    }
  }, [displayCruise]);

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

        <canvas 
          ref={canvasRef}
          width={400}
          height={280}
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
