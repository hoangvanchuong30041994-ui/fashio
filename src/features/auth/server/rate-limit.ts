import { createHmac } from 'node:crypto';
import { headers } from 'next/headers';
import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';

type RateLimitScope = 'sign-in' | 'sign-up' | 'verification-email';

type ScopeLimiters = {
  ip: Ratelimit;
  email: Ratelimit;
};

let scopeLimiters: Record<RateLimitScope, ScopeLimiters> | undefined;

function getRequiredEnvironmentVariable(name: string): string {
  const value = process.env[name];

  if (!value) {
    throw new Error(`${name} must be configured for authentication rate limiting.`);
  }

  return value;
}

function createIdentifier(value: string): string {
  const secret = getRequiredEnvironmentVariable('AUTH_RATE_LIMIT_SECRET');
  return createHmac('sha256', secret).update(value).digest('base64url');
}

function getScopeLimiters(): Record<RateLimitScope, ScopeLimiters> {
  if (scopeLimiters) {
    return scopeLimiters;
  }

  const redis = new Redis({
    url: getRequiredEnvironmentVariable('UPSTASH_REDIS_REST_URL'),
    token: getRequiredEnvironmentVariable('UPSTASH_REDIS_REST_TOKEN'),
  });

  scopeLimiters = {
    'sign-in': {
      ip: new Ratelimit({
        redis,
        limiter: Ratelimit.slidingWindow(10, '15 m'),
        prefix: 'fashio:auth:sign-in:ip',
        analytics: false,
        timeout: 0,
      }),
      email: new Ratelimit({
        redis,
        limiter: Ratelimit.slidingWindow(5, '15 m'),
        prefix: 'fashio:auth:sign-in:email',
        analytics: false,
        timeout: 0,
      }),
    },
    'sign-up': {
      ip: new Ratelimit({
        redis,
        limiter: Ratelimit.slidingWindow(10, '60 m'),
        prefix: 'fashio:auth:sign-up:ip',
        analytics: false,
        timeout: 0,
      }),
      email: new Ratelimit({
        redis,
        limiter: Ratelimit.slidingWindow(3, '60 m'),
        prefix: 'fashio:auth:sign-up:email',
        analytics: false,
        timeout: 0,
      }),
    },
    'verification-email': {
      ip: new Ratelimit({
        redis,
        limiter: Ratelimit.slidingWindow(10, '60 m'),
        prefix: 'fashio:auth:verification-email:ip',
        analytics: false,
        timeout: 0,
      }),
      email: new Ratelimit({
        redis,
        limiter: Ratelimit.slidingWindow(3, '60 m'),
        prefix: 'fashio:auth:verification-email:email',
        analytics: false,
        timeout: 0,
      }),
    },
  };

  return scopeLimiters;
}

async function getClientIpAddress(): Promise<string> {
  const requestHeaders = await headers();
  const forwardedFor = requestHeaders.get('x-forwarded-for');

  if (forwardedFor) {
    return forwardedFor.split(',')[0]?.trim() || 'unknown';
  }

  return requestHeaders.get('x-real-ip')?.trim() || 'unknown';
}

export async function isAuthRateLimitExceeded(
  scope: RateLimitScope,
  email: string,
): Promise<boolean> {
  try {
    const limiters = getScopeLimiters()[scope];
    const ip = await getClientIpAddress();
    const [ipResult, emailResult] = await Promise.all([
      limiters.ip.limit(createIdentifier(`ip:${scope}:${ip}`)),
      limiters.email.limit(createIdentifier(`email:${scope}:${email.toLowerCase()}`)),
    ]);

    return !ipResult.success || !emailResult.success;
  } catch (error) {
    console.error('Authentication rate limit check failed.', {
      scope,
      error: error instanceof Error ? error.message : 'Unknown error',
    });
    return true;
  }
}
