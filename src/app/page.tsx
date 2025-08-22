import PopularGames from "@/components/sections/PopularGames";
import ProviderCarouselSSR from "@/components/ProviderCarouselSSR";
import { Game, scrapeGames } from "@/lib/scrapeGames";
import { getBanners } from "@/lib/wordpress";

const DEFAULT_PROVIDER = "pg-soft";

async function getGames(provider?: string): Promise<Game[]> {
  console.log(
    `🎮 Starting server-side game scraping for provider: ${
      provider || DEFAULT_PROVIDER
    }...`
  );

  try {
    const games = await scrapeGames(provider || DEFAULT_PROVIDER);

    if (games && games.length > 0) {
      console.log(`✅ Successfully scraped ${games.length} games`);
      return games;
    } else {
      throw new Error("No games found during scraping");
    }
  } catch (error) {
    console.error("❌ Error during server-side scraping:", error);

    return [];
  }
}

interface HomePageProps {
  searchParams: { provider?: string };
}

export default async function HomePage({ searchParams }: HomePageProps) {
  // Get provider from URL search params, default to PG Soft
  const selectedProvider = searchParams.provider || DEFAULT_PROVIDER;

  // Server-side fetch games for selected provider
  const games = await getGames(selectedProvider);

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
      <div className="px-4">
        <ProviderCarouselSSR selectedProvider={selectedProvider} />
      </div>

      <main className="flex-1 flex gap-4 p-4 sm:p-6 sm:ml-20 lg:ml-24">
        <PopularGames games={games} provider={selectedProvider} />
      </main>
    </div>
  );
}
