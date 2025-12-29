import { createClient } from '@clickhouse/client';

function getEnv(name: string, fallback: string): string {
  const value = process.env[name];
  if (!value && process.env.VERCEL) {
    throw new Error(`Missing required env variable: ${name}`);
  }
  return value || fallback;
}

const CLICKHOUSE_HOST = getEnv('CLICKHOUSE_HOST', 'localhost');
const CLICKHOUSE_PORT = getEnv('CLICKHOUSE_PORT', '8123');
const CLICKHOUSE_USERNAME = getEnv('CLICKHOUSE_USERNAME', 'default');
const CLICKHOUSE_PASSWORD = getEnv('CLICKHOUSE_PASSWORD', '');
const CLICKHOUSE_DATABASE = getEnv('CLICKHOUSE_DATABASE', 'cruise_master');

export const clickhouseClient = createClient({
  host: `https://${CLICKHOUSE_HOST}:${CLICKHOUSE_PORT}`,
  username: CLICKHOUSE_USERNAME,
  password: CLICKHOUSE_PASSWORD,
  database: CLICKHOUSE_DATABASE,
});

// Test ClickHouse connection
export const testClickHouseConnection = async (): Promise<boolean> => {
  // Test the connection
  try {
    const result = await clickhouseClient.query({
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