import Link from "next/link";

export interface Provider {
  id: string;
  name: string;
  displayName: string;
  image: string;
  selector: string;
}

export const PROVIDERS: Provider[] = [
  {
    id: "pg-soft",
    name: "PG Soft",
    displayName: "PG Soft",
    image:
      "https://cdn.eaeaea.click/img/sportsbook/assets/provider/PG-Soft.png",
    selector: 'img[alt="PG Soft"]',
  },
  {
    id: "pragmatic-play",
    name: "PragmaticPlay Slot",
    displayName: "Pragmatic Play",
    image:
      "https://cdn.eaeaea.click/img/sportsbook/provider/PMTS/PMTS_1697034113.png",
    selector: 'img[alt="PragmaticPlay Slot"]',
  },
  {
    id: "jili",
    name: "Jili",
    displayName: "Jili",
    image: "https://cdn.eaeaea.click/img/sportsbook/assets/provider/Jili.png",
    selector: 'img[alt="Jili"]',
  },
  {
    id: "microgaming",
    name: "Microgaming Slot",
    displayName: "Microgaming",
    image:
      "https://cdn.eaeaea.click/img/sportsbook/provider/MGS/MGS_1695290029.png",
    selector: 'img[alt="Microgaming Slot"]',
  },
];

interface ProviderCarouselSSRProps {
  selectedProvider: string;
}

export default function ProviderCarouselSSR({
  selectedProvider,
}: ProviderCarouselSSRProps) {
  return (
    <div className="w-full">
      <h2 className="text-white text-lg font-bold mb-4 text-center">
        เลือกผู้ให้บริการเกม
      </h2>

      {/* Provider Horizontal Scroll */}
      <div className="relative">
        <div className="flex gap-4 overflow-x-auto scrollbar-hide px-4 pb-2">
          {PROVIDERS.map((provider) => (
            <Link
              key={provider.id}
              href={`/?provider=${provider.id}`}
              className={`
                relative p-4 rounded-xl border-2 transition-all duration-300 min-w-[120px] flex-shrink-0 block
                ${
                  selectedProvider === provider.id
                    ? "border-[#ff00aa] bg-[#562440] shadow-lg shadow-[#ff00aa]/20"
                    : "border-gray-600 bg-gray-800 hover:border-gray-400"
                }
                hover:scale-105
              `}
            >
              {/* Provider Image */}
              <div className="flex flex-col items-center space-y-3">
                <div className="w-16 h-16 flex items-center justify-center">
                  <img
                    src={provider.image}
                    alt={provider.displayName}
                    className="w-full h-full object-contain"
                  />
                </div>

                {/* Provider Name */}
                <span className="text-white text-sm font-medium text-center leading-tight">
                  {provider.displayName}
                </span>
              </div>

              {/* Selection Indicator */}
              {selectedProvider === provider.id && (
                <div className="absolute top-2 right-2">
                  <div className="w-3 h-3 bg-[#ff00aa] rounded-full"></div>
                </div>
              )}
            </Link>
          ))}
        </div>

        {/* Scroll indicator shadows */}
        <div className="absolute left-0 top-0 bottom-0 w-6 bg-gradient-to-r from-black/20 to-transparent pointer-events-none"></div>
        <div className="absolute right-0 top-0 bottom-0 w-6 bg-gradient-to-l from-black/20 to-transparent pointer-events-none"></div>
      </div>
    </div>
  );
}
