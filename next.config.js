/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  images: {
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
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '',
        pathname: '/**',
      },
    ],
    formats: ['image/webp', 'image/avif'],
  },
  env: {
    WORDPRESS_API_URL: process.env.WORDPRESS_API_URL || 'https://wp.mun789.com/graphql',
  },
  serverExternalPackages: [
    'puppeteer-extra', 
    'puppeteer-extra-plugin-stealth',
    'puppeteer-extra-plugin-recaptcha',
    'puppeteer-extra-plugin-user-preferences',
    'puppeteer-extra-plugin-user-data-dir',
  ],
}

module.exports = nextConfig