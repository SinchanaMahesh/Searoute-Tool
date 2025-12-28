/**
 * Route-related type definitions
 */

export interface Port {
  id: string;
  name: string;
  lat: number;
  lng: number;
}

export interface SavedRoute {
  id: string;
  originPort: Port;
  destinationPort: Port;
  polyline: [number, number][];
  timestamp: string;
  isManual?: boolean;
}

