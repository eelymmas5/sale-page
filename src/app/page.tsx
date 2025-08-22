"use client";

import { useState, useEffect } from "react";
import PopularGames from "@/components/sections/PopularGames";
import ProviderCarousel from "@/components/ProviderCarousel";
import { Game } from "@/lib/scrapeGames";

interface ScrapedGameResponse {
  success: boolean;
  timestamp: string;
  source: string;
  totalGames: number;
  games: Game[];
  error?: string;
  fallbackData?: Game[];
}

const DEFAULT_PROVIDER = "pg-soft";

export default function HomePage() {
  const [games, setGames] = useState<Game[]>([]);
  const [selectedProvider, setSelectedProvider] = useState(DEFAULT_PROVIDER);
  const [isLoading, setIsLoading] = useState(true);
  const [banners, setBanners] = useState<any>(null);

  // Fetch games from API for a specific provider
  const fetchGames = async (providerId: string) => {
    setIsLoading(true);
    console.log(`🎮 Fetching games for provider: ${providerId}`);

    try {
      const response = await fetch(`/api/scrape-games?provider=${providerId}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
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
        setGames(data.games);
      } else if (data.fallbackData && data.fallbackData.length > 0) {
        console.log(`⚠️ Using fallback data from API: ${data.error}`);
        setGames(data.fallbackData);
      } else {
        throw new Error("No game data received from API");
      }
    } catch (error) {
      console.error("❌ Error calling scraping API:", error);

      // Use hardcoded fallback games
      console.log("🔄 Using hardcoded fallback games");
      setGames([
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
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch banners from WordPress
  const fetchBanners = async () => {
    try {
      // Note: You'll need to implement getBanners as a client-side fetch or move it to an API route
      // For now, using a placeholder
      setBanners({
        sourceUrl: null // Will use default background
      });
    } catch (error) {
      console.error("Error fetching banners:", error);
      setBanners({ sourceUrl: null });
    }
  };

  // Handle provider change
  const handleProviderChange = (providerId: string) => {
    if (providerId !== selectedProvider && !isLoading) {
      setSelectedProvider(providerId);
      fetchGames(providerId);
    }
  };

  // Load initial data
  useEffect(() => {
    fetchBanners();
    fetchGames(DEFAULT_PROVIDER);
  }, []);

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
          background: banners?.sourceUrl
            ? `url(${banners.sourceUrl}) no-repeat center center`
            : "none",
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

      {/* Provider Carousel Section */}
      <div className="px-4 py-6">
        <ProviderCarousel 
          selectedProvider={selectedProvider}
          onProviderChange={handleProviderChange}
          isLoading={isLoading}
        />
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
