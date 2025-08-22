'use client';

import { useState } from 'react';

interface Provider {
  id: string;
  name: string;
  icon: string;
  gameCount: number;
  isPopular?: boolean;
}

interface GameProvidersProps {
  providers: Provider[];
}

export default function GameProviders({ providers }: GameProvidersProps) {
  const [activeProvider, setActiveProvider] = useState<string | null>(null);

  return (
    <div className="w-full sm:w-64 lg:w-72 flex-shrink-0">
      {/* Provider Header */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-bold text-white">Game Providers</h2>
        <span className="text-sm text-gray-400">{providers.length}</span>
      </div>

      {/* Mobile: Horizontal Scroll */}
      <div className="sm:hidden">
        <div className="flex overflow-x-auto space-x-3 pb-2 scrollbar-hide">
          {providers.map((provider) => (
            <button
              key={provider.id}
              onClick={() => setActiveProvider(activeProvider === provider.id ? null : provider.id)}
              className={`
                flex-shrink-0 flex flex-col items-center p-3 rounded-xl transition-all duration-300 min-w-[80px] relative
                ${activeProvider === provider.id 
                  ? 'bg-gradient-to-br from-purple-600 to-blue-600 shadow-lg shadow-purple-500/25' 
                  : 'bg-gray-800/50 hover:bg-gray-700/70'
                }
              `}
            >
              {/* Provider Icon/Logo */}
              <div className={`
                w-12 h-12 rounded-lg flex items-center justify-center mb-2
                ${activeProvider === provider.id 
                  ? 'bg-white/20' 
                  : 'bg-gradient-to-br from-gray-600 to-gray-700'
                }
              `}>
                <span className="text-xl">{provider.icon}</span>
              </div>
              
              {/* Provider Name */}
              <span className={`
                text-xs font-medium text-center leading-tight
                ${activeProvider === provider.id ? 'text-white' : 'text-gray-400'}
              `}>
                {provider.name}
              </span>

              {/* Game Count */}
              <span className={`
                text-xs mt-1
                ${activeProvider === provider.id ? 'text-purple-200' : 'text-gray-500'}
              `}>
                {provider.gameCount}
              </span>

              {/* Popular Badge */}
              {provider.isPopular && (
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-xs">🔥</span>
                </div>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Desktop/Tablet: Vertical List */}
      <div className="hidden sm:block">
        <div className="space-y-2 max-h-96 overflow-y-auto scrollbar-thin">
          {providers.map((provider) => (
            <button
              key={provider.id}
              onClick={() => setActiveProvider(activeProvider === provider.id ? null : provider.id)}
              className={`
                w-full flex items-center p-3 rounded-xl transition-all duration-300 relative hover:scale-105
                ${activeProvider === provider.id 
                  ? 'bg-gradient-to-r from-purple-600 to-blue-600 shadow-lg shadow-purple-500/25' 
                  : 'bg-gray-800/50 hover:bg-gray-700/70'
                }
              `}
            >
              {/* Provider Icon/Logo */}
              <div className={`
                w-12 h-12 rounded-lg flex items-center justify-center mr-3 flex-shrink-0
                ${activeProvider === provider.id 
                  ? 'bg-white/20' 
                  : 'bg-gradient-to-br from-gray-600 to-gray-700'
                }
              `}>
                <span className="text-xl">{provider.icon}</span>
              </div>
              
              {/* Provider Info */}
              <div className="flex-1 text-left">
                <div className="flex items-center justify-between">
                  <span className={`
                    font-medium text-sm
                    ${activeProvider === provider.id ? 'text-white' : 'text-gray-300'}
                  `}>
                    {provider.name}
                  </span>
                  {provider.isPopular && (
                    <span className="text-xs">🔥</span>
                  )}
                </div>
                <span className={`
                  text-xs
                  ${activeProvider === provider.id ? 'text-purple-200' : 'text-gray-500'}
                `}>
                  {provider.gameCount} games
                </span>
              </div>

              {/* Active Indicator */}
              {activeProvider === provider.id && (
                <div className="absolute -right-1 top-1/2 transform -translate-y-1/2 w-1 h-8 bg-gradient-to-b from-purple-400 to-blue-400 rounded-full" />
              )}
            </button>
          ))}
        </div>

        {/* Show All Providers Button */}
        <button className="w-full mt-4 px-4 py-2 bg-gray-800/50 hover:bg-gray-700/70 text-gray-300 hover:text-white text-sm font-medium rounded-lg transition-all duration-300 border border-gray-700">
          Show All ({providers.length})
        </button>
      </div>
    </div>
  );
}