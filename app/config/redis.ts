import { createClient } from 'redis';

let redisClient: ReturnType<typeof createClient> | null = null;
let connectionAttempted = false;
let lastConnectionAttempt = 0;
const RETRY_INTERVAL = 30000; // Retry every 30 seconds if connection failed
const CONNECTION_TIMEOUT = 5000; // 5 second timeout

// Check if Redis is enabled via environment variable
const isRedisEnabled = (): boolean => {
  const enabled = process.env.REDIS_ENABLED;
  // If explicitly set to 'false', disable Redis
  if (enabled === 'false') {
    return false;
  }
  // If explicitly set to 'true', enable Redis (will check REDIS_URL later)
  if (enabled === 'true') {
    return true;
  }
  // If not set, default to disabled (for now)
  // To enable Redis, set REDIS_ENABLED=true and REDIS_URL
  return false;
};

export const getRedisClient = async () => {
  // Check if Redis is enabled first
  if (!isRedisEnabled()) {
    return null;
  }

  // If we already have a client and it's connected, return it
  if (redisClient) {
    try {
      // Check if client is still connected
      if (redisClient.isOpen) {
        return redisClient;
      } else {
        // Client exists but is not connected, reset it
        redisClient = null;
      }
    } catch (e) {
      // Client is in bad state, reset it
      redisClient = null;
    }
  }

  // Check if REDIS_URL is set
  const redisUrl = process.env.REDIS_URL;
  if (!redisUrl) {
    // Only log once to avoid spam
    if (!connectionAttempted) {
      console.warn('REDIS_URL not set - Redis caching is disabled. Set REDIS_URL environment variable to enable caching.');
      connectionAttempted = true;
    }
    return null;
  }

  // If we recently attempted and failed, wait before retrying
  const now = Date.now();
  if (connectionAttempted && (now - lastConnectionAttempt) < RETRY_INTERVAL) {
    return null;
  }

  // If we're currently attempting to connect, return null to avoid multiple attempts
  if (connectionAttempted && (now - lastConnectionAttempt) < 5000) {
    return null;
  }

  connectionAttempted = true;
  lastConnectionAttempt = now;

  try {
    const client = createClient({
      url: redisUrl,
      socket: {
        reconnectStrategy: (retries) => {
          // Retry up to 3 times, then give up for this session
          if (retries > 3) {
            return false; // Stop retrying
          }
          return Math.min(retries * 100, 3000); // Exponential backoff
        },
        connectTimeout: CONNECTION_TIMEOUT,
      },
    });

    client.on('error', (err) => {
      console.warn('Redis Client Error:', err.message);
      // Don't set connectionFailed here - allow retries
      if (redisClient === client) {
        redisClient = null;
      }
    });

    client.on('connect', () => {
      console.log('Redis connected successfully');
    });

    client.on('ready', () => {
      console.log('Redis client ready');
    });

    // Try to connect with a timeout
    await Promise.race([
      client.connect(),
      new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Connection timeout')), CONNECTION_TIMEOUT)
      ),
    ]);

    redisClient = client;
    connectionAttempted = false; // Reset so we can reconnect if needed
    return client;
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.warn(`Redis connection failed (caching disabled): ${errorMessage}. Will retry in ${RETRY_INTERVAL / 1000} seconds.`);
    redisClient = null;
    // Reset connectionAttempted after a delay to allow retries
    setTimeout(() => {
      connectionAttempted = false;
    }, RETRY_INTERVAL);
    // Return null if Redis is not available - app will work without caching
    return null;
  }
};

// Cache TTL in seconds (5-10 minutes as requested)
export const CACHE_TTL = 300; // 5 minutes
export const CACHE_TTL_LONG = 600; // 10 minutes

// Popular search terms that should be cached
export const POPULAR_SEARCHES = ['mi', 'new', 'san', 'los', 'port', 'bay', 'island'];

