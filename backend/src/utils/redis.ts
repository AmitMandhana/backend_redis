import Redis from 'ioredis';

// Use environment variables for Upstash Redis connection
const redis = new Redis(process.env.UPSTASH_REDIS_URL as string, {
  password: process.env.UPSTASH_REDIS_PASSWORD,
  tls: {}, // Upstash requires TLS
});

export default redis;
