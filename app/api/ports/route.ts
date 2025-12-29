import { NextRequest, NextResponse } from 'next/server';
import { clickhouseClient } from '@/config/clickhouse';
import { getRedisClient, CACHE_TTL, POPULAR_SEARCHES } from '@/config/redis';

// Force dynamic rendering for this route (uses searchParams)
export const dynamic = 'force-dynamic';
export const revalidate = 0; // Disable caching

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const offset = parseInt(searchParams.get('offset') || '0');
    const limit = parseInt(searchParams.get('limit') || '100');
    const search = searchParams.get('search')?.trim().toLowerCase() || '';

    // Create cache key
    const cacheKey = search
      ? `ports:search:${search}:offset:${offset}:limit:${limit}`
      : `ports:offset:${offset}:limit:${limit}`;

    // Check if this is a popular search term
    const isPopularSearch = search && POPULAR_SEARCHES.some(term => search.startsWith(term));

    // Try to get from cache if it's a popular search or no search term
    if (isPopularSearch || !search) {
      try {
        const redis = await getRedisClient();
        if (redis) {
          const cached = await redis.get(cacheKey);
          if (cached) {
            return NextResponse.json(JSON.parse(cached));
          }
        }
      } catch (redisError) {
        console.warn('Redis cache read error (continuing without cache):', redisError);
      }
    }

    // Build WHERE clause with search filter
    let whereClause = "p.port_status = 'true'";
    let searchPattern = '';
    if (search) {
      const escapedSearch = search.replace(/'/g, "''");
      searchPattern = `${escapedSearch}%`;
      whereClause += ` AND LOWER(p.port_name) LIKE '${searchPattern}'`;
    }

    const query = `
      SELECT DISTINCT 
        p.port_id,
        p.port_code,
        p.port_name,
        p.port_country_code,
        p.port_country_name,
        p.port_state_code,
        p.port_state_name,
        p.port_latitude,
        p.port_longitude
      FROM cruise_master.port p
      WHERE ${whereClause}
      ORDER BY p.port_name
      LIMIT ${limit} OFFSET ${offset}
    `;

    const result = await clickhouseClient.query({
      query,
      format: 'JSONEachRow',
    });

    const rows = (await result.json()) as any[];

    // Get total count for pagination info
    const countQuery = `
      SELECT COUNT(DISTINCT p.port_id) as total
      FROM cruise_master.port p
      WHERE ${whereClause}
    `;

    const countResult = await clickhouseClient.query({
      query: countQuery,
      format: 'JSONEachRow',
    });

    const countData = (await countResult.json()) as any[];
    const total = countData[0]?.total || 0;

    const response = {
      ports: rows,
      total,
      offset,
      limit,
      hasMore: offset + rows.length < total,
      search,
    };

    // Cache the response if it's a popular search or no search term
    if (isPopularSearch || !search) {
      try {
        const redis = await getRedisClient();
        if (redis) {
          await redis.setEx(cacheKey, CACHE_TTL, JSON.stringify(response));
        }
      } catch (redisError) {
        console.warn('Redis cache write error (continuing without cache):', redisError);
      }
    }

    return NextResponse.json(response);
  } catch (error) {
    console.error('Error fetching ports from ClickHouse:', error);
    return NextResponse.json({ error: 'Failed to fetch ports' }, { status: 500 });
  }
}

