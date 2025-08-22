/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        gaming: {
          purple: {
            50: '#f5f3ff',
            500: '#8b5cf6',
            600: '#7c3aed',
            700: '#6d28d9',
            800: '#5b21b6',
            900: '#4c1d95',
          },
          gold: {
            400: '#fbbf24',
            500: '#f59e0b', 
            600: '#d97706',
          },
          neon: {
            blue: '#00ffff',
            green: '#00ff41',
            pink: '#ff10f0',
          }
        },
      },
      backgroundImage: {
        'gaming-gradient': 'linear-gradient(135deg, #1f2937 0%, #581c87 50%, #000000 100%)',
        'card-gradient': 'linear-gradient(145deg, #374151, #1f2937)',
        'gold-gradient': 'linear-gradient(135deg, #fbbf24, #f59e0b)',
      },
      boxShadow: {
        'neon': '0 0 20px rgba(139, 92, 246, 0.3)',
        'neon-strong': '0 0 30px rgba(139, 92, 246, 0.6)',
        'gold': '0 0 20px rgba(251, 191, 36, 0.3)',
      }
    },
  },
  plugins: [require("daisyui")],
  daisyui: {
    themes: [
      {
        gaming: {
          "primary": "#8b5cf6",
          "primary-content": "#ffffff",
          "secondary": "#f59e0b", 
          "secondary-content": "#000000",
          "accent": "#00ffff",
          "accent-content": "#000000",
          "neutral": "#374151",
          "neutral-content": "#ffffff",
          "base-100": "#1f2937",
          "base-200": "#111827",
          "base-300": "#0f172a",
          "base-content": "#ffffff",
          "info": "#3b82f6",
          "success": "#10b981",
          "warning": "#f59e0b",
          "error": "#ef4444",
        },
      },
      "dark",
      "light",
    ],
    darkTheme: "gaming",
  },
}