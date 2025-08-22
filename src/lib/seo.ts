import { Metadata } from 'next';
import { SEOData, GeneralSettings } from '@/types';

interface SEOConfig {
  title?: string;
  description?: string;
  image?: string;
  url?: string;
  type?: 'website' | 'article';
  publishedTime?: string;
  modifiedTime?: string;
}

export function generateMetadata(
  seoData?: SEOData,
  generalSettings?: GeneralSettings,
  config?: SEOConfig
): Metadata {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://yoursite.com';
  
  const title = config?.title || seoData?.title || generalSettings?.title || 'Sales Page';
  const description = config?.description || seoData?.metaDesc || generalSettings?.description || 'High-converting sales page';
  const image = config?.image || seoData?.opengraphImage?.sourceUrl || `${baseUrl}/og-image.jpg`;
  const url = config?.url || generalSettings?.url || baseUrl;

  return {
    title,
    description,
    keywords: [
      'sales page',
      'landing page',
      'conversion optimization',
      'digital marketing',
      'lead generation'
    ],
    authors: [{ name: 'Sales Page Team' }],
    creator: 'Sales Page',
    publisher: 'Sales Page',
    robots: 'index, follow',
    openGraph: {
      type: config?.type || 'website',
      locale: 'en_US',
      url,
      siteName: generalSettings?.title || 'Sales Page',
      title: seoData?.opengraphTitle || title,
      description: seoData?.opengraphDescription || description,
      images: [
        {
          url: image,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
      ...(config?.publishedTime && { publishedTime: config.publishedTime }),
      ...(config?.modifiedTime && { modifiedTime: config.modifiedTime }),
    },
    twitter: {
      card: 'summary_large_image',
      title: seoData?.twitterTitle || title,
      description: seoData?.twitterDescription || description,
      images: [seoData?.twitterImage?.sourceUrl || image],
      creator: '@yourhandle',
      site: '@yourhandle',
    },
    alternates: {
      canonical: url,
    },
    verification: {
      google: 'your-google-verification-code',
      // bing: 'your-bing-verification-code',
      // yandex: 'your-yandex-verification-code',
    },
  };
}

export function generateStructuredData(
  seoData?: SEOData,
  generalSettings?: GeneralSettings
) {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://yoursite.com';
  
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: generalSettings?.title || 'Sales Page',
    description: generalSettings?.description || 'High-converting sales page',
    url: baseUrl,
    logo: `${baseUrl}/logo.png`,
    sameAs: [
      'https://twitter.com/yourhandle',
      'https://facebook.com/yourpage',
      'https://linkedin.com/company/yourcompany',
    ],
    contactPoint: {
      '@type': 'ContactPoint',
      telephone: '+1-555-123-4567',
      contactType: 'customer service',
      availableLanguage: 'English',
    },
  };
}