import { NextResponse } from 'next/server';
import { cacheManager } from '@/lib/redis';

export async function GET() {
  try {
    // Test Redis connection
    const testKey = 'health-check';
    const testValue = Date.now().toString();
    
    await cacheManager.set(testKey, testValue, 10); // 10 seconds TTL
    const retrieved = await cacheManager.get(testKey);
    
    if (retrieved !== testValue) {
      throw new Error('Redis read/write test failed');
    }
    
    // Clean up test key
    await cacheManager.delete(testKey);
    
    return NextResponse.json({
      status: 'healthy',
      timestamp: new Date().toISOString(),
      redis: 'connected',
      environment: process.env.NODE_ENV || 'development'
    });
  } catch (error) {
    console.error('Health check failed:', error);
    
    return NextResponse.json({
      status: 'unhealthy',
      timestamp: new Date().toISOString(),
      redis: 'disconnected',
      error: error instanceof Error ? error.message : 'Unknown error',
      environment: process.env.NODE_ENV || 'development'
    }, { status: 503 });
  }
}