"use client";

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Route, Sparkles, Search, Undo, Redo } from 'lucide-react';
import { toast } from 'sonner';
import * as SelectPrimitive from '@radix-ui/react-select';
import { Port, SavedRoute } from '@/types/route';
import { fetchPorts } from '@/lib/services/portService';
import { generateSeaRoute } from '@/lib/services/routeService';
import { saveSegment, getSegment } from '@/lib/services/segmentService';
import { getUSTimeISOString, formatToUSTime } from '@/lib/utils/dateUtils';


const SeaRouteConfiguration = () => {
  // Map and drawing state
  const mapRef = useRef<any>(null);
  const drawnLayersRef = useRef<any>(null);
  const [isLeafletLoaded, setIsLeafletLoaded] = useState(false);
  const [currentDrawnPolylineLatLngs, setCurrentDrawnPolylineLatLngs] = useState<any>(null);

  // Undo/Redo state history
  const [routeHistory, setRouteHistory] = useState<any[]>([]);
  const [historyIndex, setHistoryIndex] = useState<number>(-1);
  const isHistoryUpdateRef = useRef<boolean>(false);
  const editTrackingIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const previousEditStateRef = useRef<any>(null);
  const isEditingRef = useRef<boolean>(false);
  const startEditTrackingRef = useRef<(() => void) | null>(null);
  const stopEditTrackingRef = useRef<(() => void) | null>(null);

  // Save current route state to history
  const saveToHistory = useCallback((state: any) => {
    if (isHistoryUpdateRef.current) {
      // Don't save if we're updating from history (undo/redo)
      return;
    }

    // Don't save null states unless explicitly clearing the route
    if (state === null && routeHistory.length > 0) {
      // Only allow null state if we're actually clearing (not during normal editing)
      return;
    }

    setRouteHistory((prev) => {
      // If history is empty, just add the state (don't initialize with null)
      if (prev.length === 0) {
        return [JSON.parse(JSON.stringify(state))];
      }
      
      // Remove any states after current index (when undoing and then making new changes)
      const newHistory = prev.slice(0, historyIndex + 1);
      // Add new state
      const updated = [...newHistory, JSON.parse(JSON.stringify(state))];
      // Limit history to 50 states to prevent memory issues
      return updated.slice(-50);
    });
    setHistoryIndex((prev) => {
      const newIndex = prev + 1;
      // Limit history index
      return Math.min(newIndex, 49);
    });
  }, [historyIndex, routeHistory.length]);

  // Undo function
  const undoRoute = useCallback(() => {
    if (historyIndex <= 0) {
      toast.info('Nothing to undo');
      return;
    }

    const newIndex = historyIndex - 1;
    const previousState = routeHistory[newIndex];
    
    // Don't allow going to null state unless it's the only state
    if (previousState === null && routeHistory.length > 1) {
      toast.info('Nothing to undo');
      return;
    }
    
    isHistoryUpdateRef.current = true;
    setHistoryIndex(newIndex);
    
    if (previousState === null) {
      // Only clear if null is the actual state (route was cleared)
      if (drawnLayersRef.current) {
        drawnLayersRef.current.clearLayers();
      }
      setCurrentDrawnPolylineLatLngs(null);
    } else {
      // Restore previous state
      if (window.L && drawnLayersRef.current) {
        drawnLayersRef.current.clearLayers();
        const polyline = window.L.polyline(previousState, {
          color: 'blue',
          weight: 3
        });
        drawnLayersRef.current.addLayer(polyline);
        setCurrentDrawnPolylineLatLngs(polyline.getLatLngs());
      }
    }
    
    setTimeout(() => {
      isHistoryUpdateRef.current = false;
    }, 100);
  }, [historyIndex, routeHistory]);

  // Redo function
  const redoRoute = useCallback(() => {
    if (historyIndex >= routeHistory.length - 1) {
      toast.info('Nothing to redo');
      return;
    }

    const newIndex = historyIndex + 1;
    const nextState = routeHistory[newIndex];
    
    // Don't allow going to null state unless it's the only state
    if (nextState === null && routeHistory.length > 1) {
      // Skip null states in the middle of history
      if (newIndex < routeHistory.length - 1) {
        // Try to find next non-null state
        let foundIndex = newIndex + 1;
        while (foundIndex < routeHistory.length && routeHistory[foundIndex] === null) {
          foundIndex++;
        }
        if (foundIndex < routeHistory.length) {
          const validState = routeHistory[foundIndex];
          isHistoryUpdateRef.current = true;
          setHistoryIndex(foundIndex);
          if (window.L && drawnLayersRef.current && validState) {
            drawnLayersRef.current.clearLayers();
            const polyline = window.L.polyline(validState, {
              color: 'blue',
              weight: 3
            });
            drawnLayersRef.current.addLayer(polyline);
            setCurrentDrawnPolylineLatLngs(polyline.getLatLngs());
          }
          setTimeout(() => {
            isHistoryUpdateRef.current = false;
          }, 100);
          return;
        }
      }
      toast.info('Nothing to redo');
      return;
    }
    
    isHistoryUpdateRef.current = true;
    setHistoryIndex(newIndex);
    
    if (nextState === null) {
      // Only clear if null is the actual state (route was cleared)
      if (drawnLayersRef.current) {
        drawnLayersRef.current.clearLayers();
      }
      setCurrentDrawnPolylineLatLngs(null);
    } else {
      // Restore next state
      if (window.L && drawnLayersRef.current) {
        drawnLayersRef.current.clearLayers();
        const polyline = window.L.polyline(nextState, {
          color: 'blue',
          weight: 3
        });
        drawnLayersRef.current.addLayer(polyline);
        setCurrentDrawnPolylineLatLngs(polyline.getLatLngs());
      }
    }
    
    setTimeout(() => {
      isHistoryUpdateRef.current = false;
    }, 100);
  }, [historyIndex, routeHistory]);

  // Function to serialize coordinates for comparison
  const serializeCoordinates = useCallback((coords: any): string => {
    if (!coords || !Array.isArray(coords)) return '';
    return JSON.stringify(coords.map((ll: any) => ({
      lat: typeof ll.lat === 'number' ? Math.round(ll.lat * 1000000) / 1000000 : ll.lat,
      lng: typeof ll.lng === 'number' ? Math.round(ll.lng * 1000000) / 1000000 : ll.lng
    })));
  }, []);

  // Check for route changes during editing and save to history
  const checkAndSaveEditChanges = useCallback(() => {
    if (!isEditingRef.current || !drawnLayersRef.current || isHistoryUpdateRef.current) {
      return;
    }

    const layers = drawnLayersRef.current.getLayers();
    if (layers.length === 0) return;

    const polyline = layers[0];
    if (!polyline || !(polyline instanceof window.L?.Polyline)) return;

    const currentLatLngs = polyline.getLatLngs();
    
    // Don't save if current state is null or empty
    if (!currentLatLngs || (Array.isArray(currentLatLngs) && currentLatLngs.length === 0)) {
      return;
    }
    
    const currentSerialized = serializeCoordinates(currentLatLngs);
    const previousSerialized = previousEditStateRef.current ? serializeCoordinates(previousEditStateRef.current) : '';

    // If coordinates have changed, save to history
    if (currentSerialized !== previousSerialized) {
      previousEditStateRef.current = currentLatLngs;
      const serializable = Array.isArray(currentLatLngs) 
        ? currentLatLngs.map((ll: any) => ({ lat: ll.lat, lng: ll.lng }))
        : null;
      
      // Only save if serializable is not null
      if (serializable) {
        saveToHistory(serializable);
        setCurrentDrawnPolylineLatLngs(currentLatLngs);
      }
    }
  }, [serializeCoordinates, saveToHistory]);

  // Start tracking edits
  const startEditTracking = useCallback(() => {
    if (editTrackingIntervalRef.current) {
      clearInterval(editTrackingIntervalRef.current);
    }

    // Save initial state when editing starts (so undo can go back to before editing)
    const layers = drawnLayersRef.current?.getLayers();
    if (layers && layers.length > 0) {
      const polyline = layers[0];
      if (polyline instanceof window.L?.Polyline) {
        const initialLatLngs = polyline.getLatLngs();
        previousEditStateRef.current = initialLatLngs;
        
        // Always save initial state as a checkpoint when editing starts (even if same as last state)
        // This ensures undo can go back to before editing started
        if (!isHistoryUpdateRef.current && initialLatLngs) {
          const serializable = Array.isArray(initialLatLngs) 
            ? initialLatLngs.map((ll: any) => ({ lat: ll.lat, lng: ll.lng }))
            : null;
          
          // Save as checkpoint - always save when editing starts
          saveToHistory(serializable);
        }
      }
    }

    isEditingRef.current = true;
    
    // Check for changes every 100ms during editing
    editTrackingIntervalRef.current = setInterval(() => {
      checkAndSaveEditChanges();
    }, 100);
  }, [checkAndSaveEditChanges, saveToHistory]);

  // Store in ref for access in event listeners
  startEditTrackingRef.current = startEditTracking;

  // Stop tracking edits
  const stopEditTracking = useCallback(() => {
    if (editTrackingIntervalRef.current) {
      clearInterval(editTrackingIntervalRef.current);
      editTrackingIntervalRef.current = null;
    }
    isEditingRef.current = false;
    
    // Final check and save when editing stops
    checkAndSaveEditChanges();
    previousEditStateRef.current = null;
  }, [checkAndSaveEditChanges]);

  // Store in ref for access in event listeners
  stopEditTrackingRef.current = stopEditTracking;

  // Wrapper function to set route state and save to history
  const updateRouteState = useCallback((newState: any) => {
    setCurrentDrawnPolylineLatLngs(newState);
    if (newState) {
      // Convert to serializable format
      const serializable = Array.isArray(newState) 
        ? newState.map((ll: any) => ({ lat: ll.lat, lng: ll.lng }))
        : null;
      saveToHistory(serializable);
    } else {
      saveToHistory(null);
    }
  }, [saveToHistory]);

  // Keyboard modifier state
  const [isCtrlPressed, setIsCtrlPressed] = useState(false);

  // Route selection state
  const [selectedOriginPortId, setSelectedOriginPortId] = useState('');
  const [selectedDestinationPortId, setSelectedDestinationPortId] = useState('');
  const [savedRoutes, setSavedRoutes] = useState<SavedRoute[]>([]);
  const [isSaving, setIsSaving] = useState(false);
  const [routeCreatedAt, setRouteCreatedAt] = useState<string | null>(null); // Track when route was first created

  // Origin Ports - completely independent state
  const [originPorts, setOriginPorts] = useState<Port[]>([]);
  const [isLoadingOriginPorts, setIsLoadingOriginPorts] = useState<boolean>(false);
  const [originPortsOffset, setOriginPortsOffset] = useState<number>(0);
  const [originPortsTotal, setOriginPortsTotal] = useState<number>(0);
  const [hasMoreOriginPorts, setHasMoreOriginPorts] = useState<boolean>(true);
  const [isLoadingMoreOriginPorts, setIsLoadingMoreOriginPorts] = useState<boolean>(false);
  
  // Destination Ports - completely independent state
  const [destinationPorts, setDestinationPorts] = useState<Port[]>([]);
  const [isLoadingDestinationPorts, setIsLoadingDestinationPorts] = useState<boolean>(false);
  const [destinationPortsOffset, setDestinationPortsOffset] = useState<number>(0);
  const [destinationPortsTotal, setDestinationPortsTotal] = useState<number>(0);
  const [hasMoreDestinationPorts, setHasMoreDestinationPorts] = useState<boolean>(true);
  const [isLoadingMoreDestinationPorts, setIsLoadingMoreDestinationPorts] = useState<boolean>(false);
  
  // Search state for both dropdowns
  const [originSearch, setOriginSearch] = useState<string>('');
  const [destinationSearch, setDestinationSearch] = useState<string>('');

  // Searoute state
  const [isLoadingSeaRoute, setIsLoadingSeaRoute] = useState(false);
  const [routeType, setRouteType] = useState<'manual' | 'searoute'>('manual');

  // Fetch ports function for origin dropdown
  const fetchOriginPorts = useCallback(async (
    offset: number = 0,
    limit: number = 100,
    append: boolean = false,
    search: string = ''
  ) => {
    if (append) {
      setIsLoadingMoreOriginPorts(true);
    } else {
      setIsLoadingOriginPorts(true);
    }

    try {
      const data = await fetchPorts(offset, limit, search);
      const mappedPorts = data.ports;

      if (append) {
        // Append new ports, avoiding duplicates
        setOriginPorts((prev) => {
          const existingIds = new Set(prev.map(p => p.id));
          const merged = [
            ...prev,
            ...mappedPorts.filter(p => !existingIds.has(p.id)),
          ];
          return merged;
        });
      } else {
        // Replace list for current search BUT always keep currently selected origin port
        setOriginPorts((prev) => {
          const selectedId = selectedOriginPortId;
          const selectedPort = selectedId ? prev.find(p => p.id === selectedId) : null;
          const newPorts = mappedPorts.filter(p => p.id !== selectedId);
          return selectedPort ? [selectedPort, ...newPorts] : newPorts;
        });
      }

      setOriginPortsTotal(data.total || 0);
      setOriginPortsOffset(offset + mappedPorts.length);
      setHasMoreOriginPorts(data.hasMore || false);
    } catch (error) {
      if (!append) {
        toast.error('Failed to load ports from server');
      }
    } finally {
      setIsLoadingOriginPorts(false);
      setIsLoadingMoreOriginPorts(false);
    }
  }, [selectedOriginPortId]);

  // Fetch ports function for destination dropdown
  const fetchDestinationPorts = useCallback(async (
    offset: number = 0,
    limit: number = 100,
    append: boolean = false,
    search: string = ''
  ) => {
    if (append) {
      setIsLoadingMoreDestinationPorts(true);
    } else {
      setIsLoadingDestinationPorts(true);
    }

    try {
      const data = await fetchPorts(offset, limit, search);
      const mappedPorts = data.ports;

      if (append) {
        // Append new ports, avoiding duplicates
        setDestinationPorts((prev) => {
          const existingIds = new Set(prev.map(p => p.id));
          const merged = [
            ...prev,
            ...mappedPorts.filter(p => !existingIds.has(p.id)),
          ];
          return merged;
        });
      } else {
        // Replace list for current search BUT always keep currently selected destination port
        setDestinationPorts((prev) => {
          const selectedId = selectedDestinationPortId;
          const selectedPort = selectedId ? prev.find(p => p.id === selectedId) : null;
          const newPorts = mappedPorts.filter(p => p.id !== selectedId);
          return selectedPort ? [selectedPort, ...newPorts] : newPorts;
        });
      }

      setDestinationPortsTotal(data.total || 0);
      setDestinationPortsOffset(offset + mappedPorts.length);
      setHasMoreDestinationPorts(data.hasMore || false);
    } catch (error) {
      if (!append) {
        toast.error('Failed to load ports from server');
      }
    } finally {
      setIsLoadingDestinationPorts(false);
      setIsLoadingMoreDestinationPorts(false);
    }
  }, [selectedDestinationPortId]);

  // Load initial ports for both dropdowns
  useEffect(() => {
    fetchOriginPorts(0, 100, false, '');
    fetchDestinationPorts(0, 100, false, '');
  }, [fetchOriginPorts, fetchDestinationPorts]);

  // Print origin port coordinates when selected
  useEffect(() => {
    if (selectedOriginPortId) {
      const originPort = originPorts.find((p) => p.id === selectedOriginPortId);
      if (originPort) {
        console.log('📍 Origin Port Selected:');
        console.log('  Name:', originPort.name);
        console.log('  Latitude:', originPort.lat);
        console.log('  Longitude:', originPort.lng);
        console.log('  ID:', originPort.id);
      }
    }
  }, [selectedOriginPortId, originPorts]);

  // Print destination port coordinates when selected
  useEffect(() => {
    if (selectedDestinationPortId) {
      const destinationPort = destinationPorts.find((p) => p.id === selectedDestinationPortId);
      if (destinationPort) {
        console.log('🎯 Destination Port Selected:');
        console.log('  Name:', destinationPort.name);
        console.log('  Latitude:', destinationPort.lat);
        console.log('  Longitude:', destinationPort.lng);
        console.log('  ID:', destinationPort.id);
      }
    }
  }, [selectedDestinationPortId, destinationPorts]);

  // Debounced search for origin port - completely independent
  useEffect(() => {
    const delay = setTimeout(() => {
      setOriginPortsOffset(0);
      setHasMoreOriginPorts(true);
      fetchOriginPorts(0, 100, false, originSearch.toLowerCase());
    }, 300);

    return () => clearTimeout(delay);
  }, [originSearch, fetchOriginPorts]);

  // Debounced search for destination port - completely independent
  useEffect(() => {
    const delay = setTimeout(() => {
      setDestinationPortsOffset(0);
      setHasMoreDestinationPorts(true);
      fetchDestinationPorts(0, 100, false, destinationSearch.toLowerCase());
    }, 300);

    return () => clearTimeout(delay);
  }, [destinationSearch, fetchDestinationPorts]);

  // Load more origin ports when scrolling
  const loadMoreOriginPorts = useCallback(async (search: string = '') => {
    if (isLoadingMoreOriginPorts || !hasMoreOriginPorts) return;
    await fetchOriginPorts(originPortsOffset, 100, true, search);
  }, [originPortsOffset, hasMoreOriginPorts, isLoadingMoreOriginPorts, fetchOriginPorts]);

  // Load more destination ports when scrolling
  const loadMoreDestinationPorts = useCallback(async (search: string = '') => {
    if (isLoadingMoreDestinationPorts || !hasMoreDestinationPorts) return;
    await fetchDestinationPorts(destinationPortsOffset, 100, true, search);
  }, [destinationPortsOffset, hasMoreDestinationPorts, isLoadingMoreDestinationPorts, fetchDestinationPorts]);

  // Handle search - just updates state, useEffect handles debounced API call
  const handleSearch = useCallback((searchTerm: string, isOrigin: boolean) => {
    if (isOrigin) {
      setOriginSearch(searchTerm);
    } else {
      setDestinationSearch(searchTerm);
    }
  }, []);

  // Custom SelectContent with search input and infinite scroll
  const SearchableSelectContent = React.forwardRef<
    React.ElementRef<typeof SelectContent>,
    React.ComponentPropsWithoutRef<typeof SelectContent> & {
      searchValue: string;
      onSearchChange: (value: string) => void;
      isOrigin: boolean;
      onOpenChange?: (open: boolean) => void;
      loadMorePorts: (search: string) => void;
      isLoadingMore: boolean;
      hasMore: boolean;
    }
  >(({ children, searchValue, onSearchChange, isOrigin, onOpenChange, loadMorePorts, isLoadingMore, hasMore, ...props }, ref) => {
    const searchInputRef = useRef<HTMLInputElement>(null);
    const [localSearch, setLocalSearch] = useState(searchValue);

    useEffect(() => {
      setLocalSearch(searchValue);
    }, [searchValue]);

    useEffect(() => {
      let scrollHandler: ((e: Event) => void) | null = null;
      let observer: MutationObserver | null = null;

      const setupScrollListener = (viewport: HTMLElement) => {
        if (scrollHandler) {
          viewport.removeEventListener('scroll', scrollHandler);
        }

        scrollHandler = () => {
          if (isLoadingMore || !hasMore) return;
          const { scrollTop, scrollHeight, clientHeight } = viewport;
          // Load more when user scrolls within 150px of bottom
          if (scrollHeight - scrollTop - clientHeight < 150) {
            loadMorePorts(localSearch.toLowerCase());
          }
        };

        viewport.addEventListener('scroll', scrollHandler, { passive: true });
      };

      // Try to find viewport immediately
      const viewport = document.querySelector('[data-radix-select-viewport]') as HTMLElement;
      if (viewport) {
        setupScrollListener(viewport);
      }

      // Use MutationObserver to watch for viewport creation
      observer = new MutationObserver(() => {
        const viewport = document.querySelector('[data-radix-select-viewport]') as HTMLElement;
        if (viewport && !scrollHandler) {
          setupScrollListener(viewport);
        }
      });

      // Observe the document body for changes
      observer.observe(document.body, {
        childList: true,
        subtree: true,
      });

      // Also try after a short delay
      const timeout = setTimeout(() => {
        const viewport = document.querySelector('[data-radix-select-viewport]') as HTMLElement;
        if (viewport && !scrollHandler) {
          setupScrollListener(viewport);
        }
      }, 200);

      return () => {
        clearTimeout(timeout);
        if (observer) observer.disconnect();
        if (scrollHandler) {
          const viewport = document.querySelector('[data-radix-select-viewport]') as HTMLElement;
          if (viewport) {
            viewport.removeEventListener('scroll', scrollHandler);
          }
        }
      };
    }, [isLoadingMore, hasMore, localSearch, loadMorePorts]);

    // Update parent search state immediately (debounce happens in parent useEffect)
    useEffect(() => {
      if (localSearch !== searchValue) {
        onSearchChange(localSearch);
      }
    }, [localSearch, searchValue, onSearchChange]);

    // Focus search input when dropdown opens
    useEffect(() => {
      const timeout = setTimeout(() => {
        if (searchInputRef.current) {
          searchInputRef.current.focus();
        }
      }, 100);

      return () => clearTimeout(timeout);
    }, []);

    // Track dropdown open/close state and reset search when closes
    useEffect(() => {
      const content = document.querySelector('[data-radix-select-content]');
      if (!content) return;

      const observer = new MutationObserver(() => {
        const isOpen = content.getAttribute('data-state') === 'open';
        if (onOpenChange) {
          onOpenChange(isOpen);
        }
        if (!isOpen && localSearch) {
          setLocalSearch('');
          onSearchChange('');
        }
      });

      observer.observe(content, {
        attributes: true,
        attributeFilter: ['data-state'],
      });

      return () => observer.disconnect();
    }, [localSearch, onSearchChange, onOpenChange]);

    return (
      <SelectContent ref={ref} className="z-[9999] p-0" {...props}>
        {/* Search Input */}
        <div className="sticky top-0 z-10 bg-popover border-b p-2">
          <div className="relative">
            <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              ref={searchInputRef}
              type="text"
              value={localSearch}
              onChange={(e) => {
                e.stopPropagation();
                setLocalSearch(e.target.value);
              }}
              onClick={(e) => e.stopPropagation()}
              onKeyDown={(e) => {
                e.stopPropagation();
                if (e.key === 'Escape') {
                  setLocalSearch('');
                  onSearchChange('');
                }
              }}
              placeholder="Search ports (e.g., 'mi', 'new')..."
              className="w-full pl-8 pr-2 py-2 text-sm border rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>
        </div>
        {children}
        {isLoadingMore && (
          <div className="py-2 px-2 text-center text-xs text-muted-foreground border-t">
            Loading more ports...
          </div>
        )}
      </SelectContent>
    );
  });
  SearchableSelectContent.displayName = 'SearchableSelectContent';


  // Generate SeaRoute based on selected origin & destination using searoute.js
  const generateSeaRoute = useCallback(async () => {
    if (!selectedOriginPortId || !selectedDestinationPortId) {
      toast.error('Please select both origin and destination ports first.');
      return;
    }

    if (selectedOriginPortId === selectedDestinationPortId) {
      toast.error('Origin and Destination ports cannot be the same.');
      return;
    }

    if (!window || !window.L || !mapRef.current || !drawnLayersRef.current) {
      toast.error('Map is not ready yet. Please wait for it to load.');
      return;
    }

    const originPort = originPorts.find((p) => p.id === selectedOriginPortId);
    const destinationPort = destinationPorts.find((p) => p.id === selectedDestinationPortId);

    if (!originPort || !destinationPort) {
      toast.error('Selected ports not found.');
      return;
    }

    // Print port coordinates before generating route
    console.log('🚢 Generating Sea Route:');
    console.log('📍 Origin Port:');
    console.log('  Name:', originPort.name);
    console.log('  Latitude:', originPort.lat);
    console.log('  Longitude:', originPort.lng);
    console.log('🎯 Destination Port:');
    console.log('  Name:', destinationPort.name);
    console.log('  Latitude:', destinationPort.lat);
    console.log('  Longitude:', destinationPort.lng);

    setIsLoadingSeaRoute(true);

    try {
      // Call backend API that uses searoute.js (server-side, Node environment)
      const response = await fetch('/api/ports/route', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          origin: { lat: originPort.lat, lng: originPort.lng },
          dest: { lat: destinationPort.lat, lng: destinationPort.lng },
          units: 'kilometers',
        }),
      });

      if (!response.ok) {
        throw new Error(`SeaRoute API error: ${response.status}`);
      }

      const data = await response.json() as { coordinates?: number[][] };

      if (!data.coordinates || !Array.isArray(data.coordinates) || data.coordinates.length === 0) {
        toast.error('No sea route found for the selected ports.');
        return;
      }

      // Convert to Leaflet lat/lng objects (GeoJSON is [lng, lat])
      const latLngs = data.coordinates.map(
        (coord: number[]) => ({ lat: coord[1], lng: coord[0] })
      );

      const L = window.L;
      drawnLayersRef.current.clearLayers();

      const polyline = L.polyline(latLngs, {
        color: 'blue',
        weight: 3,
      });

      drawnLayersRef.current.addLayer(polyline);
      updateRouteState(polyline.getLatLngs());
      setRouteType('searoute');
      
      // Set creation time if this is a new route (not already set)
      if (!routeCreatedAt) {
        setRouteCreatedAt(getUSTimeISOString());
      }

      // Fit map bounds to show the generated route clearly
      if (mapRef.current && latLngs.length > 0) {
        try {
          // Create bounds that include both ports and the route
          const allPoints: [number, number][] = [
            [originPort.lat, originPort.lng],
            [destinationPort.lat, destinationPort.lng],
            ...latLngs.map((ll: { lat: number; lng: number }) => [ll.lat, ll.lng] as [number, number])
          ];
          const bounds = L.latLngBounds(allPoints);
          mapRef.current.fitBounds(bounds.pad(0.15), { maxZoom: 10, duration: 800 });
        } catch (error) {
          // If bounds fitting fails, at least center on the route midpoint
          if (latLngs.length > 0) {
            const midIndex = Math.floor(latLngs.length / 2);
            const midPoint = latLngs[midIndex];
            if (midPoint && typeof midPoint.lat === 'number' && typeof midPoint.lng === 'number') {
              mapRef.current.setView([midPoint.lat, midPoint.lng], 8);
            }
          }
        }
      }

      toast.success('SeaRoute generated. You can now edit the route and save it.');
    } catch (error) {
      console.error('Error generating SeaRoute:', error);
      toast.error('Failed to generate SeaRoute. Please try again.');
    } finally {
      setIsLoadingSeaRoute(false);
    }
  }, [
    selectedOriginPortId,
    selectedDestinationPortId,
    originPorts,
    destinationPorts,
    updateRouteState,
    routeCreatedAt,
  ]);

  // Enhanced curve smoothing function with iterative improvement
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

      // Advanced spline interpolation with adaptive smoothing
      const smoothedPoints = [];
      
      // Calculate the optimal number of interpolation points based on distance
      for (let i = 0; i < originalPoints.length - 1; i++) {
        const current = originalPoints[i];
        const next = originalPoints[i + 1];
        
        // Add the current point
        smoothedPoints.push(current);
        
        // Calculate distance between points to determine interpolation density
        const distance = Math.sqrt(
          Math.pow(next.lat - current.lat, 2) + Math.pow(next.lng - current.lng, 2)
        );
        
        // Adaptive step calculation - more points for longer segments
        const steps = Math.max(2, Math.min(8, Math.floor(distance * 100)));
        
        for (let j = 1; j < steps; j++) {
          const ratio = j / steps;
          
          // Catmull-Rom spline for smoother curves
          let smoothLat, smoothLng;
          
          if (i === 0) {
            // First segment - simple interpolation with slight curve
            smoothLat = current.lat + (next.lat - current.lat) * ratio;
            smoothLng = current.lng + (next.lng - current.lng) * ratio;
          } else if (i === originalPoints.length - 2) {
            // Last segment - simple interpolation with slight curve
            smoothLat = current.lat + (next.lat - current.lat) * ratio;
            smoothLng = current.lng + (next.lng - current.lng) * ratio;
          } else {
            // Middle segments - use Catmull-Rom spline
            const prev = originalPoints[i - 1];
            const nextNext = originalPoints[i + 2] || next;
            
            // Catmull-Rom interpolation
            const t = ratio;
            const t2 = t * t;
            const t3 = t2 * t;
            
            smoothLat = 0.5 * (
              2 * current.lat +
              (-prev.lat + next.lat) * t +
              (2 * prev.lat - 5 * current.lat + 4 * next.lat - nextNext.lat) * t2 +
              (-prev.lat + 3 * current.lat - 3 * next.lat + nextNext.lat) * t3
            );
            
            smoothLng = 0.5 * (
              2 * current.lng +
              (-prev.lng + next.lng) * t +
              (2 * prev.lng - 5 * current.lng + 4 * next.lng - nextNext.lng) * t2 +
              (-prev.lng + 3 * current.lng - 3 * next.lng + nextNext.lng) * t3
            );
          }
          
          smoothedPoints.push({ lat: smoothLat, lng: smoothLng });
        }
      }
      
      // Add the last point
      smoothedPoints.push(originalPoints[originalPoints.length - 1]);

      // Create new smoothed polyline with edit options disabled during creation
      drawnLayersRef.current.clearLayers();
      const smoothedPolyline = window.L.polyline(smoothedPoints, {
        color: 'blue',
        weight: 3
      });
      
      drawnLayersRef.current.addLayer(smoothedPolyline);
      updateRouteState(smoothedPolyline.getLatLngs());
      
      const addedPoints = smoothedPoints.length - originalPoints.length;
      toast.success(`Curve smoothed! Added ${addedPoints} interpolated points. Click again for further refinement.`);
    } catch (error) {
      console.error('Error smoothing curve:', error);
      toast.error('Failed to smooth curve. Please try again.');
    }
  }, [currentDrawnPolylineLatLngs, updateRouteState]);

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

  // Save route to localStorage (temporary save during editing)
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
      const originPort = originPorts.find(p => p.id === selectedOriginPortId);
      const destinationPort = destinationPorts.find(p => p.id === selectedDestinationPortId);

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

      // Use creation time if set, otherwise use current US time
      const timestamp = routeCreatedAt || getUSTimeISOString();
      
      const routeData: SavedRoute = {
        id: routeKey,
        originPort,
        destinationPort,
        polyline: finalPolyline,
        timestamp: timestamp,
        isManual: routeType === 'manual',
      };

      // Get existing routes
      const existingRoutes = JSON.parse(localStorage.getItem('sea_routes') || '[]');
      
      // Remove existing route with same origin-destination if exists
      const filteredRoutes = existingRoutes.filter((route: SavedRoute) => route.id !== routeKey);
      
      // Add new route
      const updatedRoutes = [...filteredRoutes, routeData];
      
      localStorage.setItem('sea_routes', JSON.stringify(updatedRoutes));
      setSavedRoutes(updatedRoutes);
      
      toast.success('Route saved to local storage! Use Final Save to persist to database.');
    } catch (error) {
      console.error('Error saving route:', error);
      toast.error('Failed to save route');
    } finally {
      setIsSaving(false);
    }
  }, [selectedOriginPortId, selectedDestinationPortId, currentDrawnPolylineLatLngs, originPorts, destinationPorts, routeType, routeCreatedAt]);

  // Final save to database - saves segment to ClickHouse
  const finalSaveSegment = useCallback(async () => {
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
      const originPort = originPorts.find(p => p.id === selectedOriginPortId);
      const destinationPort = destinationPorts.find(p => p.id === selectedDestinationPortId);

      if (!originPort || !destinationPort) {
        toast.error('Selected ports not found.');
        return;
      }

      // Construct the final polyline coordinates
      const routeCoordinates: [number, number][] = currentDrawnPolylineLatLngs.map(
        (latlng: any) => [latlng.lat, latlng.lng] as [number, number]
      );

      // Determine route type
      const segmentRouteType = routeType === 'manual' ? 'manual' : 
                               currentDrawnPolylineLatLngs.length > 0 ? 'edited' : 'generated';

      // Save to database via API
      const segmentPayload: Parameters<typeof saveSegment>[0] = {
        originPortId: selectedOriginPortId,
        destinationPortId: selectedDestinationPortId,
        originPort: {
          id: originPort.id,
          name: originPort.name,
          lat: originPort.lat,
          lng: originPort.lng,
          ...((originPort as any).code && { code: (originPort as any).code }),
        },
        destinationPort: {
          id: destinationPort.id,
          name: destinationPort.name,
          lat: destinationPort.lat,
          lng: destinationPort.lng,
          ...((destinationPort as any).code && { code: (destinationPort as any).code }),
        },
        routeCoordinates,
        routeType: segmentRouteType,
        createdBy: 'user',
        metadata: {
          savedAt: getUSTimeISOString(),
          createdAt: routeCreatedAt || getUSTimeISOString(), // Preserve original creation time
          routeType: routeType,
        },
      };
      
      const result = await saveSegment(segmentPayload);
      
      toast.success(
        `Route segment saved to database! Segment ID: ${result.segmentId}, Version: ${result.version}`,
        { duration: 4000 }
      );
      
      // Also update localStorage for backward compatibility
      const routeKey = `${selectedOriginPortId}-${selectedDestinationPortId}`;
      // Use creation time if set, otherwise use current US time
      const timestamp = routeCreatedAt || getUSTimeISOString();
      
      const routeData: SavedRoute = {
        id: routeKey,
        originPort,
        destinationPort,
        polyline: routeCoordinates,
        timestamp: timestamp,
        isManual: routeType === 'manual',
      };

      const existingRoutes = JSON.parse(localStorage.getItem('sea_routes') || '[]');
      const filteredRoutes = existingRoutes.filter((route: SavedRoute) => route.id !== routeKey);
      const updatedRoutes = [...filteredRoutes, routeData];
      localStorage.setItem('sea_routes', JSON.stringify(updatedRoutes));
      setSavedRoutes(updatedRoutes);
    } catch (error) {
      console.error('Error saving segment to database:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to save segment to database');
    } finally {
      setIsSaving(false);
    }
  }, [selectedOriginPortId, selectedDestinationPortId, currentDrawnPolylineLatLngs, originPorts, destinationPorts, routeType, setSavedRoutes, routeCreatedAt]);

  // Clear drawn route
  const clearRoute = useCallback(() => {
    if (drawnLayersRef.current) {
      drawnLayersRef.current.clearLayers();
    }
    updateRouteState(null);
  }, [updateRouteState]);

  // Load existing route for selected port pair (with multi-layer caching)
  const loadExistingRoute = useCallback(async () => {
    if (!selectedOriginPortId || !selectedDestinationPortId) return;
    
    const routeKey = `${selectedOriginPortId}-${selectedDestinationPortId}`;
    
    // Layer 1: Check localStorage (instant, client-side)
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
      const latLngs = polyline.getLatLngs();
      setCurrentDrawnPolylineLatLngs(latLngs);
      
      // Initialize history with the loaded route
      const serializable = Array.isArray(latLngs) 
        ? latLngs.map((ll: any) => ({ lat: ll.lat, lng: ll.lng }))
        : null;
      setRouteHistory([serializable]);
      setHistoryIndex(0);
      
      // Set creation time from loaded route's timestamp
      if (existingRoute.timestamp) {
        setRouteCreatedAt(existingRoute.timestamp);
      }
      
      toast.info('Existing route loaded from cache');
      return;
    }
    
    // Layer 2: Fetch from database (with Redis caching on server-side)
    try {
      const segmentData = await getSegment(selectedOriginPortId, selectedDestinationPortId);
      
      if (segmentData.found && segmentData.segment && window.L && drawnLayersRef.current) {
        const segment = segmentData.segment;
        
        // Clear existing drawn layers
        drawnLayersRef.current.clearLayers();
        
        // Add the route as an editable polyline
        const polyline = window.L.polyline(segment.routeCoordinates, {
          color: 'blue',
          weight: 3
        });
        
        drawnLayersRef.current.addLayer(polyline);
        const latLngs = polyline.getLatLngs();
        setCurrentDrawnPolylineLatLngs(latLngs);
        
        // Initialize history with the loaded route
        const serializable = Array.isArray(latLngs) 
          ? latLngs.map((ll: any) => ({ lat: ll.lat, lng: ll.lng }))
          : null;
        setRouteHistory([serializable]);
        setHistoryIndex(0);
        
        // Set creation time from segment (use createdAt from metadata if available, otherwise use createdAt field)
        const createdAt = segment.metadata?.createdAt || segment.createdAt || segment.updatedAt;
        if (createdAt) {
          setRouteCreatedAt(createdAt);
        }
        
        // Update localStorage for future instant access
        const routeData: SavedRoute = {
          id: routeKey,
          originPort: {
            id: segment.originPortId,
            name: segment.originPort.name,
            lat: segment.originPort.lat,
            lng: segment.originPort.lng,
          },
          destinationPort: {
            id: segment.destinationPortId,
            name: segment.destinationPort.name,
            lat: segment.destinationPort.lat,
            lng: segment.destinationPort.lng,
          },
          polyline: segment.routeCoordinates,
          timestamp: createdAt || segment.updatedAt,
          isManual: segment.routeType === 'manual',
        };
        
        const existingRoutes = JSON.parse(localStorage.getItem('sea_routes') || '[]');
        const filteredRoutes = existingRoutes.filter((route: SavedRoute) => route.id !== routeKey);
        const updatedRoutes = [...filteredRoutes, routeData];
        localStorage.setItem('sea_routes', JSON.stringify(updatedRoutes));
        setSavedRoutes(updatedRoutes);
        
        toast.success('Route loaded from database');
      }
    } catch (error) {
      // Silently fail - no route found or error fetching
      // User can still create a new route
    }
  }, [selectedOriginPortId, selectedDestinationPortId, savedRoutes, setSavedRoutes]);

  // Clear drawn route and reset history when ports change
  useEffect(() => {
    // Stop edit tracking if active
    if (editTrackingIntervalRef.current) {
      clearInterval(editTrackingIntervalRef.current);
      editTrackingIntervalRef.current = null;
    }
    isEditingRef.current = false;
    
    if (drawnLayersRef.current) {
      drawnLayersRef.current.clearLayers();
    }
    setCurrentDrawnPolylineLatLngs(null);
    // Reset history when ports change
    setRouteHistory([]);
    setHistoryIndex(-1);
    // Reset creation time when ports change
    setRouteCreatedAt(null);
  }, [selectedOriginPortId, selectedDestinationPortId]);

  // Cleanup edit tracking on unmount
  useEffect(() => {
    return () => {
      if (editTrackingIntervalRef.current) {
        clearInterval(editTrackingIntervalRef.current);
      }
    };
  }, []);

  // Load existing route when ports are selected (checks localStorage first, then DB)
  useEffect(() => {
    if (selectedOriginPortId && selectedDestinationPortId) {
      loadExistingRoute();
    }
  }, [selectedOriginPortId, selectedDestinationPortId, loadExistingRoute]);

  // Load saved routes on component mount
  useEffect(() => {
    loadSavedRoutes();
  }, [loadSavedRoutes]);

  // Leaflet initialization
  useEffect(() => {
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
  }, []);

  // Map setup and drawing logic
  useEffect(() => {
    if (!isLeafletLoaded || !window.L || !(window.L as any).Draw) {
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

      // Ensure Leaflet map panes have lower z-index than dropdowns
      if (map.getPane) {
        const mapPane = map.getPane('mapPane');
        if (mapPane) {
          (mapPane as HTMLElement).style.zIndex = '0';
        }
        const tilePane = map.getPane('tilePane');
        if (tilePane) {
          (tilePane as HTMLElement).style.zIndex = '1';
        }
        const overlayPane = map.getPane('overlayPane');
        if (overlayPane) {
          (overlayPane as HTMLElement).style.zIndex = '2';
        }
      }

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
        updateRouteState(layer.getLatLngs());
        setRouteType('manual');
        
        // Set creation time if this is a new route (not already set)
        if (!routeCreatedAt) {
          setRouteCreatedAt(getUSTimeISOString());
        }
        
        toast.success('Route drawn successfully! Use the edit tool to fine-tune.');
      });

      // Event listener for when a layer is edited (final save after editing stops)
      map.on((L as any).Draw.Event.EDITED, (event: any) => {
        const layers = event.layers;
        layers.eachLayer((layer: any) => {
          if (layer instanceof L.Polyline) {
            // Final state is already saved by edit tracking, just update current state
            const latLngs = layer.getLatLngs();
            setCurrentDrawnPolylineLatLngs(latLngs);
            toast.success('Route updated - remember to save your changes');
          }
        });
      });

      // Event listener for when editing starts
      map.on((L as any).Draw.Event.EDITSTART, () => {
        if (startEditTrackingRef.current) {
          startEditTrackingRef.current();
        }
        toast.info('Edit mode active - hold Ctrl/Cmd to move map. Each edit step is tracked for undo/redo.');
      });

      // Event listener for when editing stops
      map.on((L as any).Draw.Event.EDITSTOP, () => {
        if (stopEditTrackingRef.current) {
          stopEditTrackingRef.current();
        }
        toast.info('Edit mode disabled - you can now use Smooth Curve again if needed');
      });

      // Event listener for when a layer is deleted
      map.on((L as any).Draw.Event.DELETED, () => {
        updateRouteState(null);
        toast.info('Route deleted');
      });

      // Event listener for when drawing starts
      map.on((L as any).Draw.Event.DRAWSTART, () => {
        toast.info('Click points to draw your route. Double-click to finish.');
      });

      // Event listener for when drawing stops
      map.on((L as any).Draw.Event.DRAWSTOP, () => {
        // Drawing completed
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

    // Add markers ONLY for selected origin and destination ports
    const selectedPorts: Array<{ port: Port; type: 'origin' | 'destination' }> = [];
    
    if (selectedOriginPortId) {
      const originPort = originPorts.find(p => p.id === selectedOriginPortId);
      if (originPort) {
        selectedPorts.push({ port: originPort, type: 'origin' });
      }
    }
    
    if (selectedDestinationPortId) {
      const destinationPort = destinationPorts.find(p => p.id === selectedDestinationPortId);
      if (destinationPort && destinationPort.id !== selectedOriginPortId) {
        selectedPorts.push({ port: destinationPort, type: 'destination' });
      }
    }
    
    selectedPorts.forEach(({ port, type }) => {
      const markerColor = type === 'origin' ? 'green' : 'red';
      const portLabel = type === 'origin' ? 'Origin Port' : 'Destination Port';

      const portIcon = new L.Icon({
        iconUrl: `https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-${markerColor}.png`,
        iconSize: [25, 41],
        iconAnchor: [12, 41],
        popupAnchor: [1, -34],
        shadowSize: [41, 41]
      });

      const marker = L.marker([port.lat, port.lng], { icon: portIcon })
        .addTo(mapRef.current)
        .bindPopup(`<b>${port.name}</b><br>${portLabel}`);
      
      // Add custom property for identification
      (marker as any).options.customType = 'port';
      (marker as any).options.portType = type;
    });

    // Draw saved route ONLY if it matches the currently selected ports
    if (selectedOriginPortId && selectedDestinationPortId) {
      const routeKey = `${selectedOriginPortId}-${selectedDestinationPortId}`;
      const matchingRoute = savedRoutes.find(route => route.id === routeKey);
      
      if (matchingRoute && matchingRoute.polyline && matchingRoute.polyline.length > 1) {
        const polyline = L.polyline(matchingRoute.polyline, {
          color: 'gray',
          weight: 2,
          dashArray: '5, 5',
          opacity: 0.7
        })
        .addTo(mapRef.current)
        .bindPopup(`Saved Route: ${matchingRoute.originPort.name} to ${matchingRoute.destinationPort.name}`);
        
        // Add custom property for identification
        (polyline as any).options.customType = 'savedRoute';
      }
    }

    // Fit map bounds to selected ports only (if both are selected)
    if (mapRef.current && selectedOriginPortId && selectedDestinationPortId) {
      try {
        const originPort = originPorts.find(p => p.id === selectedOriginPortId);
        const destinationPort = destinationPorts.find(p => p.id === selectedDestinationPortId);
        
        if (originPort && destinationPort) {
          // Validate coordinates
          const isValid = 
            typeof originPort.lat === 'number' && 
            typeof originPort.lng === 'number' && 
            typeof destinationPort.lat === 'number' && 
            typeof destinationPort.lng === 'number' &&
            !isNaN(originPort.lat) && !isNaN(originPort.lng) &&
            !isNaN(destinationPort.lat) && !isNaN(destinationPort.lng) &&
            originPort.lat >= -90 && originPort.lat <= 90 &&
            originPort.lng >= -180 && originPort.lng <= 180 &&
            destinationPort.lat >= -90 && destinationPort.lat <= 90 &&
            destinationPort.lng >= -180 && destinationPort.lng <= 180;
          
          if (isValid) {
            const bounds = L.latLngBounds(
              [[originPort.lat, originPort.lng], [destinationPort.lat, destinationPort.lng]]
            );
            mapRef.current.fitBounds(bounds.pad(0.15), { maxZoom: 10, duration: 500 });
          }
        }
      } catch (error) {
        // Fallback handled below
      }
    } else if (mapRef.current && (selectedOriginPortId || selectedDestinationPortId)) {
      // If only one port is selected, center on it
      try {
        const selectedPort = selectedOriginPortId 
          ? originPorts.find(p => p.id === selectedOriginPortId)
          : destinationPorts.find(p => p.id === selectedDestinationPortId);
        
        if (selectedPort && 
            typeof selectedPort.lat === 'number' && 
            typeof selectedPort.lng === 'number' &&
            !isNaN(selectedPort.lat) && !isNaN(selectedPort.lng)) {
          mapRef.current.setView([selectedPort.lat, selectedPort.lng], 8);
        }
      } catch (error) {
        // Fallback handled below
      }
    } else if (mapRef.current) {
      // Default view if no ports selected
      mapRef.current.setView([25.0, -80.0], 6);
    }

  }, [isLeafletLoaded, originPorts, destinationPorts, selectedOriginPortId, selectedDestinationPortId, savedRoutes, isCtrlPressed, routeCreatedAt, updateRouteState]);

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-ocean-blue/5 to-deep-blue/10 p-4 md:p-6">
      {/* Page header */}
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
      <Card className="mb-6 relative z-10">
        <CardContent className="pt-6">
          {/* Labels row with undo/redo buttons */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-6">
              <label className="text-sm font-medium text-charcoal">
                Origin Port
              </label>
              <label className="text-sm font-medium text-charcoal">
                Destination Port
              </label>
            </div>
            <div className="flex items-center gap-2">
              <Button
                onClick={undoRoute}
                disabled={historyIndex <= 0}
                variant="outline"
                size="sm"
                className="h-8 w-8 p-0"
                title="Undo"
              >
                <Undo className="h-4 w-4" />
              </Button>
              <Button
                onClick={redoRoute}
                disabled={historyIndex >= routeHistory.length - 1}
                variant="outline"
                size="sm"
                className="h-8 w-8 p-0"
                title="Redo"
              >
                <Redo className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-6 gap-4 items-end">
            <div className="relative z-10">
              <Select
                value={selectedOriginPortId}
                onValueChange={setSelectedOriginPortId}
                disabled={isLoadingOriginPorts || originPorts.length === 0}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select Origin" />
                </SelectTrigger>
                <SearchableSelectContent
                  searchValue={originSearch}
                  onSearchChange={(value) => handleSearch(value, true)}
                  onOpenChange={(open) => {}}
                  isOrigin={true}
                  loadMorePorts={loadMoreOriginPorts}
                  isLoadingMore={isLoadingMoreOriginPorts}
                  hasMore={hasMoreOriginPorts}
                >
                  {originPorts.map(port => (
                    <SelectItem key={port.id} value={port.id}>
                      {port.name}
                    </SelectItem>
                  ))}
                </SearchableSelectContent>
              </Select>
            </div>

            <div className="relative z-10">
              <Select
                value={selectedDestinationPortId}
                onValueChange={setSelectedDestinationPortId}
                disabled={isLoadingDestinationPorts || destinationPorts.length === 0}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select Destination" />
                </SelectTrigger>
                <SearchableSelectContent
                  searchValue={destinationSearch}
                  onSearchChange={(value) => handleSearch(value, false)}
                  onOpenChange={(open) => {}}
                  isOrigin={false}
                  loadMorePorts={loadMoreDestinationPorts}
                  isLoadingMore={isLoadingMoreDestinationPorts}
                  hasMore={hasMoreDestinationPorts}
                >
                  {destinationPorts.map(port => (
                    <SelectItem key={port.id} value={port.id}>
                      {port.name}
                    </SelectItem>
                  ))}
                </SearchableSelectContent>
              </Select>
            </div>

            <Button
              onClick={generateSeaRoute}
              disabled={
                isLoadingSeaRoute ||
                !selectedOriginPortId ||
                !selectedDestinationPortId ||
                originPorts.length === 0 ||
                destinationPorts.length === 0
              }
              className="bg-blue-600 hover:bg-blue-700"
            >
              {isLoadingSeaRoute ? 'Generating...' : 'Generate SeaRoute'}
            </Button>

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
              Save Route
            </Button>

            <Button
              onClick={clearRoute}
              variant="destructive"
            >
              Clear Route
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Map Container */}
      <Card className="relative z-0">
        <CardContent className="p-0">
          <div 
            id="route-map" 
            className="w-full h-[600px] rounded-lg bg-gray-200 flex items-center justify-center text-gray-500 relative z-0"
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
            <li>Click &quot;Generate SeaRoute&quot; to auto-generate a route, or use the polyline drawing tool to draw manually</li>
            <li>Click points on the map to create your route path</li>
            <li>Double-click to finish drawing the route</li>
            <li>Use the edit tool (pencil icon) to modify vertices and smooth curves manually</li>
            <li><strong>Click &quot;Smooth Curve&quot; repeatedly to progressively refine the curve until satisfied</strong></li>
            <li><strong>Hold Ctrl (or Cmd on Mac) while editing to move the map</strong></li>
            <li>Click &quot;Save Route&quot; to temporarily save the route (local storage)</li>
            <li>Click &quot;Final Save&quot; below to permanently save the route segment to database</li>
            <li>Existing routes will appear as gray dashed lines</li>
            <li>Green markers show origin ports, red markers show destinations</li>
          </ol>
        </CardContent>
      </Card>

      {/* Final Save Button */}
      <Card className="mt-6">
        <CardContent className="pt-6">
          <div className="flex justify-center">
            <Button
              onClick={finalSaveSegment}
              disabled={
                !selectedOriginPortId ||
                !selectedDestinationPortId ||
                !currentDrawnPolylineLatLngs ||
                isSaving
              }
              className="bg-green-600 hover:bg-green-700 text-white px-8 py-6 text-lg font-semibold"
              size="lg"
            >
              {isSaving ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2 inline-block"></div>
                  Saving to Database...
                </>
              ) : (
                'Final Save'
              )}
            </Button>
          </div>
          <p className="text-center text-sm text-slate-gray mt-4">
            This will save the route segment to the database.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default SeaRouteConfiguration;
