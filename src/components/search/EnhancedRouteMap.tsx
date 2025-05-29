
import React, { useEffect, useRef, useState } from 'react';
import { CruiseData } from '@/api/mockCruiseData';
import { Maximize2, X, Cloud, MapPin, Info } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface EnhancedRouteMapProps {
  cruises: CruiseData[];
  hoveredCruise: string | null;
  selectedCruise?: string | null;
}

interface LocationInfo {
  name: string;
  weather: string;
  temperature: string;
  places: string[];
  trivia: string;
}

// Sample location data
const locationData: Record<string, LocationInfo> = {
  'Miami': {
    name: 'Miami, Florida',
    weather: 'Sunny',
    temperature: '82°F',
    places: ['South Beach', 'Art Deco District', 'Wynwood Walls', 'Vizcaya Museum'],
    trivia: 'Miami is known as the "Magic City" due to its rapid growth in the early 20th century.'
  },
  'Nassau': {
    name: 'Nassau, Bahamas',
    weather: 'Partly Cloudy',
    temperature: '78°F',
    places: ['Paradise Island', 'Atlantis Resort', 'Cable Beach', 'Fort Charlotte'],
    trivia: 'Nassau was once a haven for pirates in the 18th century and is named after William III of Orange-Nassau.'
  },
  'St. Thomas': {
    name: 'St. Thomas, USVI',
    weather: 'Tropical',
    temperature: '85°F',
    places: ['Magens Bay', 'Coral World', 'Paradise Point', 'Blackbeard\'s Castle'],
    trivia: 'St. Thomas is famous for duty-free shopping and has one of the most beautiful beaches in the world.'
  },
  'Barbados': {
    name: 'Barbados',
    weather: 'Sunny',
    temperature: '83°F',
    places: ['Harrison\'s Cave', 'Animal Flower Cave', 'Rum Distilleries', 'Crane Beach'],
    trivia: 'Barbados is the birthplace of rum and has been producing it for over 350 years.'
  }
};

// Convert real coordinates to canvas coordinates
const convertToCanvasCoords = (longitude: number, latitude: number, canvasWidth: number, canvasHeight: number) => {
  // Caribbean region bounds: roughly -85 to -60 longitude, 10 to 30 latitude
  const minLon = -85;
  const maxLon = -60;
  const minLat = 10;
  const maxLat = 30;
  
  const x = ((longitude - minLon) / (maxLon - minLon)) * canvasWidth;
  const y = canvasHeight - ((latitude - minLat) / (maxLat - minLat)) * canvasHeight;
  
  return { x, y };
};

// Helper function to create curved sea routes avoiding land
const createSeaRoute = (start: { x: number; y: number }, end: { x: number; y: number }) => {
  const controlPoints = [];
  const distance = Math.sqrt(Math.pow(end.x - start.x, 2) + Math.pow(end.y - start.y, 2));
  const curveDepth = distance * 0.3;
  
  // Create curve points
  for (let i = 0; i <= 10; i++) {
    const t = i / 10;
    const x = start.x + (end.x - start.x) * t;
    const y = start.y + (end.y - start.y) * t;
    
    // Add curve offset (simulate going around land)
    const curveOffset = Math.sin(t * Math.PI) * curveDepth;
    const curvedY = y + curveOffset;
    
    controlPoints.push({ x, y: curvedY });
  }
  
  return controlPoints;
};

