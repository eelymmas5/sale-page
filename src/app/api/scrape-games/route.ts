import { NextRequest, NextResponse } from 'next/server';
import { scrapeGames, Game } from '@/lib/scrapeGames';

interface ScrapedGameResponse {
  success: boolean;
  timestamp: string;
  source: string;
  totalGames: number;
  games: Game[];
  error?: string;
  fallbackData?: Game[];
  fromCache?: boolean;
}

interface CacheEntry {
  data: ScrapedGameResponse;
  timestamp: number;
  provider: string;
}

// In-memory cache with 15-minute TTL
const cache = new Map<string, CacheEntry>();
const CACHE_TTL = 15 * 60 * 1000; // 15 minutes in milliseconds

function getCacheKey(provider: string): string {
  return `games_${provider || 'pg-soft'}`;
}

function isValidCache(entry: CacheEntry): boolean {
  const now = Date.now();
  return (now - entry.timestamp) < CACHE_TTL;
}

function clearExpiredCache(): void {
  const now = Date.now();
  for (const [key, entry] of cache.entries()) {
    if ((now - entry.timestamp) >= CACHE_TTL) {
      cache.delete(key);
    }
  }
}

export async function GET(request: NextRequest) {
  console.log('🎮 Starting game scraping API...');
  
  // Clear expired cache entries
  clearExpiredCache();
  
  // Get provider from query parameters
  const { searchParams } = new URL(request.url);
  const provider = searchParams.get('provider') || 'pg-soft';
  const cacheKey = getCacheKey(provider);
  
  console.log(`🎯 API requested provider: ${provider}`);
  
  // Check cache first
  const cachedEntry = cache.get(cacheKey);
  if (cachedEntry && isValidCache(cachedEntry)) {
    console.log(`💾 Returning cached data for ${provider} (${Math.round((Date.now() - cachedEntry.timestamp) / 1000)}s old)`);
    const cachedResponse = {
      ...cachedEntry.data,
      fromCache: true,
      timestamp: new Date().toISOString()
    };
    
    // Add HTTP cache headers for cached responses too
    const cacheHeaders = new Headers({
      'Content-Type': 'application/json',
      'Cache-Control': 'public, s-maxage=900, stale-while-revalidate=1800',
      'X-Cache-Status': 'HIT',
      'X-Provider': provider,
    });
    
    return NextResponse.json(cachedResponse, { headers: cacheHeaders });
  }
  
  console.log(`🔄 Cache miss or expired for ${provider}, fetching fresh data...`);
  
  try {
    // Add timeout to prevent hanging
    const timeoutPromise = new Promise<never>((_, reject) => {
      setTimeout(() => reject(new Error('Scraping timeout after 60 seconds')), 60000);
    });
    
    const games = await Promise.race([
      scrapeGames(provider),
      timeoutPromise
    ]);
    
    let response: ScrapedGameResponse;
    
    if (games && games.length > 0) {
      response = {
        success: true,
        timestamp: new Date().toISOString(),
        source: 'https://m.amigo.love/game-slot',
        totalGames: games.length,
        games,
        fromCache: false
      };
    } else {
      // Return fallback data if scraping returned empty
      const fallbackGames = generateFallbackGames();
      response = {
        success: false,
        error: 'No games found during scraping',
        fallbackData: fallbackGames,
        timestamp: new Date().toISOString(),
        source: 'fallback',
        totalGames: fallbackGames.length,
        games: fallbackGames,
        fromCache: false
      };
    }
    
    // Cache the response
    cache.set(cacheKey, {
      data: response,
      timestamp: Date.now(),
      provider
    });
    
    console.log(`💾 Cached fresh data for ${provider}`);
    
    // Add HTTP cache headers for CDN/browser caching
    const headers = new Headers({
      'Content-Type': 'application/json',
      'Cache-Control': 'public, s-maxage=900, stale-while-revalidate=1800', // 15min cache, 30min stale
      'X-Cache-Status': response.fromCache ? 'HIT' : 'MISS',
      'X-Provider': provider,
    });
    
    return NextResponse.json(response, { status: 200, headers });
    
  } catch (error) {
    console.error('❌ Scraping failed:', error);
    
    const fallbackGames = generateFallbackGames();
    const errorResponse: ScrapedGameResponse = {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      fallbackData: fallbackGames,
      timestamp: new Date().toISOString(),
      source: 'fallback',
      totalGames: fallbackGames.length,
      games: fallbackGames,
      fromCache: false
    };
    
    // Cache fallback data as well to prevent repeated failures
    cache.set(cacheKey, {
      data: errorResponse,
      timestamp: Date.now(),
      provider
    });
    
    console.log(`💾 Cached fallback data for ${provider} due to error`);
    
    // Add HTTP cache headers for error responses with fallback data
    const errorHeaders = new Headers({
      'Content-Type': 'application/json',
      'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600', // Shorter cache for errors (5min)
      'X-Cache-Status': 'ERROR',
      'X-Provider': provider,
    });
    
    return NextResponse.json(errorResponse, { status: 200, headers: errorHeaders }); // Return 200 with fallback data
  }
}

// Fallback games in case scraping fails
function generateFallbackGames(): Game[] {
  return [
    {
      id: 'fallback-1',
      name: 'Golden Temple',
      image: '/api/placeholder/300/200',
      category: 'slot',
      provider: 'Pragmatic Play',
      players: 1240,
      rtp: '96.25%',
      isHot: true,
      isNew: false,
    },
    {
      id: 'fallback-2',
      name: 'Aztec Empire',
      image: '/api/placeholder/300/200',
      category: 'slot',
      provider: 'PG Soft',
      players: 856,
      rtp: '97.12%',
      isHot: false,
      isNew: true,
    },
    {
      id: 'fallback-3',
      name: "Dragon's Fortune",
      image: '/api/placeholder/300/200',
      category: 'slot',
      provider: 'NetEnt',
      players: 2103,
      rtp: '95.87%',
      isHot: true,
      isNew: false,
    },
    {
      id: 'fallback-4',
      name: 'Mahjong Ways',
      image: '/api/placeholder/300/200',
      category: 'mahjong',
      provider: 'PG Soft',
      players: 432,
      rtp: '96.42%',
      isHot: false,
      isNew: false,
    },
    {
      id: 'fallback-5',
      name: 'Lucky Sevens',
      image: '/api/placeholder/300/200',
      category: 'slot',
      provider: 'Microgaming',
      players: 778,
      rtp: '94.95%',
      isHot: false,
      isNew: true,
    },
    {
      id: 'fallback-6',
      name: 'Super Ace X',
      image: '/api/placeholder/300/200',
      category: 'card',
      provider: 'Spadegaming',
      players: 1125,
      rtp: '96.12%',
      isHot: false,
      isNew: true,
    },
  ];
}