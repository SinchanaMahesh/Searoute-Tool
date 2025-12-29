import { createClient } from '@clickhouse/client';



// ClickHouse Configuration
export const clickhouseClient = createClient({
  host: `https://${process.env.CLICKHOUSE_HOST}:${process.env.CLICKHOUSE_PORT}`,
  username: process.env.CLICKHOUSE_USERNAME,
  password: process.env.CLICKHOUSE_PASSWORD,
  database: process.env.CLICKHOUSE_DATABASE,
});

if (!process.env.CLICKHOUSE_HOST) {
  throw new Error("CLICKHOUSE_HOST not set")
}
if (!process.env.CLICKHOUSE_PORT) {
  throw new Error("CLICKHOUSE_PORT not set")
}
if (!process.env.CLICKHOUSE_USERNAME) {
  throw new Error("CLICKHOUSE_USERNAME not set")
}
if (!process.env.CLICKHOUSE_PASSWORD) {
  throw new Error("CLICKHOUSE_PASSWORD not set")
}
if (!process.env.CLICKHOUSE_DATABASE) {
  throw new Error("CLICKHOUSE_DATABASE not set")
}

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