const EnhancedRouteMap = ({ cruises, hoveredCruise, selectedCruise }: EnhancedRouteMapProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const largeCanvasRef = useRef<HTMLCanvasElement>(null);
  const [isLargeView, setIsLargeView] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState<LocationInfo | null>(null);
  const [clickedPort, setClickedPort] = useState<string | null>(null);
  
  const displayCruise = hoveredCruise 
    ? cruises.find(c => c.id === hoveredCruise)
    : selectedCruise 
    ? cruises.find(c => c.id === selectedCruise)
    : cruises.length > 0 ? cruises[0] : null;

  // Initialize location info with first port
  useEffect(() => {
    if (displayCruise && displayCruise.ports.length > 0) {
      const firstPort = displayCruise.ports[0].name;
      setSelectedLocation(locationData[firstPort] || {
        name: firstPort,
        weather: 'Sunny',
        temperature: '75°F',
        places: ['Explore the local area'],
        trivia: 'A beautiful cruise destination.'
      });
    }
  }, [displayCruise]);

  // Handle escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isLargeView) {
        setIsLargeView(false);
      }
    };

    if (isLargeView) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
      return () => {
        document.removeEventListener('keydown', handleEscape);
        document.body.style.overflow = 'unset';
      };
    }
  }, [isLargeView]);

  // Draw map on canvas
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
    
    // Draw simplified land masses (for context)
    ctx.fillStyle = '#10b981';
    ctx.strokeStyle = '#065f46';
    ctx.lineWidth = 1;
    
    // Draw some basic land shapes for Caribbean context
    // Florida (top left)
    ctx.beginPath();
    ctx.ellipse(width * 0.15, height * 0.2, width * 0.08, height * 0.15, 0, 0, 2 * Math.PI);
    ctx.fill();
    ctx.stroke();
    
    // Cuba (center left)
    ctx.beginPath();
    ctx.ellipse(width * 0.25, height * 0.4, width * 0.12, height * 0.06, 0, 0, 2 * Math.PI);
    ctx.fill();
    ctx.stroke();
    
    // Jamaica (center)
    ctx.beginPath();
    ctx.ellipse(width * 0.35, height * 0.55, width * 0.04, height * 0.03, 0, 0, 2 * Math.PI);
    ctx.fill();
    ctx.stroke();
    
    // Puerto Rico (center right)
    ctx.beginPath();
    ctx.ellipse(width * 0.6, height * 0.45, width * 0.05, height * 0.02, 0, 0, 2 * Math.PI);
    ctx.fill();
    ctx.stroke();
    
    // Convert port coordinates to canvas coordinates
    const canvasCoords = displayCruise.ports.map(port => 
      convertToCanvasCoords(port.coordinates[0], port.coordinates[1], width, height)
    );
    
    // Draw curved routes between ports
    ctx.strokeStyle = '#ff6b35';
    ctx.lineWidth = isLarge ? 4 : 3;
    ctx.lineCap = 'round';
    
    for (let i = 0; i < canvasCoords.length - 1; i++) {
      const routePoints = createSeaRoute(canvasCoords[i], canvasCoords[i + 1]);
      
      ctx.beginPath();
      ctx.moveTo(routePoints[0].x, routePoints[0].y);
      
      for (let j = 1; j < routePoints.length; j++) {
        ctx.lineTo(routePoints[j].x, routePoints[j].y);
      }
      
      ctx.stroke();
    }
    
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
      (coord as any).portName = port.name;
      (coord as any).radius = radius;
    });
    
    // Store coordinates for click detection
    (canvas as any).portCoords = canvasCoords;
  };

  // Handle canvas click (only for large view)
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
        const portName = (coord as any).portName;
        setClickedPort(portName);
        
        const locationInfo = locationData[portName] || {
          name: portName,
          weather: 'Sunny',
          temperature: '75°F',
          places: ['Explore the local area'],
          trivia: 'A beautiful cruise destination.'
        };
        setSelectedLocation(locationInfo);
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

        <canvas 
          ref={canvasRef}
          width={400}
          height={280}
          className="absolute inset-0 pt-12 w-full h-full"
          style={{ width: '100%', height: 'calc(100% - 48px)', marginTop: '48px' }}
        />
      </div>

      {/* Large View Modal */}
      {isLargeView && (
        <>
          {/* Backdrop overlay */}
          <div 
            className="fixed inset-0 bg-black/50 z-[999998]" 
            onClick={() => setIsLargeView(false)}
            style={{ zIndex: 999998 }}
          />
          
          {/* Modal content */}
          <div 
            className="fixed inset-0 z-[999999] flex items-center justify-center p-4 pointer-events-none"
            style={{ zIndex: 999999 }}
          >
            <div className="bg-white rounded-lg w-full h-full max-w-7xl max-h-[95vh] flex flex-col relative pointer-events-auto shadow-2xl">
              {/* Header */}
              <div className="p-4 border-b border-border-gray flex justify-between items-center bg-white relative z-[1000000]">
                <h3 className="font-semibold text-charcoal">Route Map - Interactive View</h3>
                <Button
                  variant="outline"
                  onClick={() => setIsLargeView(false)}
                  className="text-slate-gray h-8 w-8 p-0"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
              
              {/* Content */}
              <div className="flex-1 flex relative overflow-hidden">
                {/* Map Section */}
                <div className="flex-1 relative">
                  <canvas 
                    ref={largeCanvasRef}
                    width={800}
                    height={600}
                    onClick={handleCanvasClick}
                    className="w-full h-full cursor-pointer"
                    style={{ width: '100%', height: '100%' }}
                  />
                </div>
                
                {/* Right Panel - Location Information */}
                <div className="w-80 border-l border-border-gray bg-white flex flex-col">
                  {selectedLocation && (
                    <>
                      {/* Location Header */}
                      <div className="p-4 border-b border-border-gray">
                        <h4 className="font-semibold text-charcoal text-lg flex items-center gap-2">
                          <MapPin className="w-5 h-5 text-ocean-blue" />
                          {selectedLocation.name}
                        </h4>
                        <div className="flex items-center gap-4 mt-2 text-sm">
                          <div className="flex items-center gap-1">
                            <Cloud className="w-4 h-4 text-blue-500" />
                            <span>{selectedLocation.weather}</span>
                          </div>
                          <span className="font-medium text-coral-pink">{selectedLocation.temperature}</span>
                        </div>
                      </div>
                      
                      {/* Places to Visit */}
                      <div className="p-4 border-b border-border-gray">
                        <h5 className="font-medium text-charcoal mb-2">Places to Visit</h5>
                        <ul className="space-y-1 text-sm text-slate-gray">
                          {selectedLocation.places.map((place, index) => (
                            <li key={index} className="flex items-center gap-2">
                              <div className="w-1 h-1 bg-ocean-blue rounded-full" />
                              {place}
                            </li>
                          ))}
                        </ul>
                      </div>
                      
                      {/* Trivia */}
                      <div className="p-4">
                        <h5 className="font-medium text-charcoal mb-2 flex items-center gap-2">
                          <Info className="w-4 h-4 text-sunset-orange" />
                          Did You Know?
                        </h5>
                        <p className="text-sm text-slate-gray">{selectedLocation.trivia}</p>
                      </div>
                    </>
                  )}
                </div>
              </div>
              
              {/* Bottom Panel - Ports */}
              {displayCruise && (
                <div className="border-t border-border-gray bg-light-gray p-4">
                  <h5 className="font-medium text-charcoal mb-2">Cruise Ports</h5>
                  <div className="flex gap-2 flex-wrap">
                    {displayCruise.ports.map((port, index) => (
                      <button
                        key={index}
                        onClick={() => {
                          const locationInfo = locationData[port.name] || {
                            name: port.name,
                            weather: 'Sunny',
                            temperature: '75°F',
                            places: ['Explore the local area'],
                            trivia: 'A beautiful cruise destination.'
                          };
                          setSelectedLocation(locationInfo);
                          setClickedPort(port.name);
                        }}
                        className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                          selectedLocation?.name.includes(port.name) || clickedPort === port.name
                            ? 'bg-ocean-blue text-white'
                            : 'bg-white text-slate-gray hover:bg-ocean-blue hover:text-white'
                        }`}
                      >
                        {port.name}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default EnhancedRouteMap;
