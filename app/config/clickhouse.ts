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
  let url = process.env.CLICKHOUSE_HOST 

  // During build / CI, use a default URL to prevent "malformed url" errors
  // This allows the build to succeed, but the client won't work until proper env vars are set
  // Use a valid default URL format to prevent ClickHouse client from throwing "malformed url" error
  if (!url || url.trim() === '') {
    url = 'https://ch-yb.travtech.tech:8123';
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