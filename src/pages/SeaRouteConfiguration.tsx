import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { MapPin, Save, Trash2, Route, Lock, Sparkles } from 'lucide-react';
import { toast } from 'sonner';

interface Port {
  id: string;
  name: string;
  lat: number;
  lng: number;
}

interface SavedRoute {
  id: string;
  originPort: Port;
  destinationPort: Port;
  polyline: [number, number][];
  timestamp: string;
}

// Extend Leaflet types for custom properties
declare global {
  interface Window {
    L: any;
  }
}

const SeaRouteConfiguration = () => {
  // Authentication state
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');

  // Map and drawing state
  const mapRef = useRef<any>(null);
  const drawnLayersRef = useRef<any>(null);
  const [isLeafletLoaded, setIsLeafletLoaded] = useState(false);
  const [currentDrawnPolylineLatLngs, setCurrentDrawnPolylineLatLngs] = useState<any>(null);

  // Keyboard modifier state
  const [isCtrlPressed, setIsCtrlPressed] = useState(false);

  // Route selection state
  const [selectedOriginPortId, setSelectedOriginPortId] = useState('');
  const [selectedDestinationPortId, setSelectedDestinationPortId] = useState('');
  const [savedRoutes, setSavedRoutes] = useState<SavedRoute[]>([]);
  const [isSaving, setIsSaving] = useState(false);

  // Predefined ports (from your portData)
  const ports: Port[] = [
    { id: 'port_miami', name: 'Miami', lat: 25.7617, lng: -80.1918 },
    { id: 'port_nassau', name: 'Nassau', lat: 25.0343, lng: -77.3554 },
    { id: 'port_st_thomas', name: 'St. Thomas', lat: 18.3381, lng: -64.9306 },
    { id: 'port_barbados', name: 'Barbados', lat: 13.1939, lng: -59.5432 },
    { id: 'port_kingston', name: 'Kingston, Jamaica', lat: 17.9712, lng: -76.7936 },
    { id: 'port_cozumel', name: 'Cozumel, Mexico', lat: 20.4230, lng: -86.9223 },
  ];

  // Curve smoothing function
  const smoothCurve = useCallback(() => {
    if (!currentDrawnPolylineLatLngs || !window.L || !drawnLayersRef.current) {
      toast.error('No polyline to smooth. Please draw a route first.');
      return;
    }

    try {
      // Get the current polyline
      const layers = drawnLayersRef.current.getLayers();
      if (layers.length === 0) return;

      const polyline = layers[0];
      const originalPoints = polyline.getLatLngs();

      if (originalPoints.length < 3) {
        toast.info('Need at least 3 points to smooth the curve.');
        return;
      }

      // Simple spline interpolation - add points between existing ones
      const smoothedPoints = [];
      
      for (let i = 0; i < originalPoints.length - 1; i++) {
        const current = originalPoints[i];
        const next = originalPoints[i + 1];
        
        // Add the current point
        smoothedPoints.push(current);
        
        // Calculate intermediate points for smoothing
        const steps = 3; // Number of intermediate points
        for (let j = 1; j < steps; j++) {
          const ratio = j / steps;
          
          // Linear interpolation with slight curve adjustment
          const lat = current.lat + (next.lat - current.lat) * ratio;
          const lng = current.lng + (next.lng - current.lng) * ratio;
          
          // Add slight curve by considering neighboring points for natural smoothing
          let curveFactor = 0;
          if (i > 0) {
            const prev = originalPoints[i - 1];
            const curveLat = (prev.lat + next.lat) / 2;
            const curveLng = (prev.lng + next.lng) / 2;
            curveFactor = 0.1 * Math.sin(Math.PI * ratio);
            
            smoothedPoints.push({
              lat: lat + (curveLat - current.lat) * curveFactor * 0.1,
              lng: lng + (curveLng - current.lng) * curveFactor * 0.1
            });
          } else {
            smoothedPoints.push({ lat, lng });
          }
        }
      }
      
      // Add the last point
      smoothedPoints.push(originalPoints[originalPoints.length - 1]);

      // Create new smoothed polyline
      drawnLayersRef.current.clearLayers();
      const smoothedPolyline = window.L.polyline(smoothedPoints, {
        color: 'blue',
        weight: 3
      });
      
      drawnLayersRef.current.addLayer(smoothedPolyline);
      setCurrentDrawnPolylineLatLngs(smoothedPolyline.getLatLngs());
      
      toast.success(`Curve smoothed! Added ${smoothedPoints.length - originalPoints.length} interpolated points.`);
    } catch (error) {
      console.error('Error smoothing curve:', error);
      toast.error('Failed to smooth curve. Please try again.');
    }
  }, [currentDrawnPolylineLatLngs]);

  // Keyboard event handlers for modifier keys
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey || e.metaKey) {
        setIsCtrlPressed(true);
        if (mapRef.current) {
          mapRef.current.dragging.enable();
          mapRef.current.scrollWheelZoom.enable();
        }
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      if (!e.ctrlKey && !e.metaKey) {
        setIsCtrlPressed(false);
        // Don't disable dragging here as it might interfere with editing
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  // Simple authentication check
  const handleAuthentication = () => {
    if (password === 'admin123') {
      setIsAuthenticated(true);
      localStorage.setItem('admin_authenticated', 'true');
      toast.success('Authentication successful');
    } else {
      toast.error('Invalid password');
    }
  };

  // Check authentication on load
  useEffect(() => {
    const authStatus = localStorage.getItem('admin_authenticated');
    if (authStatus === 'true') {
      setIsAuthenticated(true);
    }
  }, []);

  // Load saved routes from localStorage
  const loadSavedRoutes = useCallback(() => {
    const saved = localStorage.getItem('sea_routes');
    if (saved) {
      try {
        setSavedRoutes(JSON.parse(saved));
      } catch (error) {
        console.error('Error loading saved routes:', error);
      }
    }
  }, []);

  // Save route to localStorage
  const saveRoute = useCallback(() => {
    if (!selectedOriginPortId || !selectedDestinationPortId || !currentDrawnPolylineLatLngs) {
      toast.error('Please select both ports and draw a route before saving.');
      return;
    }

    if (selectedOriginPortId === selectedDestinationPortId) {
      toast.error('Origin and Destination ports cannot be the same.');
      return;
    }

    setIsSaving(true);

    try {
      const originPort = ports.find(p => p.id === selectedOriginPortId);
      const destinationPort = ports.find(p => p.id === selectedDestinationPortId);

      if (!originPort || !destinationPort) {
        toast.error('Selected ports not found.');
        return;
      }

      // Create route key for checking existing routes
      const routeKey = `${selectedOriginPortId}-${selectedDestinationPortId}`;
      
      // Construct the final polyline
      const finalPolyline: [number, number][] = [
        [originPort.lat, originPort.lng],
        ...currentDrawnPolylineLatLngs.map((latlng: any) => [latlng.lat, latlng.lng]),
        [destinationPort.lat, destinationPort.lng]
      ];

      const routeData: SavedRoute = {
        id: routeKey,
        originPort,
        destinationPort,
        polyline: finalPolyline,
        timestamp: new Date().toISOString(),
      };

      // Get existing routes
      const existingRoutes = JSON.parse(localStorage.getItem('sea_routes') || '[]');
      
      // Remove existing route with same origin-destination if exists
      const filteredRoutes = existingRoutes.filter((route: SavedRoute) => route.id !== routeKey);
      
      // Add new route
      const updatedRoutes = [...filteredRoutes, routeData];
      
      localStorage.setItem('sea_routes', JSON.stringify(updatedRoutes));
      setSavedRoutes(updatedRoutes);
      
      toast.success('Route saved successfully!');
      clearRoute();
    } catch (error) {
      console.error('Error saving route:', error);
      toast.error('Failed to save route');
    } finally {
      setIsSaving(false);
    }
  }, [selectedOriginPortId, selectedDestinationPortId, currentDrawnPolylineLatLngs, ports]);

  // Clear drawn route
  const clearRoute = useCallback(() => {
    if (drawnLayersRef.current) {
      drawnLayersRef.current.clearLayers();
    }
    setCurrentDrawnPolylineLatLngs(null);
  }, []);

  // Load existing route for selected port pair
  const loadExistingRoute = useCallback(() => {
    if (!selectedOriginPortId || !selectedDestinationPortId) return;
    
    const routeKey = `${selectedOriginPortId}-${selectedDestinationPortId}`;
    const existingRoute = savedRoutes.find(route => route.id === routeKey);
    
    if (existingRoute && window.L && drawnLayersRef.current) {
      // Clear existing drawn layers
      drawnLayersRef.current.clearLayers();
      
      // Add the existing route as an editable polyline
      const polyline = window.L.polyline(existingRoute.polyline, {
        color: 'blue',
        weight: 3
      });
      
      drawnLayersRef.current.addLayer(polyline);
      setCurrentDrawnPolylineLatLngs(polyline.getLatLngs());
      
      toast.info('Existing route loaded for editing');
    }
  }, [selectedOriginPortId, selectedDestinationPortId, savedRoutes]);

  // Load existing route when ports are selected
  useEffect(() => {
    if (selectedOriginPortId && selectedDestinationPortId && savedRoutes.length > 0) {
      loadExistingRoute();
    }
  }, [selectedOriginPortId, selectedDestinationPortId, loadExistingRoute]);

  // Load saved routes on component mount
  useEffect(() => {
    loadSavedRoutes();
  }, [loadSavedRoutes]);

  // Leaflet initialization
  useEffect(() => {
    if (!isAuthenticated) return;

    // Load Leaflet CSS
    const leafletLink = document.createElement('link');
    leafletLink.rel = 'stylesheet';
    leafletLink.href = 'https://unpkg.com/leaflet@1.7.1/dist/leaflet.css';
    document.head.appendChild(leafletLink);

    // Load Leaflet.draw CSS
    const leafletDrawLink = document.createElement('link');
    leafletDrawLink.rel = 'stylesheet';
    leafletDrawLink.href = 'https://unpkg.com/leaflet-draw@1.0.4/dist/leaflet.draw.css';
    document.head.appendChild(leafletDrawLink);

    // Load Leaflet JS
    const leafletScript = document.createElement('script');
    leafletScript.src = 'https://unpkg.com/leaflet@1.7.1/dist/leaflet.js';
    leafletScript.onload = () => {
      // Load Leaflet.draw JS after Leaflet is loaded
      const leafletDrawScript = document.createElement('script');
      leafletDrawScript.src = 'https://unpkg.com/leaflet-draw@1.0.4/dist/leaflet.draw.js';
      leafletDrawScript.onload = () => {
        setIsLeafletLoaded(true);
      };
      leafletDrawScript.onerror = (e) => {
        console.error('Failed to load Leaflet.draw script:', e);
        setIsLeafletLoaded(true);
      };
      document.body.appendChild(leafletDrawScript);
    };
    leafletScript.onerror = (e) => {
      console.error('Failed to load Leaflet script:', e);
    };
    document.body.appendChild(leafletScript);

    return () => {
      if (document.head.contains(leafletLink)) {
        document.head.removeChild(leafletLink);
      }
      if (document.head.contains(leafletDrawLink)) {
        document.head.removeChild(leafletDrawLink);
      }
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, [isAuthenticated]);

  // Map setup and drawing logic
  useEffect(() => {
    if (!isLeafletLoaded || !window.L || !(window.L as any).Draw || !isAuthenticated) {
      return;
    }

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

    // Initialize the map
    if (!mapRef.current) {
      const map = L.map('route-map').setView([25.0, -80.0], 6);

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      }).addTo(map);

      mapRef.current = map;

      // Initialize the FeatureGroup for drawn items
      drawnLayersRef.current = new L.FeatureGroup().addTo(map);

      // Initialize the draw control with enhanced editing options
      const drawControl = new (L as any).Control.Draw({
        edit: {
          featureGroup: drawnLayersRef.current,
          remove: true,
          edit: {
            selectedPathOptions: {
              // Style for selected polyline
              color: '#fe57a1',
              opacity: 0.8,
              weight: 4,
              dashArray: '10, 10'
            }
          }
        },
        draw: {
          polyline: {
            shapeOptions: {
              color: 'blue',
              weight: 3
            },
            allowIntersection: false,
            repeatMode: false,
            showLength: true,
            metric: true,
            feet: false,
            nautic: true
          },
          polygon: false,
          rectangle: false,
          circle: false,
          marker: false,
          circlemarker: false,
        },
      });
      map.addControl(drawControl);

      // Custom map interaction handling based on modifier keys
      const originalOnMouseMove = map._onMouseMove;
      map._onMouseMove = function(e: any) {
        // Only allow map dragging when Ctrl/Cmd is pressed during editing
        if (this._panAnim && this._panAnim._inProgress) {
          return originalOnMouseMove.call(this, e);
        }
        
        const isEditing = drawnLayersRef.current && drawnLayersRef.current.getLayers().length > 0;
        if (isEditing && !isCtrlPressed && this.dragging._enabled) {
          // Temporarily disable dragging when editing without modifier
          return;
        }
        
        return originalOnMouseMove.call(this, e);
      };

      // Event listener for when a new shape is drawn
      map.on((L as any).Draw.Event.CREATED, (event: any) => {
        const layer = event.layer;
        drawnLayersRef.current.clearLayers();
        drawnLayersRef.current.addLayer(layer);
        setCurrentDrawnPolylineLatLngs(layer.getLatLngs());
        
        toast.success('Route drawn successfully! Use the edit tool to fine-tune.');
      });

      // Event listener for when a layer is edited
      map.on((L as any).Draw.Event.EDITED, (event: any) => {
        const layers = event.layers;
        layers.eachLayer((layer: any) => {
          if (layer instanceof L.Polyline) {
            setCurrentDrawnPolylineLatLngs(layer.getLatLngs());
            toast.success('Route updated - remember to save your changes');
          }
        });
      });

      // Event listener for when editing starts
      map.on((L as any).Draw.Event.EDITSTART, () => {
        toast.info('Edit mode active - hold Ctrl/Cmd to move map while editing');
      });

      // Event listener for when editing stops
      map.on((L as any).Draw.Event.EDITSTOP, () => {
        toast.info('Edit mode disabled');
      });

      // Event listener for when a layer is deleted
      map.on((L as any).Draw.Event.DELETED, () => {
        setCurrentDrawnPolylineLatLngs(null);
        toast.info('Route deleted');
      });

      // Event listener for when drawing starts
      map.on((L as any).Draw.Event.DRAWSTART, () => {
        toast.info('Click points to draw your route. Double-click to finish.');
      });

      // Event listener for when drawing stops
      map.on((L as any).Draw.Event.DRAWSTOP, () => {
        console.log('Drawing stopped');
      });
    }

    // Clear existing markers and routes
    mapRef.current.eachLayer((layer: any) => {
      if (layer instanceof L.Marker && (layer as any).options.customType === 'port') {
        mapRef.current.removeLayer(layer);
      }
      if (layer instanceof L.Polyline && (layer as any).options.customType === 'savedRoute') {
        mapRef.current.removeLayer(layer);
      }
    });

    // Add port markers
    ports.forEach(port => {
      const isOrigin = selectedOriginPortId === port.id;
      const isDestination = selectedDestinationPortId === port.id;
      const markerColor = isOrigin ? 'green' : (isDestination ? 'red' : 'blue');

      const portIcon = new L.Icon({
        iconUrl: `https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-${markerColor}.png`,
        iconSize: [25, 41],
        iconAnchor: [12, 41],
        popupAnchor: [1, -34],
        shadowSize: [41, 41]
      });

      const marker = L.marker([port.lat, port.lng], { icon: portIcon })
        .addTo(mapRef.current)
        .bindPopup(`<b>${port.name}</b><br>Port`);
      
      // Add custom property for identification
      (marker as any).options.customType = 'port';
    });

    // Draw saved routes
    savedRoutes.forEach(route => {
      if (route.polyline && route.polyline.length > 1) {
        const polyline = L.polyline(route.polyline, {
          color: 'gray',
          weight: 2,
          dashArray: '5, 5',
          opacity: 0.7
        })
        .addTo(mapRef.current)
        .bindPopup(`Saved Route: ${route.originPort.name} to ${route.destinationPort.name}`);
        
        // Add custom property for identification
        (polyline as any).options.customType = 'savedRoute';
      }
    });

    // Fit map bounds to all ports
    if (mapRef.current && ports.length > 0) {
      try {
        // Validate that all ports have valid coordinates
        const validPorts = ports.filter(p => 
          typeof p.lat === 'number' && 
          typeof p.lng === 'number' && 
          !isNaN(p.lat) && 
          !isNaN(p.lng) &&
          p.lat >= -90 && p.lat <= 90 &&
          p.lng >= -180 && p.lng <= 180
        );
        
        if (validPorts.length > 0) {
          const allPoints = validPorts.map(p => [p.lat, p.lng] as [number, number]);
          const bounds = L.latLngBounds(allPoints);
          mapRef.current.fitBounds(bounds.pad(0.1));
        } else {
          // Fallback to default view if no valid ports
          mapRef.current.setView([25.0, -80.0], 6);
        }
      } catch (error) {
        console.error('Error fitting bounds:', error);
        // Fallback to default view
        mapRef.current.setView([25.0, -80.0], 6);
      }
    }

  }, [isLeafletLoaded, isAuthenticated, ports, selectedOriginPortId, selectedDestinationPortId, savedRoutes, isCtrlPressed]);

  // Authentication form
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-ocean-blue to-deep-blue flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CardTitle className="flex items-center justify-center gap-2 text-charcoal">
              <Lock className="w-6 h-6 text-ocean-blue" />
              Administration Access
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-charcoal mb-2">
                Admin Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleAuthentication()}
                className="w-full px-3 py-2 border border-border-gray rounded-md focus:outline-none focus:ring-2 focus:ring-ocean-blue"
                placeholder="Enter admin password"
              />
            </div>
            <Button 
              onClick={handleAuthentication}
              className="w-full bg-ocean-blue hover:bg-deep-blue"
            >
              Login
            </Button>
            <p className="text-xs text-slate-gray text-center">
              Demo password: admin123
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-light-gray p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-charcoal">
              <Route className="w-6 h-6 text-ocean-blue" />
              Sea Route Configuration
            </CardTitle>
            <p className="text-slate-gray">
              Configure and manage maritime routes between ports
            </p>
          </CardHeader>
        </Card>

        {/* Controls */}
        <Card className="mb-6">
          <CardContent className="pt-6">
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4 items-end">
              <div>
                <label className="block text-sm font-medium text-charcoal mb-2">
                  Origin Port
                </label>
                <Select value={selectedOriginPortId} onValueChange={setSelectedOriginPortId}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select Origin" />
                  </SelectTrigger>
                  <SelectContent>
                    {ports.map(port => (
                      <SelectItem key={port.id} value={port.id}>
                        {port.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="block text-sm font-medium text-charcoal mb-2">
                  Destination Port
                </label>
                <Select value={selectedDestinationPortId} onValueChange={setSelectedDestinationPortId}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select Destination" />
                  </SelectTrigger>
                  <SelectContent>
                    {ports.map(port => (
                      <SelectItem key={port.id} value={port.id}>
                        {port.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <Button
                onClick={smoothCurve}
                disabled={!currentDrawnPolylineLatLngs}
                className="bg-purple-600 hover:bg-purple-700"
              >
                <Sparkles className="w-4 h-4 mr-2" />
                Smooth Curve
              </Button>

              <Button
                onClick={saveRoute}
                disabled={!selectedOriginPortId || !selectedDestinationPortId || !currentDrawnPolylineLatLngs || isSaving}
                className="bg-green-600 hover:bg-green-700"
              >
                <Save className="w-4 h-4 mr-2" />
                {isSaving ? 'Saving...' : 'Save Route'}
              </Button>

              <Button
                onClick={clearRoute}
                variant="destructive"
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Clear Route
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Map Container */}
        <Card>
          <CardContent className="p-0">
            <div 
              id="route-map" 
              className="w-full h-[600px] rounded-lg bg-gray-200 flex items-center justify-center text-gray-500"
            >
              {!isLeafletLoaded && (
                <div className="flex flex-col items-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-ocean-blue"></div>
                  <p className="mt-4 text-lg">Loading map libraries...</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Instructions */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle className="text-charcoal">Instructions</CardTitle>
          </CardHeader>
          <CardContent>
            <ol className="list-decimal list-inside space-y-2 text-slate-gray">
              <li>Select an Origin Port and Destination Port from the dropdowns</li>
              <li>Use the polyline drawing tool on the map to draw your route</li>
              <li>Click points on the map to create your route path</li>
              <li>Double-click to finish drawing the route</li>
              <li>Use the edit tool (pencil icon) to modify vertices and smooth curves manually</li>
              <li><strong>Click "Smooth Curve" to automatically add interpolated points for smoother curves</strong></li>
              <li><strong>Hold Ctrl (or Cmd on Mac) while editing to move the map</strong></li>
              <li>Click "Save Route" to store the route configuration</li>
              <li>Existing routes will appear as gray dashed lines</li>
              <li>Green markers show origin ports, red markers show destinations</li>
            </ol>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SeaRouteConfiguration;
