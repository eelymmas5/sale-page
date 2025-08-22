import { getClient } from "./apollo-client";
import { GET_POSTS, GET_PAGES, GET_SITE_INFO } from "./graphql-queries";
import { GET_BANNERS } from "./queries";
import { BannersData } from "@/types";

// Test WordPress GraphQL connection
export async function testWordPressConnection() {
  try {
    console.log("🔍 Testing WordPress GraphQL connection...");

    const client = getClient();
    const { data } = await client.query({
      query: GET_SITE_INFO,
      errorPolicy: "all",
    });

    if (data?.generalSettings) {
      console.log("✅ WordPress GraphQL connection successful!");
      console.log("📊 Site Info:", {
        title: data.generalSettings.title,
        description: data.generalSettings.description,
        url: data.generalSettings.url,
      });
      return { success: true, data: data.generalSettings };
    } else {
      throw new Error("No site data received");
    }
  } catch (error) {
    console.error("❌ WordPress GraphQL connection failed:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

// Get WordPress posts for blog/news section
export async function getWordPressPosts(limit = 6) {
  try {
    console.log("📄 Fetching WordPress posts...");

    const client = getClient();
    const { data } = await client.query({
      query: GET_POSTS,
      variables: { first: limit },
      errorPolicy: "all",
    });

    if (data?.posts?.nodes) {
      console.log(
        `✅ Successfully fetched ${data.posts.nodes.length} WordPress posts`
      );
      return data.posts.nodes;
    } else {
      console.log("⚠️ No WordPress posts found");
      return [];
    }
  } catch (error) {
    console.error("❌ Error fetching WordPress posts:", error);
    return [];
  }
}

// Get WordPress pages for static content
export async function getWordPressPages(limit = 10) {
  try {
    console.log("📄 Fetching WordPress pages...");

    const client = getClient();
    const { data } = await client.query({
      query: GET_PAGES,
      variables: { first: limit },
      errorPolicy: "all",
    });

    if (data?.pages?.nodes) {
      console.log(
        `✅ Successfully fetched ${data.pages.nodes.length} WordPress pages`
      );
      return data.pages.nodes;
    } else {
      console.log("⚠️ No WordPress pages found");
      return [];
    }
  } catch (error) {
    console.error("❌ Error fetching WordPress pages:", error);
    return [];
  }
}

// Get banners for hero/carousel
export async function getBanners() {
  try {
    console.log("🖼️ Fetching banners...");

    const client = getClient();
    const { data } = await client.query<BannersData>({
      query: GET_BANNERS,
      errorPolicy: "all",
      fetchPolicy: "no-cache",
    });

    console.log("data", data);

    const banners = data?.mediaItems?.nodes[0] ?? [];

    return banners;
  } catch (error) {
    console.error("❌ Error fetching banners:", error);
    return [];
  }
}
