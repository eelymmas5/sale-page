import { gql } from "@apollo/client";

export const GET_HOMEPAGE_DATA = gql`
  query GetHomepageData {
    page(id: "homepage", idType: URI) {
      title
      content
      featuredImage {
        node {
          sourceUrl
          altText
        }
      }
      homepageFields {
        heroTitle
        heroSubtitle
        heroCtaText
        heroCtaUrl
        featuresTitle
        features {
          title
          description
          icon
        }
        testimonialsTitle
        testimonials {
          name
          content
          rating
          image {
            sourceUrl
            altText
          }
        }
        pricingTitle
        pricingPlans {
          name
          price
          period
          features
          highlighted
          ctaText
          ctaUrl
        }
      }
    }
  }
`;

export const GET_GALLERY_IMAGES = gql`
  query GetGalleryImages {
    mediaItems(first: 20, where: { mimeType: IMAGE }) {
      nodes {
        id
        sourceUrl
        altText
        title
        mediaDetails {
          width
          height
          sizes {
            name
            sourceUrl
            width
            height
          }
        }
      }
    }
  }
`;

export const GET_SEO_DATA = gql`
  query GetSEOData {
    generalSettings {
      title
      description
      url
    }
    page(id: "homepage", idType: URI) {
      seo {
        title
        metaDesc
        opengraphImage {
          sourceUrl
        }
        opengraphDescription
        opengraphTitle
        twitterImage {
          sourceUrl
        }
        twitterDescription
        twitterTitle
      }
    }
  }
`;

// Banners for hero/carousel
export const GET_BANNERS = gql`
  query GetBanners {
    mediaItems {
      nodes {
        id
        sourceUrl
        altText
        title
      }
    }
  }
`;
