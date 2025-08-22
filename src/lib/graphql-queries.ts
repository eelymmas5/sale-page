import { gql } from '@apollo/client';

// Test query to verify GraphQL endpoint is working
export const GET_POSTS = gql`
  query GetPosts($first: Int = 10) {
    posts(first: $first) {
      nodes {
        id
        title
        slug
        excerpt
        date
        author {
          node {
            name
          }
        }
        featuredImage {
          node {
            sourceUrl
            altText
          }
        }
      }
    }
  }
`;

// Get pages for static content
export const GET_PAGES = gql`
  query GetPages($first: Int = 10) {
    pages(first: $first) {
      nodes {
        id
        title
        slug
        content
        date
        featuredImage {
          node {
            sourceUrl
            altText
          }
        }
      }
    }
  }
`;

// Get site info
export const GET_SITE_INFO = gql`
  query GetSiteInfo {
    generalSettings {
      title
      description
      url
    }
  }
`;

// Get hero/banner content (could be a custom post type or page)
export const GET_HERO_CONTENT = gql`
  query GetHeroContent {
    page(id: "hero", idType: URI) {
      id
      title
      content
      featuredImage {
        node {
          sourceUrl
          altText
        }
      }
    }
  }
`;

// Get gaming providers (if you have custom post types)
export const GET_GAME_PROVIDERS = gql`
  query GetGameProviders($first: Int = 20) {
    gameProviders: posts(first: $first, where: {categoryName: "game-providers"}) {
      nodes {
        id
        title
        slug
        excerpt
        customFields {
          icon
          gameCount
          isPopular
        }
        featuredImage {
          node {
            sourceUrl
            altText
          }
        }
      }
    }
  }
`;