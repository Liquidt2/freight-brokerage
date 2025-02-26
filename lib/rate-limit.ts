import { Redis } from '@upstash/redis';

const RATE_LIMIT_REQUESTS = 100; // Maximum requests per window
const RATE_LIMIT_WINDOW = 60 * 60; // Window size in seconds (1 hour)

// Initialize Redis client (you'll need to add UPSTASH_REDIS_REST_URL and UPSTASH_REDIS_REST_TOKEN to env)
const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL || '',
  token: process.env.UPSTASH_REDIS_REST_TOKEN || '',
});

export async function rateLimit(identifier: string): Promise<boolean> {
  if (process.env.NODE_ENV === 'development') {
    return false; // Disable rate limiting in development
  }

  const key = `rate_limit:${identifier}`;
  
  try {
    const requests = await redis.incr(key);
    
    if (requests === 1) {
      await redis.expire(key, RATE_LIMIT_WINDOW);
    }
    
    return requests > RATE_LIMIT_REQUESTS;
  } catch (error) {
    console.error('Rate limiting error:', error);
    return true; // Fail closed if Redis is unavailable for security
  }
}
