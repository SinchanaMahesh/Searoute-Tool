import { NextRequest, NextResponse } from 'next/server';

// Force dynamic rendering for this route (POST endpoint with dynamic data)
export const dynamic = 'force-dynamic';
export const revalidate = 0; // Disable caching

// Dynamic import for searoute-js to avoid webpack bundling issues
// This is loaded at runtime on the server, not bundled
let searouteModule: any = null;

const getSearoute = async () => {
  if (!searouteModule) {
    searouteModule = await import('searoute-js');
  }
  return searouteModule.default || searouteModule;
};

type RouteRequestBody = {
  origin: { lat: number; lng: number };
  dest: { lat: number; lng: number };
  units?: 'degrees' | 'radians' | 'miles' | 'kilometers' | 'nautical miles';
};

export async function POST(request: NextRequest) {
  try {
    const body = await request.json() as RouteRequestBody;
    const { origin, dest, units = 'kilometers' } = body;

    if (
      !origin ||
      !dest ||
      typeof origin.lat !== 'number' ||
      typeof origin.lng !== 'number' ||
      typeof dest.lat !== 'number' ||
      typeof dest.lng !== 'number'
    ) {
      return NextResponse.json({ error: 'Invalid origin/destination coordinates' }, { status: 400 });
    }

    // searoute-js expects GeoJSON Point features with [lng, lat] coordinates
    const originFeature = {
      type: 'Feature' as const,
      properties: {} as Record<string, unknown>,
      geometry: {
        type: 'Point' as const,
        coordinates: [origin.lng, origin.lat] as [number, number],
      },
    };

    const destinationFeature = {
      type: 'Feature' as const,
      properties: {} as Record<string, unknown>,
      geometry: {
        type: 'Point' as const,
        coordinates: [dest.lng, dest.lat] as [number, number],
      },
    };

    // Call searoute-js function
    const searoute = await getSearoute();
    const routeFeature = searoute(originFeature, destinationFeature, units);

    if (
      !routeFeature ||
      !routeFeature.geometry ||
      routeFeature.geometry.type !== 'LineString' ||
      !routeFeature.geometry.coordinates
    ) {
      return NextResponse.json({ coordinates: [] });
    }

    return NextResponse.json({
      coordinates: routeFeature.geometry.coordinates as number[][],
    });
  } catch (error) {
    console.error('Error calculating sea route on server:', error);
    return NextResponse.json({ error: 'Failed to calculate sea route' }, { status: 500 });
  }
}

