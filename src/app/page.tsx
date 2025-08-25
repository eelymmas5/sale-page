import { Suspense } from "react";
import PopularGames from "@/components/sections/PopularGames";
import ProviderCarousel from "@/components/ProviderCarousel";
import { getBanners } from "@/lib/wordpress";

const DEFAULT_PROVIDER = "pg-soft";

function PopularGamesSkeleton({ provider }: { provider: string }) {
  return (
    <div className="w-full">
      {/* Header */}
      <div className="flex items-center gap-2 sm:gap-4 mb-4 sm:mb-8">
        <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-white">
          {provider}
        </h1>
      </div>

      {/* Games Grid Skeleton */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-3 sm:gap-4 lg:gap-6">
        {[...Array(12)].map((_, i) => (
          <div
            key={i}
            className="group relative bg-gradient-to-br from-gray-800 to-gray-900 rounded-lg sm:rounded-xl lg:rounded-2xl overflow-hidden animate-pulse"
          >
            {/* Game Image Skeleton */}
            <div className="relative aspect-video overflow-hidden bg-gray-700"></div>

            {/* Game Info Skeleton */}
            <div className="p-2 sm:p-3 lg:p-4">
              <div className="flex items-start justify-between mb-1 sm:mb-2">
                <div className="w-3/4 h-4 bg-gray-700 rounded"></div>
                <div className="w-12 h-3 bg-gray-700 rounded"></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

interface HomePageProps {
  searchParams: Promise<{ provider?: string }>;
}

export default async function HomePage(params: HomePageProps) {
  const { provider } = await params.searchParams;
  // Get provider from URL search params, default to PG Soft
  const selectedProvider = provider || DEFAULT_PROVIDER;

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
        <ProviderCarousel selectedProvider={selectedProvider} />
      </div>

      <main className="flex-1 flex gap-4 p-4 sm:p-6 sm:ml-20 lg:ml-24">
        <Suspense fallback={<PopularGamesSkeleton provider={selectedProvider} />}>
          <PopularGames provider={selectedProvider} />
        </Suspense>
      </main>
    </div>
  );
}
