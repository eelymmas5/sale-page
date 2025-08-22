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
}

export async function GET(request: NextRequest) {
  console.log('🎮 Starting game scraping API...');
  
  // Get provider from query parameters
  const { searchParams } = new URL(request.url);
  const provider = searchParams.get('provider');
  
  if (provider) {
    console.log(`🎯 API requested specific provider: ${provider}`);
  } else {
    console.log('🎯 API requested default provider (PG Soft)');
  }
  
  try {
    // Add timeout to prevent hanging
    const timeoutPromise = new Promise<never>((_, reject) => {
      setTimeout(() => reject(new Error('Scraping timeout after 60 seconds')), 60000);
    });
    
    const games = await Promise.race([
      scrapeGames(provider || undefined),
      timeoutPromise
    ]);
    
    if (games && games.length > 0) {
      return NextResponse.json({
        success: true,
        timestamp: new Date().toISOString(),
        source: 'https://m.amigo.love/game-slot',
        totalGames: games.length,
        games,
      } as ScrapedGameResponse);
    } else {
      // Return fallback data if scraping returned empty
      const fallbackGames = generateFallbackGames();
      return NextResponse.json({
        success: false,
        error: 'No games found during scraping',
        fallbackData: fallbackGames,
        timestamp: new Date().toISOString(),
        source: 'fallback',
        totalGames: fallbackGames.length,
        games: fallbackGames,
      } as ScrapedGameResponse, { status: 200 }); // Still return 200 since we have fallback data
    }
    
  } catch (error) {
    console.error('❌ Scraping failed:', error);
    
    const fallbackGames = generateFallbackGames();
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      fallbackData: fallbackGames,
      timestamp: new Date().toISOString(),
      source: 'fallback',
      totalGames: fallbackGames.length,
      games: fallbackGames,
    } as ScrapedGameResponse, { status: 200 }); // Return 200 with fallback data
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