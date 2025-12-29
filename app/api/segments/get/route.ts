import { NextRequest, NextResponse } from 'next/server';
import { clickhouseClient } from '@/config/clickhouse';
import { getRedisClient, CACHE_TTL_LONG } from '@/config/redis';

// Force dynamic rendering for this route (uses searchParams)
export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const originPortId = searchParams.get('originPortId');
    const destinationPortId = searchParams.get('destinationPortId');

    if (!originPortId || !destinationPortId) {
      return NextResponse.json({ error: 'Origin and destination port IDs are required' }, { status: 400 });
    }

    if (originPortId === destinationPortId) {
      return NextResponse.json({ error: 'Origin and destination ports cannot be the same' }, { status: 400 });
    }

    const segmentId = `${originPortId}-${destinationPortId}`;
    const cacheKey = `segment:${segmentId}`;

    // Try Redis cache first
    try {
      const redis = await getRedisClient();
      if (redis) {
        const cached = await redis.get(cacheKey);
        if (cached) {
          return NextResponse.json(JSON.parse(cached));
        }
      }
    } catch (redisError) {
      // Continue to database if Redis fails
    }

    // Query database for active segment
    const query = `
      SELECT 
        segment_id,
        origin_port_id,
        destination_port_id,
        origin_port_code,
        origin_port_name,
        origin_port_latitude,
        origin_port_longitude,
        destination_port_code,
        destination_port_name,
        destination_port_latitude,
        destination_port_longitude,
        route_coordinates,
        route_coordinates_count,
        route_type,
        distance_nautical_miles,
        distance_kilometers,
        created_at,
        updated_at,
        created_by,
        version,
        metadata
      FROM cruise_master.searoute_segments
      WHERE origin_port_id = {originPortId:String}
        AND destination_port_id = {destinationPortId:String}
        AND is_active = 1
      ORDER BY updated_at DESC
      LIMIT 1
    `;

    const result = await clickhouseClient.query({
      query,
      query_params: {
        originPortId,
        destinationPortId,
      },
      format: 'JSONEachRow',
    });

    const rows = (await result.json()) as any[];

    if (rows.length === 0) {
      // Cache "not found" result for a shorter time
      try {
        const redis = await getRedisClient();
        if (redis) {
          await redis.setEx(cacheKey, 60, JSON.stringify({ found: false }));
        }
      } catch (redisError) {
        // Ignore Redis errors
      }
      return NextResponse.json({ found: false });
    }

    const segment = rows[0];
    
    // Parse JSON fields
    let routeCoordinates: [number, number][] = [];
    let metadata: Record<string, any> = {};
    
    try {
      routeCoordinates = JSON.parse(segment.route_coordinates || '[]');
    } catch (e) {
      console.warn('Error parsing route_coordinates:', e);
    }
    
    try {
      metadata = JSON.parse(segment.metadata || '{}');
    } catch (e) {
      console.warn('Error parsing metadata:', e);
    }

    const response = {
      found: true,
      segment: {
        segmentId: segment.segment_id,
        originPortId: segment.origin_port_id,
        destinationPortId: segment.destination_port_id,
        originPort: {
          code: segment.origin_port_code,
          name: segment.origin_port_name,
          lat: segment.origin_port_latitude,
          lng: segment.origin_port_longitude,
        },
        destinationPort: {
          code: segment.destination_port_code,
          name: segment.destination_port_name,
          lat: segment.destination_port_latitude,
          lng: segment.destination_port_longitude,
        },
        routeCoordinates,
        routeCoordinatesCount: segment.route_coordinates_count,
        routeType: segment.route_type,
        distanceNauticalMiles: segment.distance_nautical_miles,
        distanceKilometers: segment.distance_kilometers,
        createdAt: segment.created_at,
        updatedAt: segment.updated_at,
        createdBy: segment.created_by,
        version: segment.version,
        metadata,
      },
    };

    // Cache the result in Redis
    try {
      const redis = await getRedisClient();
      if (redis) {
        await redis.setEx(cacheKey, CACHE_TTL_LONG, JSON.stringify(response));
      }
    } catch (redisError) {
      // Ignore Redis errors - response is still valid
    }

    return NextResponse.json(response);
  } catch (error) {
    console.error('Error fetching route segment:', error);
    return NextResponse.json({
      error: 'Failed to fetch route segment',
      details: error instanceof Error ? error.message : 'Unknown error',
    }, { status: 500 });
  }
}

