
import * as turf from '@turf/turf';

export interface Port {
  id: string;
  name: string;
  coordinates: [number, number];
  country: string;
  region: string;
  type: 'major_terminal' | 'secondary' | 'private' | 'under_construction';
  cruiseLines: string[];
  facilities: string[];
  capacity: number;
  description: string;
  attractions: string[];
  photos: string[];
  weather: { temp: number; condition: string };
  rating: number;
  reviews: number;
}

export interface RouteSegment {
  start: [number, number];
  end: [number, number];
  type: 'sea' | 'land';
  style: 'solid' | 'dotted';
  distance: number;
}

export interface MaritimeRoute {
  coordinates: [number, number][];
  segments: RouteSegment[];
  distance: number;
  type: 'sea_only' | 'mixed';
  duration: string;
}

export class MaritimeRouteCalculator {
  private canalRoutes = {
    panama: { coords: [[-79.5, 9.0], [-79.7, 9.4]] as [number, number][], type: 'canal' },
    suez: { coords: [[32.3, 30.0], [32.4, 30.5]] as [number, number][], type: 'canal' }
  };

  // Sample coastline data - simplified landmasses for demo
  private majorLandmasses = [
    // North America (simplified)
    turf.polygon([[
      [-125, 50], [-67, 50], [-67, 25], [-97, 25], [-97, 30], [-125, 30], [-125, 50]
    ]]),
    // Europe (simplified)
    turf.polygon([[
      [-10, 35], [40, 35], [40, 71], [-10, 71], [-10, 35]
    ]]),
    // Africa (simplified)
    turf.polygon([[
      [-20, -35], [52, -35], [52, 37], [-20, 37], [-20, -35]
    ]])
  ];

  calculateSeaRoute(startPort: Port, endPort: Port): MaritimeRoute {
    const route = this.findMaritimeRoute(startPort.coordinates, endPort.coordinates);
    return {
      coordinates: route.coordinates,
      segments: this.classifyRouteSegments(route.coordinates),
      distance: route.distance,
      type: route.hasLandSegment ? 'mixed' : 'sea_only',
      duration: this.calculateDuration(route.distance)
    };
  }

  private crossesLand(point1: [number, number], point2: [number, number]): boolean {
    const line = turf.lineString([point1, point2]);
    return this.majorLandmasses.some(landmass => 
      turf.booleanIntersects(line, landmass)
    );
  }

  private findMaritimeRoute(start: [number, number], end: [number, number]): { coordinates: [number, number][]; distance: number; hasLandSegment: boolean } {
    if (!this.crossesLand(start, end)) {
      return this.createGreatCircleRoute(start, end);
    }
    return this.calculateRouteAroundLand(start, end);
  }

  private createGreatCircleRoute(start: [number, number], end: [number, number]): { coordinates: [number, number][]; distance: number; hasLandSegment: boolean } {
    const bearing = turf.bearing(start, end);
    const distance = turf.distance(start, end);
    const steps = Math.max(10, Math.floor(distance / 100));
    
    const coordinates: [number, number][] = [];
    for (let i = 0; i <= steps; i++) {
      const stepDistance = (distance * i) / steps;
      const point = turf.destination(start, stepDistance, bearing);
      coordinates.push(point.geometry.coordinates as [number, number]);
    }
    
    return { coordinates, distance, hasLandSegment: false };
  }

  private calculateRouteAroundLand(start: [number, number], end: [number, number]): { coordinates: [number, number]; distance: number; hasLandSegment: boolean } {
    // Simplified routing around land - find waypoints
    const waypoints = this.findCoastalWaypoints(start, end);
    const coordinates = [start, ...waypoints, end];
    const smoothedRoute = this.smoothRouteWithCurves(coordinates);
    
    return {
      coordinates: smoothedRoute,
      distance: this.calculateTotalDistance(smoothedRoute),
      hasLandSegment: false
    };
  }

  private findCoastalWaypoints(start: [number, number], end: [number, number]): [number, number][] {
    // Simplified waypoint calculation
    const midPoint = turf.midpoint(start, end);
    const bearing = turf.bearing(start, end);
    const perpBearing = bearing + 90;
    const waypoint = turf.destination(midPoint.geometry.coordinates as [number, number], 200, perpBearing);
    return [waypoint.geometry.coordinates as [number, number]];
  }

  private smoothRouteWithCurves(coordinates: [number, number][]): [number, number][] {
    if (coordinates.length < 3) return coordinates;
    
    const smoothed: [number, number][] = [coordinates[0]];
    
    for (let i = 1; i < coordinates.length - 1; i++) {
      const prev = coordinates[i - 1];
      const curr = coordinates[i];
      const next = coordinates[i + 1];
      
      const curve = this.createBezierCurve(prev, curr, next);
      smoothed.push(...curve);
    }
    
    smoothed.push(coordinates[coordinates.length - 1]);
    return smoothed;
  }

  private createBezierCurve(prev: [number, number], curr: [number, number], next: [number, number]): [number, number][] {
    const curve: [number, number][] = [];
    const steps = 5;
    
    for (let i = 1; i < steps; i++) {
      const t = i / steps;
      const x = (1 - t) * prev[0] + t * curr[0];
      const y = (1 - t) * prev[1] + t * curr[1];
      curve.push([x, y]);
    }
    
    return curve;
  }

  private classifyRouteSegments(coordinates: [number, number][]): RouteSegment[] {
    const segments: RouteSegment[] = [];
    
    for (let i = 0; i < coordinates.length - 1; i++) {
      const start = coordinates[i];
      const end = coordinates[i + 1];
      const isSeaRoute = !this.crossesLand(start, end);
      const distance = turf.distance(start, end);
      
      segments.push({
        start,
        end,
        type: isSeaRoute ? 'sea' : 'land',
        style: isSeaRoute ? 'solid' : 'dotted',
        distance
      });
    }
    
    return segments;
  }

  private calculateTotalDistance(coordinates: [number, number][]): number {
    let total = 0;
    for (let i = 0; i < coordinates.length - 1; i++) {
      total += turf.distance(coordinates[i], coordinates[i + 1]);
    }
    return total;
  }

  private calculateDuration(distance: number): string {
    const speedKnots = 20; // Average cruise ship speed
    const hours = distance / (speedKnots * 1.852); // Convert nautical miles to km
    const days = Math.ceil(hours / 24);
    return `${days} day${days !== 1 ? 's' : ''}`;
  }
}
