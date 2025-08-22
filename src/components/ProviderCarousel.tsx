"use client";

import { useState } from "react";

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
    image: "https://cdn.eaeaea.click/img/sportsbook/assets/provider/PG-Soft.png",
    selector: 'img[alt="PG Soft"]'
  },
  {
    id: "pragmatic-play",
    name: "PragmaticPlay Slot",
    displayName: "Pragmatic Play", 
    image: "https://cdn.eaeaea.click/img/sportsbook/provider/PMTS/PMTS_1697034113.png",
    selector: 'img[alt="PragmaticPlay Slot"]'
  },
  {
    id: "jili",
    name: "Jili",
    displayName: "Jili",
    image: "https://cdn.eaeaea.click/img/sportsbook/assets/provider/Jili.png",
    selector: 'img[alt="Jili"]'
  },
  {
    id: "microgaming",
    name: "Microgaming Slot",
    displayName: "Microgaming",
    image: "https://cdn.eaeaea.click/img/sportsbook/assets/provider/Jili.png", // Using Jili image as placeholder
    selector: 'img[alt="Microgaming Slot"]'
  }
];

interface ProviderCarouselProps {
  selectedProvider: string;
  onProviderChange: (providerId: string) => void;
  isLoading?: boolean;
}

export default function ProviderCarousel({ 
  selectedProvider, 
  onProviderChange, 
  isLoading = false 
}: ProviderCarouselProps) {
  return (
    <div className="w-full mb-6">
      <h2 className="text-white text-lg font-bold mb-4 text-center">เลือกผู้ให้บริการเกม</h2>
      
      {/* Provider Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-4xl mx-auto px-4">
        {PROVIDERS.map((provider) => (
          <button
            key={provider.id}
            onClick={() => !isLoading && onProviderChange(provider.id)}
            disabled={isLoading}
            className={`
              relative p-3 rounded-xl border-2 transition-all duration-300 min-h-[80px]
              ${
                selectedProvider === provider.id
                  ? "border-[#ff00aa] bg-[#562440] shadow-lg shadow-[#ff00aa]/20"
                  : "border-gray-600 bg-gray-800 hover:border-gray-400"
              }
              ${isLoading ? "opacity-50 cursor-not-allowed" : "hover:scale-105"}
            `}
          >
            {/* Provider Image */}
            <div className="flex flex-col items-center space-y-2">
              <div className="w-12 h-12 flex items-center justify-center">
                <img
                  src={provider.image}
                  alt={provider.displayName}
                  className="w-full h-full object-contain"
                  onError={(e) => {
                    // Fallback to a default image if provider image fails to load
                    (e.target as HTMLImageElement).src = "/api/placeholder/48/48";
                  }}
                />
              </div>
              
              {/* Provider Name */}
              <span className="text-white text-xs font-medium text-center leading-tight">
                {provider.displayName}
              </span>
            </div>

            {/* Selection Indicator */}
            {selectedProvider === provider.id && (
              <div className="absolute top-1 right-1">
                <div className="w-3 h-3 bg-[#ff00aa] rounded-full"></div>
              </div>
            )}

            {/* Loading Overlay */}
            {isLoading && selectedProvider === provider.id && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-xl">
                <div className="w-6 h-6 border-2 border-[#ff00aa] border-t-transparent rounded-full animate-spin"></div>
              </div>
            )}
          </button>
        ))}
      </div>

      {/* Loading Text */}
      {isLoading && (
        <div className="text-center mt-4">
          <p className="text-gray-400 text-sm">
            กำลังโหลดเกมจาก {PROVIDERS.find(p => p.id === selectedProvider)?.displayName}...
          </p>
        </div>
      )}
    </div>
  );
}