"use client";

import { useState } from "react";

interface Provider {
  id: string;
  name: string;
  icon: string;
  gameCount: number;
  isPopular?: boolean;
}

interface GameSidebarProps {
  providers: Provider[];
}

export default function GameSidebar({ providers }: GameSidebarProps) {
  const [activeProvider, setActiveProvider] = useState<string | null>(null);

  return (
    /* Game Provider Sidebar - All Screens */
    <div className="h-[calc(100vh-4rem)] w-16 sm:w-20 lg:w-24 flex flex-col py-2 sm:py-3 lg:py-4 z-40">
      {/* Provider Navigation */}
      <nav className="flex flex-col space-y-1 sm:space-y-1.5 lg:space-y-2 px-1 sm:px-1.5 lg:px-2 flex-1 overflow-y-auto scrollbar-thin">
        {providers.map((provider) => (
          <button
            key={provider.id}
            onClick={() =>
              setActiveProvider(
                activeProvider === provider.id ? null : provider.id
              )
            }
            className={`
              group relative flex flex-col items-center justify-center p-2 sm:p-2.5 lg:p-3 rounded-lg sm:rounded-xl transition-all duration-300 hover:scale-105
              ${
                activeProvider === provider.id
                  ? "bg-gradient-to-br from-purple-600 to-blue-600 shadow-lg shadow-purple-500/25"
                  : "bg-transparent hover:bg-gray-700/70"
              }
            `}
          >
            {/* Icon */}
            <span className="text-lg sm:text-xl lg:text-2xl mb-0.5 sm:mb-1">
              {provider.icon}
            </span>

            {/* Label */}
            {/* <span
              className={`
              text-xs font-medium text-center leading-tight
              ${
                activeProvider === provider.id
                  ? "text-white"
                  : "text-gray-400 group-hover:text-white"
              }
            `}
            >
              {provider.name.split(" ")[0]}
            </span> */}

            {/* Game Count */}
            {/* <span
              className={`
              text-xs mt-0 sm:mt-0.5
              ${
                activeProvider === provider.id
                  ? "text-purple-200"
                  : "text-gray-500 group-hover:text-gray-400"
              }
            `}
            >
              {provider.gameCount}
            </span> */}

            {/* Active Indicator */}
            {/* {activeProvider === provider.id && (
              <div className="absolute -right-1 sm:-right-1.5 lg:-right-2 top-1/2 transform -translate-y-1/2 w-0.5 sm:w-0.5 lg:w-1 h-6 sm:h-7 lg:h-8 bg-gradient-to-b from-purple-400 to-blue-400 rounded-full" />
            )} */}

            {/* Popular Badge */}
            {/* {provider.isPopular && (
              <div className="absolute z-9999 -top-0.5 sm:-top-1 -right-0.5 sm:-right-1 w-2.5 h-2.5 sm:w-3 sm:h-3 bg-red-500 rounded-full flex items-center justify-center">
                <span className="text-white text-xs">🔥</span>
              </div>
            )} */}

            {/* Hover Tooltip - Desktop Only */}
            <div className="hidden lg:block absolute left-full ml-4 px-3 py-2 bg-gray-900 text-white text-sm rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none whitespace-nowrap z-50 shadow-lg">
              {provider.name} ({provider.gameCount} games)
              <div className="absolute left-0 top-1/2 transform -translate-y-1/2 -translate-x-1 w-2 h-2 bg-gray-900 rotate-45" />
            </div>
          </button>
        ))}
      </nav>

      {/* Bottom Actions */}
    </div>
  );
}
