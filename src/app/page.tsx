import Header from "@/components/sections/Header";
import GameBanner from "@/components/sections/GameBanner";
import GameSidebar from "@/components/sections/GameSidebar";
import PopularGames from "@/components/sections/PopularGames";
import { Game } from "@/lib/scrapeGames";
import { testWordPressConnection, getBanners } from "@/lib/wordpress";

const gameProviders = [
  {
    id: "pragmatic",
    name: "Pragmatic Play",
    icon: "🎯",
    gameCount: 127,
    isPopular: true,
  },
  {
    id: "pg-soft",
    name: "PG Soft",
    icon: "🎮",
    gameCount: 89,
    isPopular: true,
  },
  { id: "evolution", name: "Evolution", icon: "🎪", gameCount: 45 },
  { id: "netent", name: "NetEnt", icon: "🎰", gameCount: 156 },
  { id: "microgaming", name: "Microgaming", icon: "🃏", gameCount: 234 },
  { id: "playtech", name: "Playtech", icon: "🎲", gameCount: 178 },
  { id: "red-tiger", name: "Red Tiger", icon: "🐅", gameCount: 98 },
  { id: "quickspin", name: "Quickspin", icon: "⚡", gameCount: 67 },
];

interface ScrapedGameResponse {
  success: boolean;
  timestamp: string;
  source: string;
  totalGames: number;
  games: Game[];
  error?: string;
  fallbackData?: Game[];
}

async function getGames(): Promise<Game[]> {
  console.log("🎮 Starting server-side API call to scrape games...");

  try {
    // Get the base URL - handle both development and production
    const baseUrl = "http://localhost:3000";

    console.log(`📡 Making API request to: ${baseUrl}/api/scrape-games`);

    const response = await fetch(`${baseUrl}/api/scrape-games`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      // Always get fresh data for SSR
      cache: "no-store",
    });

    if (!response.ok) {
      throw new Error(
        `API request failed: ${response.status} ${response.statusText}`
      );
    }

    const data: ScrapedGameResponse = await response.json();
    console.log(
      `📊 API Response - Success: ${data.success}, Total games: ${data.totalGames}`
    );

    if (data.success && data.games?.length > 0) {
      console.log(`✅ Successfully loaded ${data.games.length} games from API`);
      return data.games;
    } else if (data.fallbackData && data.fallbackData.length > 0) {
      console.log(`⚠️ Using fallback data from API: ${data.error}`);
      return data.fallbackData;
    } else {
      throw new Error("No game data received from API");
    }
  } catch (error) {
    console.error("❌ Error calling scraping API during SSR:", error);

    // Return hardcoded fallback if API call fails completely
    console.log("🔄 Using hardcoded fallback games");
    return [
      {
        id: "hardcoded-1",
        name: "Gates of Olympus",
        image: "/api/placeholder/300/200",
        category: "slot",
        provider: "Pragmatic Play",
        players: Math.floor(Math.random() * 2000) + 800,
        rtp: "96.50%",
        isHot: true,
        isNew: false,
      },
      {
        id: "hardcoded-2",
        name: "Sweet Bonanza",
        image: "/api/placeholder/300/200",
        category: "slot",
        provider: "Pragmatic Play",
        players: Math.floor(Math.random() * 1500) + 600,
        rtp: "96.48%",
        isHot: false,
        isNew: false,
      },
      {
        id: "hardcoded-3",
        name: "Mahjong Ways 2",
        image: "/api/placeholder/300/200",
        category: "mahjong",
        provider: "PG Soft",
        players: Math.floor(Math.random() * 1200) + 400,
        rtp: "96.42%",
        isHot: false,
        isNew: true,
      },
      {
        id: "hardcoded-4",
        name: "Fortune Tiger",
        image: "/api/placeholder/300/200",
        category: "slot",
        provider: "PG Soft",
        players: Math.floor(Math.random() * 1800) + 700,
        rtp: "96.81%",
        isHot: true,
        isNew: false,
      },
      {
        id: "hardcoded-5",
        name: "Crazy Time",
        image: "/api/placeholder/300/200",
        category: "live",
        provider: "Evolution",
        players: Math.floor(Math.random() * 3000) + 1500,
        rtp: "96.08%",
        isHot: true,
        isNew: false,
      },
      {
        id: "hardcoded-6",
        name: "Lightning Roulette",
        image: "/api/placeholder/300/200",
        category: "live",
        provider: "Evolution",
        players: Math.floor(Math.random() * 2500) + 1000,
        rtp: "97.30%",
        isHot: true,
        isNew: false,
      },
    ];
  }
}

export default async function HomePage() {
  // Server-side fetch games via API route
  const games = await getGames();

  // Test WordPress connection
  const wpTest = await testWordPressConnection();

  // Fetch banners from WordPress
  const banners = await getBanners();

  return (
    <div
      className="min-h-screen"
      style={{
        background:
          "linear-gradient(180deg,rgba(13,3,8,1) 46%,rgba(0,0,0,1) 100%)",
      }}
    >
      <div
        style={{
          background: `url(${banners?.sourceUrl}) no-repeat center center`,
          backgroundSize: "cover",
          height: "540px",
        }}
        className="relative"
      >
        {/* Login and Register Buttons positioned at center bottom */}
        <div className="w-full absolute bottom-8 flex justify-center gap-4 px-8">
          <button className="p-2 w-1/2 py-[10px] bg-[#562440] border-2 border-[#ff00aa] rounded-[20px] text-white font-bold text-md hover:bg-[#5a2d4f] transition-colors duration-200">
            เข้าสู่ระบบ
          </button>

          <button
            style={{
              background:
                "linear-gradient(90deg,rgba(255,0,170,1) 0%,rgba(90,0,54,1) 100%)",
            }}
            className="p-2 w-1/2 py-[10px] border-2 border-cyan-400 rounded-[20px] text-white font-bold text-md hover:bg-[#5a2d4f] transition-colors duration-200"
          >
            สมัครสมาชิก
          </button>
        </div>
      </div>

      <main className="flex-1 flex gap-4 p-4 sm:p-6 sm:ml-20 lg:ml-24">
        <PopularGames games={games} />
      </main>

      {/* <Header />

      


      <GameBanner banners={banners} />


      <div className="flex">

        <main className="flex-1 flex gap-4 p-4 sm:p-6 sm:ml-20 lg:ml-24">
          <PopularGames games={games} />
        </main>
      </div> */}
    </div>
  );
}
