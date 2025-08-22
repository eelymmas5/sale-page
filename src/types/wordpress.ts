export interface MediaItem {
  id: string;
  sourceUrl: string;
  altText: string;
  title: string;
  mediaDetails: {
    width: number;
    height: number;
    sizes: {
      name: string;
      sourceUrl: string;
      width: number;
      height: number;
    }[];
  };
}

export interface FeaturedImage {
  node: {
    sourceUrl: string;
    altText: string;
  };
}

export interface Feature {
  title: string;
  description: string;
  icon: string;
}

export interface Testimonial {
  name: string;
  content: string;
  rating: number;
  image: {
    sourceUrl: string;
    altText: string;
  };
}

export interface PricingPlan {
  name: string;
  price: string;
  period: string;
  features: string[];
  highlighted: boolean;
  ctaText: string;
  ctaUrl: string;
}

export interface HomepageFields {
  heroTitle: string;
  heroSubtitle: string;
  heroCtaText: string;
  heroCtaUrl: string;
  featuresTitle: string;
  features: Feature[];
  testimonialsTitle: string;
  testimonials: Testimonial[];
  pricingTitle: string;
  pricingPlans: PricingPlan[];
}

export interface SEOData {
  title: string;
  metaDesc: string;
  opengraphImage: {
    sourceUrl: string;
  };
  opengraphDescription: string;
  opengraphTitle: string;
  twitterImage: {
    sourceUrl: string;
  };
  twitterDescription: string;
  twitterTitle: string;
}

export interface Page {
  title: string;
  content: string;
  featuredImage: FeaturedImage;
  homepageFields: HomepageFields;
  seo: SEOData;
}

export interface GeneralSettings {
  title: string;
  description: string;
  url: string;
}

export interface HomepageData {
  page: Page;
}

export interface GalleryData {
  mediaItems: {
    nodes: MediaItem[];
  };
}

export interface SEOQueryData {
  generalSettings: GeneralSettings;
  page: {
    seo: SEOData;
  };
}

export interface BannerNode {
  title: string;
  featuredImage: {
    node: {
      sourceUrl: string;
      altText: string;
      mediaDetails: {
        width: number;
        height: number;
      };
    };
  };
}

export interface BannersData {
  mediaItems: {
    nodes: BannerNode[];
  };
}
