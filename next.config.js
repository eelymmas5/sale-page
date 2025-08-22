/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: [
      'localhost', 
      'wordpress',
      'wp.mun789.com',    // WordPress site images
      'mun789.com',       // Main domain images  
      'cdn.eaeaea.click', // Gaming images from amigo.love
      'm.amigo.love',     // Mobile site images
      'amigo.love',       // Main site images
    ],
    formats: ['image/webp', 'image/avif'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'wp.mun789.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: '*.mun789.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'cdn.eaeaea.click',
        port: '',
        pathname: '/img/**',
      },
      {
        protocol: 'https',
        hostname: '*.amigo.love',
        port: '',
        pathname: '/**',
      },
    ],
  },
  env: {
    WORDPRESS_API_URL: process.env.WORDPRESS_API_URL || 'https://wp.mun789.com/graphql',
  },
  serverExternalPackages: [
    'puppeteer-extra', 
    'puppeteer-extra-plugin-stealth',
    'puppeteer-extra-plugin-recaptcha',
  ],
}

module.exports = nextConfig