import { NextRequest, NextResponse } from 'next/server';
import { clickhouseClient } from '@/config/clickhouse';
import { getRedisClient } from '@/config/redis';
import { getUSTimeISOString, getUSTimeForClickHouse, convertToClickHouseDateTime } from '@/lib/utils/dateUtils';

// Force dynamic rendering for this route (POST endpoint with dynamic data)
export const dynamic = 'force-dynamic';
export const revalidate = 0; // Disable caching

interface SegmentSaveRequest {
  originPortId: string;
  destinationPortId: string;
  originPort: {
    id: string;
    name: string;
    code?: string;
    lat: number;
    lng: number;
  };
  destinationPort: {
    id: string;
    name: string;
    code?: string;
    lat: number;
    lng: number;
  };
  routeCoordinates: [number, number][];
  routeType: 'generated' | 'manual' | 'edited';
  createdBy?: string;
  metadata?: Record<string, any>;
}

// Calculate distance between two points using Haversine formula
function calculateDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): { nauticalMiles: number; kilometers: number } {
  const R_NAUTICAL = 3440.065;
  const R_KM = 6371;

  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  const nauticalMiles = R_NAUTICAL * c;
  const kilometers = R_KM * c;

  return { nauticalMiles, kilometers };
}

// Calculate total route distance
function calculateRouteDistance(coordinates: [number, number][]): {
  nauticalMiles: number;
  kilometers: number;
} {
  if (coordinates.length < 2) {
    return { nauticalMiles: 0, kilometers: 0 };
  }

  let totalNauticalMiles = 0;
  let totalKilometers = 0;

  for (let i = 0; i < coordinates.length - 1; i++) {
    const [lat1, lng1] = coordinates[i];
    const [lat2, lng2] = coordinates[i + 1];
    const dist = calculateDistance(lat1, lng1, lat2, lng2);
    totalNauticalMiles += dist.nauticalMiles;
    totalKilometers += dist.kilometers;
  }

  return { nauticalMiles: totalNauticalMiles, kilometers: totalKilometers };
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json() as SegmentSaveRequest;
    const {
      originPortId,
      destinationPortId,
      originPort,
      destinationPort,
      routeCoordinates,
      routeType,
      createdBy = 'system',
      metadata = {},
    } = body;

    // Validation
    if (
      !originPortId ||
      !destinationPortId ||
      !originPort ||
      !destinationPort ||
      !routeCoordinates ||
      !Array.isArray(routeCoordinates) ||
      routeCoordinates.length < 2
    ) {
      return NextResponse.json({ error: 'Invalid segment data' }, { status: 400 });
    }

    if (originPortId === destinationPortId) {
      return NextResponse.json({
        error: 'Origin and destination ports cannot be the same',
      }, { status: 400 });
    }

    // Calculate distances
    const distances = calculateRouteDistance(routeCoordinates);

    // Create segment ID
    const segmentId = `${originPortId}-${destinationPortId}`;

    // Prepare route coordinates as JSON string
    const routeCoordinatesJson = JSON.stringify(routeCoordinates);

    // Prepare metadata as JSON string
    const metadataJson = JSON.stringify(metadata);

    // Check if segment already exists - get created_at to preserve it
    const checkQuery = `
      SELECT segment_id, version, created_at, metadata
      FROM cruise_master.searoute_segments
      WHERE segment_id = {segmentId:String} AND is_active = 1
      ORDER BY updated_at DESC
      LIMIT 1
    `;
    
    // Get the maximum version across ALL segments (active or inactive) to ensure proper incrementing
    const maxVersionQuery = `
      SELECT MAX(version) as max_version
      FROM cruise_master.searoute_segments
      WHERE segment_id = {segmentId:String}
    `;
    
    // Also get the first version's created_at to preserve original creation time
    const firstVersionQuery = `
      SELECT created_at, metadata
      FROM cruise_master.searoute_segments
      WHERE segment_id = {segmentId:String}
      ORDER BY version ASC
      LIMIT 1
    `;

    const existingResult = await clickhouseClient.query({
      query: checkQuery,
      query_params: { segmentId },
      format: 'JSONEachRow',
    });
    
    const maxVersionResult = await clickhouseClient.query({
      query: maxVersionQuery,
      query_params: { segmentId },
      format: 'JSONEachRow',
    });
    
    const firstVersionResult = await clickhouseClient.query({
      query: firstVersionQuery,
      query_params: { segmentId },
      format: 'JSONEachRow',
    });

    const existing = (await existingResult.json()) as any[];
    const maxVersionData = (await maxVersionResult.json()) as any[];
    const firstVersion = (await firstVersionResult.json()) as any[];
    
    // Get the maximum version number (convert to number if it's a string)
    const maxVersion = maxVersionData.length > 0 && maxVersionData[0].max_version 
      ? Number(maxVersionData[0].max_version) || 0 
      : 0;
    
    // Calculate new version: max version + 1, or 1 if no versions exist
    const newVersion = maxVersion > 0 ? maxVersion + 1 : 1;
    
    // Get original created_at from first version (original creation time)
    let originalCreatedAt: string | null = null;
    if (firstVersion.length > 0) {
      // Try to get from first version's created_at (original creation time)
      originalCreatedAt = firstVersion[0].created_at;
      
      // If not found, try to get from first version's metadata
      if (!originalCreatedAt) {
        try {
          const firstMetadata = JSON.parse(firstVersion[0].metadata || '{}');
          originalCreatedAt = firstMetadata.createdAt || null;
        } catch (e) {
          // Ignore parse errors
        }
      }
    }
    
    // Fallback to current active version if first version doesn't have it
    if (!originalCreatedAt && existing.length > 0) {
      originalCreatedAt = existing[0].created_at;
      if (!originalCreatedAt) {
        try {
          const existingMetadata = JSON.parse(existing[0].metadata || '{}');
          originalCreatedAt = existingMetadata.createdAt || null;
        } catch (e) {
          // Ignore parse errors
        }
      }
    }
    
    // Use createdAt from metadata if provided, otherwise use original from database, otherwise use current US time
    // For ClickHouse, we need to convert to DateTime format (YYYY-MM-DD HH:MM:SS)
    const createdAtISO = metadata?.createdAt || originalCreatedAt || getUSTimeISOString();
    const updatedAtISO = getUSTimeISOString(); // Always use current US time for updated_at
    
    // Convert to ClickHouse DateTime format
    const createdAt = convertToClickHouseDateTime(createdAtISO);
    const updatedAt = getUSTimeForClickHouse(); // Always use current US time for updated_at

    // Deactivate old version if exists
    if (existing.length > 0) {
      const deactivateQuery = `
        ALTER TABLE cruise_master.searoute_segments
        UPDATE is_active = 0
        WHERE segment_id = {segmentId:String} AND is_active = 1
      `;
      await clickhouseClient.command({
        query: deactivateQuery,
        query_params: { segmentId },
      });
    }

    // Ensure createdAt is in metadata
    const finalMetadata = {
      ...metadata,
      createdAt: createdAt,
      savedAt: updatedAt,
    };
    const finalMetadataJson = JSON.stringify(finalMetadata);

    // Insert new segment with explicit created_at and updated_at
    await clickhouseClient.insert({
      table: 'searoute_segments',
      values: [
        {
          segment_id: segmentId,
          origin_port_id: originPortId,
          destination_port_id: destinationPortId,
          origin_port_code: originPort.code || '',
          origin_port_name: originPort.name,
          origin_port_latitude: originPort.lat,
          origin_port_longitude: originPort.lng,
          destination_port_code: destinationPort.code || '',
          destination_port_name: destinationPort.name,
          destination_port_latitude: destinationPort.lat,
          destination_port_longitude: destinationPort.lng,
          route_coordinates: routeCoordinatesJson,
          route_coordinates_count: routeCoordinates.length,
          route_type: routeType,
          distance_nautical_miles: distances.nauticalMiles,
          distance_kilometers: distances.kilometers,
          created_by: createdBy,
          is_active: 1,
          version: newVersion,
          created_at: createdAt,  // Explicitly set to preserve original creation time
          updated_at: updatedAt,  // Always set to current time
          metadata: finalMetadataJson,
        },
      ],
      format: 'JSONEachRow',
    });

    // Invalidate Redis cache for this segment
    try {
      const redis = await getRedisClient();
      if (redis) {
        const cacheKey = `segment:${segmentId}`;
        await redis.del(cacheKey);
      }
    } catch (redisError) {
      // Ignore Redis errors - save was successful
    }

    return NextResponse.json({
      success: true,
      segmentId,
      version: newVersion,
      message: 'Route segment saved successfully',
    });
  } catch (error) {
    console.error('Error saving route segment:', error);
    return NextResponse.json({
      error: 'Failed to save route segment',
      details: error instanceof Error ? error.message : 'Unknown error',
    }, { status: 500 });
  }
}

