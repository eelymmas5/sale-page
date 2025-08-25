import Image from "next/image";

export interface Game {
  id: string;
  name: string;
  image: string;
  players: number;
  rtp: string;
  isHot?: boolean;
  isNew?: boolean;
  category: string;
  provider?: string;
}

async function getGames(provider?: string): Promise<Game[]> {
  const DEFAULT_PROVIDER = "pg-soft";
  const selectedProvider = provider || DEFAULT_PROVIDER;
  
  console.log(
    `🎮 Fetching games from API for provider: ${selectedProvider}...`
  );

  try {
    // Determine the base URL for API calls
    const baseUrl = typeof window !== 'undefined' 
      ? window.location.origin 
      : process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
    
    // Call our API route instead of direct scraping
    const response = await fetch(`${baseUrl}/api/scrape-games?provider=${selectedProvider}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      cache: 'no-store', // Ensure we don't cache the API response at the fetch level since we handle caching in the API
    });

    if (!response.ok) {
      throw new Error(`API request failed: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    
    if (data.success && data.games && data.games.length > 0) {
      console.log(`✅ Successfully fetched ${data.games.length} games from API${data.fromCache ? ' (cached)' : ''}`);
      return data.games;
    } else if (data.games && data.games.length > 0) {
      // Fallback data is still useful
      console.log(`⚠️ Using fallback data: ${data.games.length} games`);
      return data.games;
    } else {
      throw new Error(data.error || "No games found in API response");
    }
  } catch (error) {
    console.error("❌ Error fetching games from API:", error);
    return [];
  }
}

interface PopularGamesProps {
  provider: string;
}

export default async function PopularGames({ provider }: PopularGamesProps) {
  const games = await getGames(provider);
  const formatPlayers = (count: number): string => {
    if (count >= 1000) {
      return `${(count / 1000).toFixed(1)}k`;
    }
    return count.toString();
  };

  return (
    <div className="w-full">
      {/* Header with Popular Game Icons */}
      <div className="flex items-center gap-2 sm:gap-4 mb-4 sm:mb-8">
        <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-white">
          {provider}
        </h1>
      </div>

      {/* Games Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-3 sm:gap-4 lg:gap-6">
        {games.map((game) => (
          <div
            key={game.id}
            tabIndex={0}
            role="button"
            aria-label={`Show play button for ${game.name}`}
            className="group relative bg-gradient-to-br from-gray-800 to-gray-900 rounded-lg sm:rounded-xl lg:rounded-2xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105 focus:outline-none"
          >
            {/* Game Image */}
            <div className="relative aspect-video overflow-hidden">
              {game?.image ? (
                <Image
                  src={game.image}
                  alt={game.name}
                  fill
                  className="object-cover"
                  priority={false}
                  unoptimized={game.image.includes("placeholder")}
                />
              ) : (
                // Fallback gradient when no image
                <div className="absolute inset-0 bg-gradient-to-br from-purple-600 to-blue-600">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-3xl sm:text-4xl lg:text-6xl opacity-50">
                      {game.category === "slot" && "🎰"}
                      {game.category === "card" && "🃏"}
                      {game.category === "mahjong" && "🀄"}
                      {game.category === "live" && "🎪"}
                      {game.category === "crash" && "🚀"}
                      {!["slot", "card", "mahjong", "live", "crash"].includes(
                        game.category
                      ) && "🎮"}
                    </div>
                  </div>
                </div>
              )}

              {/* Badges */}
              <div className="absolute top-1 sm:top-2 lg:top-3 left-1 sm:left-2 lg:left-3 flex gap-1 sm:gap-2">
                {game.isHot && (
                  <span className="px-1 sm:px-2 py-0.5 sm:py-1 bg-red-500 text-white text-xs font-bold rounded-full">
                    HOT
                  </span>
                )}
                {game.isNew && (
                  <span className="px-1 sm:px-2 py-0.5 sm:py-1 bg-green-500 text-white text-xs font-bold rounded-full">
                    NEW
                  </span>
                )}
              </div>

              {/* Player Count */}
              <div className="absolute top-1 sm:top-2 lg:top-3 right-1 sm:right-2 lg:right-3 flex items-center gap-1 bg-black/70 backdrop-blur-sm px-1 sm:px-2 py-0.5 sm:py-1 rounded-full">
                <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-green-500 rounded-full animate-pulse" />
                <span className="text-white text-xs sm:text-sm font-medium">
                  {formatPlayers(game.players)}
                </span>
              </div>

              {/* Overlay - hover on desktop, focus (tap) on mobile */}
              <div className="hidden group-hover:flex group-focus-within:flex group-active:flex absolute inset-0 bg-black/50 items-center justify-center transition-all duration-300">
                <button className="px-4 py-2 lg:px-6 lg:py-3 bg-[#fde60d] text-black font-bold rounded-lg lg:rounded-xl transform scale-110 transition-all duration-300">
                  เริ่มเกม!
                </button>
              </div>
            </div>

            {/* Game Info */}
            <div className="p-2 sm:p-3 lg:p-4">
              <div className="flex items-start justify-between mb-1 sm:mb-2">
                <h3 className="text-white font-bold text-sm sm:text-base lg:text-lg truncate pr-2 leading-tight">
                  {game.name}
                </h3>
                {game.rtp && (
                  <span className="text-green-400 text-xs sm:text-sm font-medium whitespace-nowrap">
                    {game.rtp} RTP
                  </span>
                )}
              </div>
            </div>

            {/* Glow Effect */}
            <div className="absolute inset-0 rounded-lg sm:rounded-xl lg:rounded-2xl ring-1 ring-inset ring-white/10 group-hover:ring-purple-500/50 transition-all duration-300" />
          </div>
        ))}
      </div>
    </div>
  );
}
