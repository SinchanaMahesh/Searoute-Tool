/**
 * Route Service
 * Handles sea route generation
 */

export interface RouteRequest {
  origin: { lat: number; lng: number };
  dest: { lat: number; lng: number };
  units?: 'degrees' | 'radians' | 'miles' | 'kilometers' | 'nautical miles';
}

export interface RouteResponse {
  coordinates: number[][];
}

export const generateSeaRoute = async (
  request: RouteRequest
): Promise<RouteResponse> => {
  const response = await fetch('/api/ports/route', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(request),
  });

  if (!response.ok) {
    throw new Error(`SeaRoute API error: ${response.status}`);
  }

  const data = await response.json();

  if (!data.coordinates || !Array.isArray(data.coordinates) || data.coordinates.length === 0) {
    throw new Error('No sea route found for the selected ports');
  }

  return data;
};

