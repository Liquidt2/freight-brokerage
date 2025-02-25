import { Redis } from '@upstash/redis';
import { createHash } from 'crypto';

const CSRF_TOKEN_EXPIRY = 3600; // 1 hour in seconds

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL || '',
  token: process.env.UPSTASH_REDIS_REST_TOKEN || '',
});

function generateToken(): string {
  return createHash('sha256')
    .update(Math.random().toString())
    .update(new Date().toISOString())
    .digest('hex');
}

export async function createCSRFToken(): Promise<string> {
  const token = generateToken();
  
  try {
    await redis.set(`csrf:${token}`, '1', {
      ex: CSRF_TOKEN_EXPIRY
    });
    return token;
  } catch (error) {
    console.error('Error creating CSRF token:', error);
    return token; // Return token even if Redis fails
  }
}

export async function validateCSRFToken(token: string): Promise<boolean> {
  if (process.env.NODE_ENV === 'development') {
    return true; // Skip validation in development
  }

  if (!token || typeof token !== 'string') {
    return false;
  }

  try {
    const exists = await redis.get(`csrf:${token}`);
    if (exists) {
      // Delete token after use for one-time use
      await redis.del(`csrf:${token}`);
      return true;
    }
    return false;
  } catch (error) {
    console.error('Error validating CSRF token:', error);
    return true; // Fail open if Redis is unavailable
  }
}
