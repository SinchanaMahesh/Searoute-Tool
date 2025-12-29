import { createClient } from '@clickhouse/client';
import 'dotenv/config';



// ClickHouse Configuration
export const clickhouseClient = createClient({
  host: `https://${process.env.CLICKHOUSE_HOST || 'localhost'}:${process.env.CLICKHOUSE_PORT || '8123'}`,
  username: process.env.CLICKHOUSE_USERNAME || 'default',
  password: process.env.CLICKHOUSE_PASSWORD || '',
  database: process.env.CLICKHOUSE_DATABASE || 'cruise_master',
});

console.log(clickhouseClient);

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
// Initialize connection test
testClickHouseConnection().then(success => {
  if (!success) {
    console.warn('ClickHouse connection failed - some features may not work');
  }
}); 