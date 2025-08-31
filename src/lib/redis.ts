import Redis from 'ioredis';

class RedisClient {
  private client: Redis | null = null;
  private isConnecting = false;

  async getClient(): Promise<Redis> {
    if (this.client && this.client.status === 'ready') {
      return this.client;
    }

    if (this.isConnecting) {
      // Wait for the connection to complete
      while (this.isConnecting) {
        await new Promise(resolve => setTimeout(resolve, 100));
      }
      if (this.client && this.client.status === 'ready') {
        return this.client;
      }
    }

    this.isConnecting = true;

    try {
      const redisUrl = process.env.REDIS_URL || 'redis://localhost:6379';
      
      this.client = new Redis(redisUrl, {
        maxRetriesPerRequest: 3,
        lazyConnect: true,
        connectTimeout: 10000,
        commandTimeout: 5000,
      });

      // Connect to Redis
      await this.client.connect();

      // Setup event handlers
      this.client.on('error', (error) => {
        console.error('Redis connection error:', error);
      });

      this.client.on('connect', () => {
        console.log('✅ Redis connected successfully');
      });

      this.client.on('ready', () => {
        console.log('✅ Redis ready for commands');
      });

      this.client.on('close', () => {
        console.log('⚠️ Redis connection closed');
      });

      this.client.on('reconnecting', () => {
        console.log('🔄 Redis reconnecting...');
      });

      console.log('✅ Redis client initialized');
      return this.client;
    } catch (error) {
      console.error('❌ Failed to connect to Redis:', error);
      // Fall back to a mock Redis client that just logs operations
      return this.createMockClient();
    } finally {
      this.isConnecting = false;
    }
  }

  private createMockClient(): Redis {
    console.log('🔧 Using mock Redis client (cache disabled)');
    
    // Create a mock client that doesn't actually cache but doesn't throw errors
    const mockClient = {
      get: async (key: string) => {
        console.log(`📝 Mock Redis GET: ${key} (always returns null)`);
        return null;
      },
      set: async (key: string, value: string, mode?: string, duration?: number) => {
        console.log(`📝 Mock Redis SET: ${key} = [${value.length} chars] ${mode} ${duration}`);
        return 'OK';
      },
      del: async (...keys: string[]) => {
        console.log(`📝 Mock Redis DEL: ${keys.join(', ')}`);
        return keys.length;
      },
      keys: async (pattern: string) => {
        console.log(`📝 Mock Redis KEYS: ${pattern} (always returns empty array)`);
        return [];
      },
      disconnect: async () => {
        console.log('📝 Mock Redis disconnect (no-op)');
      },
      status: 'ready'
    } as any;

    return mockClient;
  }

  async disconnect(): Promise<void> {
    if (this.client) {
      await this.client.disconnect();
      this.client = null;
    }
  }
}

// Singleton instance
const redisClient = new RedisClient();

export interface CacheEntry<T = any> {
  data: T;
  timestamp: number;
  provider?: string;
}

export class CacheManager {
  private defaultTTL = 15 * 60; // 15 minutes in seconds

  async get<T>(key: string): Promise<T | null> {
    try {
      const client = await redisClient.getClient();
      const cached = await client.get(key);
      
      if (!cached) {
        console.log(`💾 Cache MISS: ${key}`);
        return null;
      }

      const entry: CacheEntry<T> = JSON.parse(cached);
      const now = Date.now();
      const age = Math.round((now - entry.timestamp) / 1000);
      
      console.log(`💾 Cache HIT: ${key} (${age}s old)`);
      return entry.data;
    } catch (error) {
      console.error(`❌ Cache GET error for key ${key}:`, error);
      return null;
    }
  }

  async set<T>(key: string, data: T, ttlSeconds?: number): Promise<void> {
    try {
      const client = await redisClient.getClient();
      const entry: CacheEntry<T> = {
        data,
        timestamp: Date.now()
      };

      const ttl = ttlSeconds || this.defaultTTL;
      await client.set(key, JSON.stringify(entry), 'EX', ttl);
      
      console.log(`💾 Cache SET: ${key} (TTL: ${ttl}s)`);
    } catch (error) {
      console.error(`❌ Cache SET error for key ${key}:`, error);
    }
  }

  async delete(key: string): Promise<void> {
    try {
      const client = await redisClient.getClient();
      await client.del(key);
      console.log(`💾 Cache DELETE: ${key}`);
    } catch (error) {
      console.error(`❌ Cache DELETE error for key ${key}:`, error);
    }
  }

  async deletePattern(pattern: string): Promise<void> {
    try {
      const client = await redisClient.getClient();
      const keys = await client.keys(pattern);
      if (keys.length > 0) {
        await client.del(...keys);
        console.log(`💾 Cache DELETE pattern: ${pattern} (${keys.length} keys)`);
      }
    } catch (error) {
      console.error(`❌ Cache DELETE pattern error for ${pattern}:`, error);
    }
  }

  getCacheKey(provider: string): string {
    return `games:${provider || 'pg-soft'}`;
  }
}

// Export singleton instance
export const cacheManager = new CacheManager();

// Cleanup function for graceful shutdown
export async function disconnectRedis(): Promise<void> {
  await redisClient.disconnect();
}