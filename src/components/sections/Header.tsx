"use client";

import { useState } from "react";

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="bg-black/90 backdrop-blur-sm border-b border-gray-800 sticky top-0 z-50">
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-20">
          {/* Logo */}
          <div className="flex items-center space-x-4">
            <div className="w-10 h-10 lg:w-12 lg:h-12 bg-gradient-to-br from-yellow-500 to-orange-600 rounded-lg flex items-center justify-center">
              <span className="text-lg lg:text-xl font-bold text-white">G</span>
            </div>
            <div className="hidden sm:block">
              <h1 className="text-xl lg:text-2xl font-bold text-white">
                GameHub
              </h1>
              <p className="text-xs lg:text-sm text-gray-400">
                Premium Gaming Platform
              </p>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-8">
            <a
              href="#"
              className="text-gray-300 hover:text-white transition-colors"
            >
              Games
            </a>
            <a
              href="#"
              className="text-gray-300 hover:text-white transition-colors"
            >
              Live Casino
            </a>
            <a
              href="#"
              className="text-gray-300 hover:text-white transition-colors"
            >
              Sports
            </a>
            <a
              href="#"
              className="text-gray-300 hover:text-white transition-colors"
            >
              Promotions
            </a>
            <a
              href="#"
              className="text-gray-300 hover:text-white transition-colors"
            >
              Tournament
            </a>
          </nav>

          {/* Right Side Actions */}
          <div className="flex items-center space-x-2 sm:space-x-4">
            {/* Balance (Desktop) */}
            <div className="hidden sm:flex items-center bg-gray-800/50 rounded-lg px-3 py-2">
              <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
              <span className="text-white font-medium text-sm">$1,234.56</span>
            </div>

            {/* User Profile */}
            {/* <div className="flex items-center space-x-2 sm:space-x-3">
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-green-500 to-teal-600 rounded-full flex items-center justify-center">
                <span className="text-sm sm:text-base font-bold text-white">U</span>
              </div>
              <div className="hidden sm:block">
                <p className="text-white font-medium text-sm">Player123</p>
                <p className="text-gray-400 text-xs">VIP Level 3</p>
              </div>
            </div> */}

            {/* Mobile Menu Button */}
            <button
              className="lg:hidden p-2 text-gray-400 hover:text-white"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="lg:hidden border-t border-gray-800 py-4">
            <div className="flex flex-col space-y-4">
              {/* Balance (Mobile) */}
              <div className="flex items-center justify-between bg-gray-800/50 rounded-lg px-4 py-3">
                <span className="text-gray-300">Balance</span>
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                  <span className="text-white font-medium">$1,234.56</span>
                </div>
              </div>

              {/* Navigation Links */}
              <nav className="flex flex-col space-y-2">
                <a
                  href="#"
                  className="text-gray-300 hover:text-white transition-colors py-2"
                >
                  Games
                </a>
                <a
                  href="#"
                  className="text-gray-300 hover:text-white transition-colors py-2"
                >
                  Live Casino
                </a>
                <a
                  href="#"
                  className="text-gray-300 hover:text-white transition-colors py-2"
                >
                  Sports
                </a>
                <a
                  href="#"
                  className="text-gray-300 hover:text-white transition-colors py-2"
                >
                  Promotions
                </a>
                <a
                  href="#"
                  className="text-gray-300 hover:text-white transition-colors py-2"
                >
                  Tournament
                </a>
              </nav>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
