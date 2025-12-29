import { createClient } from '@clickhouse/client';

let client: ReturnType<typeof createClient> | null = null;

function requireEnv(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing required env variable: ${name}`);
  }
  return value;
}

export function getClickHouseClient() {
  // Prevent client creation during build - return a mock or throw
  if (client) return client;

  // Priority: CLICKHOUSE_LOCAL_HOST (for local dev) > CLICKHOUSE_HOST (production) > CLICKHOUSE_URL (fallback)
  const url = process.env.CLICKHOUSE_LOCAL_HOST || process.env.CLICKHOUSE_HOST || process.env.CLICKHOUSE_URL;

  // During build / CI, do NOT create the client if URL is not available
  // This prevents "malformed url" errors during build
  if (!url) {
    // During build time, we can't create the client, so we'll throw an error
    // that will be caught during runtime when the API is actually called
    throw new Error('CLICKHOUSE_URL/CLICKHOUSE_HOST/CLICKHOUSE_LOCAL_HOST is not defined');
  }

  client = createClient({
    host: url, // URL already includes protocol and port (e.g., 'https://ch-yb.travtech.tech:8123')
    username: process.env.CLICKHOUSE_USERNAME || 'default',
    password: process.env.CLICKHOUSE_PASSWORD || '',
    database: process.env.CLICKHOUSE_DATABASE || 'cruise_master',
  });

  return client;
}

// Export for backward compatibility - use getter to make it truly lazy
// This prevents client creation during build time
export const clickhouseClient = new Proxy({} as ReturnType<typeof createClient>, {
  get(_target, prop) {
    const client = getClickHouseClient();
    const value = (client as any)[prop];
    return typeof value === 'function' ? value.bind(client) : value;
  }
});

// Test ClickHouse connection
export const testClickHouseConnection = async (): Promise<boolean> => {
  // Test the connection
  try {
    const client = getClickHouseClient();
    const result = await client.query({
      query: 'SELECT 1 as test',
      format: 'JSONEachRow'
    });
    
    const _data = await result.json() as { test: number }[];
    return true;
  } catch (error) {
    console.error('ClickHouse connection failed:', error);
    return false;
  }
};

// Note: Connection test is not called at module level to avoid blocking builds
// The connection will be tested on first use in API routes 