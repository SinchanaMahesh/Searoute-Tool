
interface Port {
  id: string;
  name: string;
  lat: number;
  lng: number;
}

interface SeaRoute {
  id: string;
  originPort: Port;
  destinationPort: Port;
  polyline: [number, number][];
  timestamp: string;
}

const STORAGE_KEY = 'sea_routes';

export class SeaRouteApi {
  
  // Get all saved routes
  static getAllRoutes(): SeaRoute[] {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch (error) {
      console.error('Error loading routes:', error);
      return [];
    }
  }

  // Get route by port pair
  static getRouteByPortPair(originPortId: string, destinationPortId: string): SeaRoute | null {
    const routes = this.getAllRoutes();
    const routeKey = `${originPortId}-${destinationPortId}`;
    return routes.find(route => route.id === routeKey) || null;
  }

  // Save or update a route
  static saveRoute(route: SeaRoute): boolean {
    try {
      const routes = this.getAllRoutes();
      const existingIndex = routes.findIndex(r => r.id === route.id);
      
      if (existingIndex >= 0) {
        routes[existingIndex] = route;
      } else {
        routes.push(route);
      }
      
      localStorage.setItem(STORAGE_KEY, JSON.stringify(routes));
      return true;
    } catch (error) {
      console.error('Error saving route:', error);
      return false;
    }
  }

  // Delete a route
  static deleteRoute(routeId: string): boolean {
    try {
      const routes = this.getAllRoutes();
      const filteredRoutes = routes.filter(route => route.id !== routeId);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(filteredRoutes));
      return true;
    } catch (error) {
      console.error('Error deleting route:', error);
      return false;
    }
  }

  // Check if route exists for port pair
  static routeExists(originPortId: string, destinationPortId: string): boolean {
    const routeKey = `${originPortId}-${destinationPortId}`;
    const routes = this.getAllRoutes();
    return routes.some(route => route.id === routeKey);
  }

  // Create route key from port IDs
  static createRouteKey(originPortId: string, destinationPortId: string): string {
    return `${originPortId}-${destinationPortId}`;
  }

  // Validate polyline coordinates
  static validatePolyline(polyline: [number, number][]): boolean {
    if (!Array.isArray(polyline) || polyline.length < 2) {
      return false;
    }
    
    return polyline.every(coord => 
      Array.isArray(coord) && 
      coord.length === 2 && 
      typeof coord[0] === 'number' && 
      typeof coord[1] === 'number' &&
      coord[0] >= -90 && coord[0] <= 90 && // Valid latitude
      coord[1] >= -180 && coord[1] <= 180 // Valid longitude
    );
  }

  // Get routes by origin port
  static getRoutesByOriginPort(originPortId: string): SeaRoute[] {
    const routes = this.getAllRoutes();
    return routes.filter(route => route.originPort.id === originPortId);
  }

  // Get routes by destination port
  static getRoutesByDestinationPort(destinationPortId: string): SeaRoute[] {
    const routes = this.getAllRoutes();
    return routes.filter(route => route.destinationPort.id === destinationPortId);
  }

  // Export all routes as JSON
  static exportRoutes(): string {
    const routes = this.getAllRoutes();
    return JSON.stringify(routes, null, 2);
  }

  // Import routes from JSON
  static importRoutes(jsonData: string): boolean {
    try {
      const routes = JSON.parse(jsonData);
      if (Array.isArray(routes)) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(routes));
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error importing routes:', error);
      return false;
    }
  }

  // Clear all routes
  static clearAllRoutes(): boolean {
    try {
      localStorage.removeItem(STORAGE_KEY);
      return true;
    } catch (error) {
      console.error('Error clearing routes:', error);
      return false;
    }
  }
}

export default SeaRouteApi;
