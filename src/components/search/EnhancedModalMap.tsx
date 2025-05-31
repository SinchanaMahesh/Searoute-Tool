
import React, { useEffect, useRef, useState } from 'react';
import { CruiseData } from '@/api/mockCruiseData';
import { X, Cloud, MapPin, Info, Shield, Utensils, Camera } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface EnhancedModalMapProps {
  isOpen: boolean;
  onClose: () => void;
  cruises: CruiseData[];
  selectedCruise?: string | null;
}

interface LocationInsights {
  name: string;
  weather: {
    condition: string;
    temperature: string;
    humidity: string;
  };
  places: string[];
  advisory: string[];
  crimes: string[];
  dishes: string[];
  attractions: string[];
}

const EnhancedModalMap = ({ isOpen, onClose, cruises, selectedCruise }: EnhancedModalMapProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [selectedLocation, setSelectedLocation] = useState<LocationInsights | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  
  const displayCruise = selectedCruise 
    ? cruises.find(c => c.id === selectedCruise)
    : cruises.length > 0 ? cruises[0] : null;

  // Sample Florida/Bahamas region cruise data for better visual representation
  const sampleCruise = {
    id: 'sample',
    shipName: 'Sample Cruise',
    ports: [
      { name: 'Miami', coordinates: [-80.1918, 25.7617] },
      { name: 'Nassau', coordinates: [-77.3504, 25.0343] },
      { name: 'St. Thomas', coordinates: [-64.9307, 18.3358] }
    ],
    polylineCoordinates: [
      [-80.1918, 25.7617], // Miami
      [-79.5, 25.5], // Intermediate point
      [-78.8, 25.3], // Intermediate point
      [-77.3504, 25.0343], // Nassau
      [-75.5, 23.5], // Intermediate point
      [-72.0, 21.0], // Intermediate point
      [-68.0, 19.0], // Intermediate point
      [-64.9307, 18.3358] // St. Thomas
    ],
    route: 'Caribbean',
    duration: 7,
    priceFrom: 899
  };

  // Use sample cruise for better visualization
  const cruiseToDisplay = displayCruise || sampleCruise;

  // Mock location insights data
  const getLocationInsights = async (locationName: string): Promise<LocationInsights> => {
    setIsLoading(true);
    
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const mockInsights: Record<string, LocationInsights> = {
      'Miami': {
        name: 'Miami, Florida',
        weather: {
          condition: 'Sunny',
          temperature: '82°F (28°C)',
          humidity: '65%'
        },
        places: ['South Beach', 'Art Deco District', 'Wynwood Walls', 'Vizcaya Museum', 'Little Havana'],
        advisory: ['Use sunscreen', 'Stay hydrated', 'Hurricane season: June-November'],
        crimes: ['Petty theft in tourist areas', 'Car break-ins', 'Pickpocketing'],
        dishes: ['Cuban Sandwich', 'Stone Crab', 'Key Lime Pie', 'Ceviche', 'Arroz con Pollo'],
        attractions: ['Everglades National Park', 'Coral Gables', 'Coconut Grove']
      },
      'Nassau': {
        name: 'Nassau, Bahamas',
        weather: {
          condition: 'Partly Cloudy',
          temperature: '78°F (26°C)',
          humidity: '72%'
        },
        places: ['Paradise Island', 'Atlantis Resort', 'Cable Beach', 'Fort Charlotte', 'Queen\'s Staircase'],
        advisory: ['Drink bottled water', 'Respect local customs', 'Tip in USD'],
        crimes: ['Tourist-targeted scams', 'Bag snatching', 'Overcharging'],
        dishes: ['Conch Fritters', 'Rock Lobster', 'Johnnycake', 'Rum Cake', 'Cracked Conch'],
        attractions: ['Blue Lagoon Island', 'Ardastra Gardens', 'National Art Gallery']
      },
      'St. Thomas': {
        name: 'St. Thomas, USVI',
        weather: {
          condition: 'Tropical',
          temperature: '85°F (29°C)',
          humidity: '68%'
        },
        places: ['Magens Bay', 'Coral World', 'Paradise Point', 'Blackbeard\'s Castle', 'Charlotte Amalie'],
        advisory: ['No passport needed for US citizens', 'Duty-free shopping', 'Steep hills - wear good shoes'],
        crimes: ['Rare violent crime', 'Occasional theft from beaches', 'Traffic accidents on mountain roads'],
        dishes: ['Kallaloo', 'Johnny Cakes', 'Saltfish', 'Fungi', 'Maubi'],
        attractions: ['Skyride to Paradise Point', 'Coral World Ocean Park', 'Mountaintop']
      }
    };
    
    setIsLoading(false);
    return mockInsights[locationName] || {
      name: locationName,
      weather: { condition: 'Sunny', temperature: '75°F', humidity: '60%' },
      places: ['Explore the local area'],
      advisory: ['Stay safe and enjoy'],
      crimes: ['General caution advised'],
      dishes: ['Local cuisine'],
      attractions: ['Beautiful scenery']
    };
  };

  // Convert coordinates to canvas coordinates - focused on Florida/Bahamas region
  const convertToCanvasCoords = (longitude: number, latitude: number, canvasWidth: number, canvasHeight: number) => {
    // Define bounds for Florida/Bahamas region
    const minLon = -82;
    const maxLon = -62;
    const minLat = 17;
    const maxLat = 28;
    
    const x = ((longitude - minLon) / (maxLon - minLon)) * canvasWidth;
    const y = canvasHeight - ((latitude - minLat) / (maxLat - minLat)) * canvasHeight;
    
    return { x, y };
  };

  // Draw map
  const drawMap = (canvas: HTMLCanvasElement) => {
    if (!canvas || !cruiseToDisplay) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const { width, height } = canvas;
    
    // Clear canvas
    ctx.clearRect(0, 0, width, height);
    
    // Draw background (ocean with gradient for Caribbean waters)
    const gradient = ctx.createLinearGradient(0, 0, 0, height);
    gradient.addColorStop(0, '#87CEEB'); // Sky blue
    gradient.addColorStop(0.3, '#4682B4'); // Steel blue
    gradient.addColorStop(1, '#1e40af'); // Deep blue
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);
    
    // Draw route
    if (cruiseToDisplay.polylineCoordinates && cruiseToDisplay.polylineCoordinates.length > 0) {
      ctx.strokeStyle = '#ff6b35';
      ctx.lineWidth = 4;
      ctx.lineCap = 'round';
      ctx.setLineDash([]);
      
      ctx.beginPath();
      cruiseToDisplay.polylineCoordinates.forEach((coord, index) => {
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
    const canvasCoords = cruiseToDisplay.ports.map(port => 
      convertToCanvasCoords(port.coordinates[0], port.coordinates[1], width, height)
    );
    
    // Draw port markers
    canvasCoords.forEach((coord, index) => {
      const port = cruiseToDisplay.ports[index];
      const color = index === 0 ? '#22c55e' : index === canvasCoords.length - 1 ? '#ef4444' : '#3b82f6';
      const radius = 12;
      
      // Port circle
      ctx.fillStyle = color;
      ctx.strokeStyle = 'white';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(coord.x, coord.y, radius, 0, 2 * Math.PI);
      ctx.fill();
      ctx.stroke();
      
      // Port label
      ctx.fillStyle = '#1f2937';
      ctx.font = 'bold 12px Arial';
      ctx.textAlign = 'center';
      ctx.fillText(port.name, coord.x, coord.y + radius + 15);
      
      // Store port info for click detection
      (coord as any).port = port;
      (coord as any).radius = radius;
    });
    
    // Store coordinates for click detection
    (canvas as any).portCoords = canvasCoords;
  };

  // Handle canvas click
  const handleCanvasClick = async (event: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = event.currentTarget;
    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    
    const portCoords = (canvas as any).portCoords || [];
    
    for (const coord of portCoords) {
      const distance = Math.sqrt(Math.pow(x - coord.x, 2) + Math.pow(y - coord.y, 2));
      if (distance <= (coord as any).radius + 5) {
        const port = (coord as any).port;
        const insights = await getLocationInsights(port.name);
        setSelectedLocation(insights);
        break;
      }
    }
  };

  // Initialize with first port
  useEffect(() => {
    if (isOpen && cruiseToDisplay && cruiseToDisplay.ports.length > 0 && !selectedLocation) {
      getLocationInsights(cruiseToDisplay.ports[0].name).then(setSelectedLocation);
    }
  }, [isOpen, cruiseToDisplay]);

  // Draw map when component mounts or cruise changes
  useEffect(() => {
    if (canvasRef.current && isOpen) {
      drawMap(canvasRef.current);
    }
  }, [cruiseToDisplay, isOpen]);

  // Handle escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
      return () => {
        document.removeEventListener('keydown', handleEscape);
        document.body.style.overflow = 'unset';
      };
    }
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[99999]" style={{ isolation: 'isolate' }}>
      {/* Backdrop overlay */}
      <div 
        className="absolute inset-0 bg-black/60" 
        onClick={onClose}
      />
      
      {/* Modal content with transform3d for new stacking context */}
      <div className="absolute inset-0 flex items-center justify-center p-4" style={{ transform: 'translate3d(0,0,0)' }}>
        <div className="bg-white rounded-lg w-full h-full max-w-7xl max-h-[95vh] flex flex-col relative shadow-2xl">
          {/* Header */}
          <div className="p-4 border-b border-border-gray flex justify-between items-center bg-white relative z-10">
            <div>
              <h3 className="font-semibold text-charcoal">Interactive Route Map</h3>
              <p className="text-sm text-slate-gray mt-1">Click on ports to view detailed location insights</p>
            </div>
            <Button
              variant="outline"
              onClick={onClose}
              className="text-slate-gray h-8 w-8 p-0"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
          
          {/* Two-pane content */}
          <div className="flex-1 flex relative overflow-hidden bg-white">
            {/* Left Pane - Map */}
            <div className="flex-1 flex flex-col bg-white">
              <canvas 
                ref={canvasRef}
                width={800}
                height={600}
                onClick={handleCanvasClick}
                className="w-full h-full cursor-pointer bg-white"
                style={{ width: '100%', height: '100%' }}
              />
            </div>
            
            {/* Right Pane - Location Information */}
            <div className="w-96 border-l border-border-gray bg-white flex flex-col">
              {isLoading ? (
                <div className="flex-1 flex items-center justify-center bg-white">
                  <div className="text-slate-gray">Loading location insights...</div>
                </div>
              ) : selectedLocation ? (
                <div className="flex-1 overflow-y-auto bg-white">
                  {/* Location Header */}
                  <div className="p-4 border-b border-border-gray">
                    <h4 className="font-semibold text-charcoal text-lg flex items-center gap-2">
                      <MapPin className="w-5 h-5 text-ocean-blue" />
                      {selectedLocation.name}
                    </h4>
                    <div className="flex items-center gap-4 mt-2 text-sm">
                      <div className="flex items-center gap-1">
                        <Cloud className="w-4 h-4 text-blue-500" />
                        <span>{selectedLocation.weather.condition}</span>
                      </div>
                      <span className="font-medium text-coral-pink">{selectedLocation.weather.temperature}</span>
                      <span className="text-slate-gray">Humidity: {selectedLocation.weather.humidity}</span>
                    </div>
                  </div>
                  
                  {/* Places to Visit */}
                  <div className="p-4 border-b border-border-gray">
                    <h5 className="font-medium text-charcoal mb-2 flex items-center gap-2">
                      <Camera className="w-4 h-4 text-green-500" />
                      Places to Visit
                    </h5>
                    <ul className="space-y-1 text-sm text-slate-gray">
                      {selectedLocation.places.map((place, index) => (
                        <li key={index} className="flex items-center gap-2">
                          <div className="w-1 h-1 bg-ocean-blue rounded-full" />
                          {place}
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  {/* Local Dishes */}
                  <div className="p-4 border-b border-border-gray">
                    <h5 className="font-medium text-charcoal mb-2 flex items-center gap-2">
                      <Utensils className="w-4 h-4 text-orange-500" />
                      Local Dishes
                    </h5>
                    <ul className="space-y-1 text-sm text-slate-gray">
                      {selectedLocation.dishes.map((dish, index) => (
                        <li key={index} className="flex items-center gap-2">
                          <div className="w-1 h-1 bg-orange-500 rounded-full" />
                          {dish}
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  {/* Safety Advisory */}
                  <div className="p-4 border-b border-border-gray">
                    <h5 className="font-medium text-charcoal mb-2 flex items-center gap-2">
                      <Shield className="w-4 h-4 text-red-500" />
                      Safety & Advisory
                    </h5>
                    <ul className="space-y-1 text-sm text-slate-gray">
                      {selectedLocation.advisory.map((item, index) => (
                        <li key={index} className="flex items-center gap-2">
                          <div className="w-1 h-1 bg-blue-500 rounded-full" />
                          {item}
                        </li>
                      ))}
                    </ul>
                    <div className="mt-3">
                      <p className="text-xs font-medium text-red-600 mb-1">Crime Awareness:</p>
                      <ul className="space-y-1 text-xs text-slate-gray">
                        {selectedLocation.crimes.map((crime, index) => (
                          <li key={index} className="flex items-center gap-2">
                            <div className="w-1 h-1 bg-red-500 rounded-full" />
                            {crime}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                  
                  {/* Attractions */}
                  <div className="p-4">
                    <h5 className="font-medium text-charcoal mb-2 flex items-center gap-2">
                      <Info className="w-4 h-4 text-purple-500" />
                      Top Attractions
                    </h5>
                    <ul className="space-y-1 text-sm text-slate-gray">
                      {selectedLocation.attractions.map((attraction, index) => (
                        <li key={index} className="flex items-center gap-2">
                          <div className="w-1 h-1 bg-purple-500 rounded-full" />
                          {attraction}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              ) : (
                <div className="flex-1 flex items-center justify-center bg-white">
                  <div className="text-slate-gray text-center">
                    <MapPin className="w-8 h-8 text-slate-gray mx-auto mb-2" />
                    Click on a port to view location insights
                  </div>
                </div>
              )}
            </div>
          </div>
          
          {/* Bottom Panel - Cruise Information */}
          {cruiseToDisplay && (
            <div className="border-t border-border-gray bg-light-gray p-4 relative z-10">
              <div className="flex items-center justify-between">
                <div>
                  <h5 className="font-medium text-charcoal">{cruiseToDisplay.shipName}</h5>
                  <p className="text-sm text-slate-gray">{cruiseToDisplay.route} • {cruiseToDisplay.duration} days</p>
                  <div className="flex gap-2 mt-1">
                    {cruiseToDisplay.ports.map((port, index) => (
                      <button
                        key={index}
                        onClick={async () => {
                          const insights = await getLocationInsights(port.name);
                          setSelectedLocation(insights);
                        }}
                        className={`px-2 py-1 rounded-full text-xs font-medium transition-colors ${
                          selectedLocation?.name.includes(port.name)
                            ? 'bg-ocean-blue text-white'
                            : 'bg-white text-slate-gray hover:bg-ocean-blue hover:text-white'
                        }`}
                      >
                        {port.name}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-semibold text-ocean-blue">From ${cruiseToDisplay.priceFrom}</div>
                  <div className="text-xs text-slate-gray">per person</div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default EnhancedModalMap;
