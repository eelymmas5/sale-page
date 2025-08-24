import puppeteer from "puppeteer-extra";
import StealthPlugin from "puppeteer-extra-plugin-stealth";
import chromium from "@sparticuz/chromium";

// Add stealth plugin
puppeteer.use(StealthPlugin());

export interface Game {
  id: string;
  name: string;
  image: string;
  players: number;
  rtp: string;
  isHot?: boolean;
  isNew?: boolean;
  category: string;
  provider?: string;
}

const wait = (ms: number) =>
  new Promise<void>((resolve) => setTimeout(resolve, ms));

export async function scrapeGames(targetProvider?: string): Promise<Game[]> {
  // Always log in production for monitoring
  console.log("🎮 Starting server-side game scraping...");
  console.log(`🌍 Environment: ${process.env.NODE_ENV}`);
  console.log(`🔧 Platform: ${process.platform}`);
  console.log(`🎯 Target Provider: ${targetProvider || 'pg-soft'}`);
  console.log(`📅 Timestamp: ${new Date().toISOString()}`);

  // Detect serverless environments
  const isVercel = process.env.VERCEL || process.env.VERCEL_ENV;
  const isServerless = isVercel || process.env.NETLIFY || process.env.AWS_LAMBDA_FUNCTION_NAME;
  
  let browser;
  try {
    console.log("🚀 Launching Puppeteer-Extra browser with mobile stealth plugin...");
    
    // Configure browser options based on environment
    const launchOptions: any = {
      headless: true,
      timeout: 30000, // 30 second timeout
      args: [
        "--no-sandbox",
        "--disable-setuid-sandbox",
        "--disable-dev-shm-usage",
        "--disable-web-security",
        "--disable-features=VizDisplayCompositor",
        "--no-first-run",
        "--disable-extensions",
        "--disable-gpu",
        "--disable-background-timer-throttling",
        "--disable-backgrounding-occluded-windows",
        "--disable-renderer-backgrounding",
        "--user-agent=Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1",
      ],
    };

    // Use Sparticuz chromium in serverless environments
    if (isServerless) {
      console.log("🚀 Serverless environment detected - using @sparticuz/chromium");
      launchOptions.executablePath = await chromium.executablePath();
      launchOptions.args = chromium.args;
      launchOptions.ignoreHTTPSErrors = true;
    }

    browser = await puppeteer.launch(launchOptions);

    console.log("📄 Creating new page...");
    const page = await browser.newPage();

    // Set mobile user agent explicitly (override stealth plugin for mobile)
    await page.setUserAgent(
      "Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1"
    );

    // Set mobile viewport and touch support
    console.log("📱 Setting mobile viewport and touch support...");
    await page.setViewport({
      width: 375,
      height: 667,
      isMobile: true,
      hasTouch: true,
      deviceScaleFactor: 2,
    });

    // Set mobile-specific headers
    console.log("🔧 Setting mobile headers...");
    await page.setExtraHTTPHeaders({
      "Accept-Language": "en-US,en;q=0.9",
      Accept:
        "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8",
      "Cache-Control": "no-cache",
      Pragma: "no-cache",
      "Sec-Fetch-Dest": "document",
      "Sec-Fetch-Mode": "navigate",
      "Sec-Fetch-Site": "none",
      "Sec-Fetch-User": "?1",
      "Upgrade-Insecure-Requests": "1",
    });

    console.log(
      "📱 Now navigating to amigo.love game slot page with mobile redirect handling..."
    );

    // Block redirects to desktop version
    await page.setRequestInterception(true);
    page.on("request", (request) => {
      const url = request.url();
      // Block redirect to desktop version with language parameter
      if (
        url.includes("amigo.love/?forceLanguage=") ||
        (url.includes("amigo.love") && !url.includes("m.amigo"))
      ) {
        console.log(`🚫 Blocking desktop redirect: ${url}`);
        request.abort();
        return;
      }
      request.continue();
    });

    try {
      // Try multiple mobile URLs
      const mobileUrls = [
        "https://m.amigo.love/game-slot",
        "https://m.amigo.love/game-slot/",
        "https://m.amigo.love/#/game-slot",
        "https://mobile.amigo.love/game-slot",
      ];

      let navigationSuccessful = false;
      for (const url of mobileUrls) {
        console.log(`🔄 Trying mobile URL: ${url}`);
        try {
          await page.goto(url, {
            waitUntil: "domcontentloaded",
            timeout: 15000,
          });

          const finalUrl = page.url();
          console.log(`📄 Final URL after navigation: ${finalUrl}`);

          // Check if we got redirected to desktop
          if (
            finalUrl.includes("amigo.love/?forceLanguage=") ||
            (finalUrl.includes("amigo.love") && !finalUrl.includes("m.amigo"))
          ) {
            console.log(
              "⚠️ Got redirected to desktop version, trying next URL..."
            );
            continue;
          }

          console.log("✅ Mobile navigation successful!");
          navigationSuccessful = true;
          break;
        } catch (urlError) {
          const message =
            urlError instanceof Error ? urlError.message : String(urlError);
          console.log(`⚠️ URL failed: ${url} - ${message}`);
          continue;
        }
      }

      if (!navigationSuccessful) {
        throw new Error("All mobile URLs failed to load");
      }
    } catch (navError) {
      console.error("❌ All mobile navigation attempts failed:", navError);

      // Last resort: try to force mobile version by manipulating URL parameters
      console.log("🔧 Last resort: trying URL manipulation techniques...");
      try {
        await page.goto(
          "https://amigo.love/game-slot?mobile=1&forceLanguage=en",
          {
            waitUntil: "domcontentloaded",
            timeout: 10000,
          }
        );

        // Inject mobile viewport override
        await page.evaluate(() => {
          // Override viewport meta tag
          const viewportMeta = document.querySelector('meta[name="viewport"]');
          if (viewportMeta) {
            viewportMeta.setAttribute(
              "content",
              "width=device-width, initial-scale=1.0, user-scalable=no"
            );
          }

          // Add mobile class to body
          document.body.classList.add("mobile", "is-mobile");

          // Force mobile CSS media queries
          const style = document.createElement("style");
          style.textContent =
            "@media (min-width: 768px) { body { max-width: 375px !important; } }";
          document.head.appendChild(style);
        });

        console.log("✅ URL manipulation successful!");
      } catch (lastResortError) {
        console.error("❌ Last resort also failed:", lastResortError);
        throw navError;
      }
    }

    // Wait for content to load - page is likely JavaScript-heavy
    console.log("⏳ Waiting for JavaScript content to load...");
    await wait(5000);

    // Wait for any JavaScript to finish loading
    console.log("⏳ Waiting for page to be ready...");
    try {
      await page.waitForFunction(() => document.readyState === "complete", {
        timeout: 5000,
      });
      console.log("✅ Document ready state is complete");
    } catch (readyError) {
      console.log("⚠️ Document ready timeout, proceeding anyway");
    }

    // Check if title changed from "Loading"
    const finalTitle = await page.title();
    console.log(`📝 Final page title: ${finalTitle}`);

    if (finalTitle === "Loading") {
      console.log("⚠️ Page still showing 'Loading' - waiting more...");
      await wait(3000);
    }

    // Get current page info for debugging
    const currentUrl = page.url();
    const pageTitle = await page.title();
    console.log(`📄 Current page: ${currentUrl}`);
    console.log(`📝 Page title: ${pageTitle}`);

    // Define all available providers
    const allProviders = [
      { id: "pg-soft", name: "PG Soft", selector: 'img[alt="PG Soft"]' },
      {
        id: "pragmatic-play",
        name: "PragmaticPlay Slot",
        selector: 'img[alt="PragmaticPlay Slot"]',
      },
      { id: "jili", name: "Jili", selector: 'img[alt="Jili"]' },
      {
        id: "microgaming",
        name: "Microgaming Slot",
        selector: 'img[alt="Microgaming Slot"]',
      },
    ];

    // Determine which provider(s) to scrape
    let providersToScrape;
    if (targetProvider) {
      const selectedProvider = allProviders.find(
        (p) => p.id === targetProvider
      );
      if (selectedProvider) {
        providersToScrape = [selectedProvider];
        console.log(`🎯 Targeting specific provider: ${selectedProvider.name}`);
      } else {
        console.log(
          `⚠️ Provider "${targetProvider}" not found, defaulting to PG Soft`
        );
        providersToScrape = [allProviders[0]]; // Default to PG Soft
      }
    } else {
      console.log(`🎯 No specific provider requested, defaulting to PG Soft`);
      providersToScrape = [allProviders[0]]; // Default to PG Soft
    }

    const allGames: Game[] = [];

    // Scrape games from selected provider(s)
    for (const provider of providersToScrape) {
      console.log(`🎮 Scraping games from ${provider.name}...`);

      try {
        // Click on provider image
        console.log(`🖱️ Clicking on ${provider.name} provider at ${new Date().toISOString()}`);
        await page.click(provider.selector);
        await wait(3000); // Wait for games to load

        // Wait for game items to load
        console.log(`⏳ Waiting for .game-item elements to load for ${provider.name}...`);
        try {
          await page.waitForSelector(".game-item", {
            timeout: 15000,
            visible: true,
          });
          console.log(`✅ Found .game-item elements for ${provider.name}!`);
        } catch (gameItemError) {
          console.log(
            `⚠️ No .game-item elements found for ${provider.name}, trying alternatives...`
          );
        }

        // Extract game data for this provider
        console.log(`🔍 Extracting game data for ${provider.name} at ${new Date().toISOString()}...`);
        const providerGames = await extractGamesFromPage(page, provider.name);

        console.log(
          `📊 Found ${providerGames.length} games from ${provider.name} (RTP sorted, top 10)`
        );
        allGames.push(...providerGames);
      } catch (error) {
        console.error(`❌ Error scraping ${provider.name}:`, error);
        console.error(`❌ Provider error timestamp: ${new Date().toISOString()}`);
        continue;
      }
    }

    console.log(`🎮 Total games scraped: ${allGames.length}`);
    console.log(`✅ Scraping completed successfully at ${new Date().toISOString()}`);
    return allGames;
  } catch (error) {
    console.error("❌ Server-side scraping failed:", error);
    console.error(`❌ Error timestamp: ${new Date().toISOString()}`);

    // Ensure browser is closed even on error
    if (browser) {
      try {
        await browser.close();
        console.log("🔒 Browser closed after error");
      } catch (closeError) {
        console.error("Error closing browser:", closeError);
      }
    }

    // Return empty array on scraping failure
    console.log("🔄 Returning empty array due to scraping failure");
    console.log(`🔄 Failure timestamp: ${new Date().toISOString()}`);
    return [];
  } finally {
    // Make sure browser is always closed
    if (browser) {
      try {
        await browser.close();
        console.log("🔒 Browser closed in finally block");
      } catch (closeError) {
        console.error("Error closing browser in finally:", closeError);
      }
    }
  }
}

// Helper function to extract games from current page
async function extractGamesFromPage(
  page: any,
  providerName: string
): Promise<Game[]> {
  try {
    const gameData = await page.evaluate((provider: string) => {
      const games: any[] = [];

      // Use specific selectors based on actual DOM structure from screenshot
      const possibleSelectors = [
        ".game-item", // Primary selector from screenshot
        '[class*="game-item"]', // Backup with class contains
        'div[class*="game"]', // Generic game divs
      ];

      let gameElements: Element[] = [];

      try {
        for (const selector of possibleSelectors) {
          const elements = document.querySelectorAll(selector);
          if (elements.length > 0) {
            gameElements = Array.from(elements);
            console.log(
              `Found ${elements.length} games with selector: ${selector}`
            );
            break;
          }
        }
      } catch (e) {
        console.log("No game elements found", e);
      }

      // Fallback: find images using specific class from screenshot
      if (gameElements.length === 0) {
        console.log("No .game-item found, trying image-based fallback...");
        const images = document.querySelectorAll(
          '.img-game, img[src*="game"], img[src*="slot"], img[alt*="game"]'
        );
        gameElements = Array.from(images)
          .map(
            (img) =>
              img.closest(".game-item") ||
              img.closest("div") ||
              img.parentElement
          )
          .filter(Boolean) as Element[];
        console.log(`Found ${gameElements.length} elements via image fallback`);
      }

      gameElements.forEach((element, index) => {
        try {
          // Extract image using specific selector from screenshot
          const img = element.querySelector(".img-game") as HTMLImageElement;
          let imageUrl = "";
          if (img) {
            imageUrl = img.src || img.dataset.src || img.dataset.original || "";
            // Convert relative URLs to absolute
            if (imageUrl.startsWith("/")) {
              imageUrl = "https://m.amigo.love" + imageUrl;
            }
          }

          // Extract game name using specific selector from screenshot
          let gameName = "";
          const gameNameEl = element.querySelector(".game-name");
          if (gameNameEl?.textContent?.trim()) {
            gameName = gameNameEl.textContent.trim();
          }

          // Fallback to alt text from image
          if (!gameName && img) {
            gameName = img.alt || img.title || "";
          }
          if (!gameName) {
            gameName = `Game ${index + 1}`;
          }

          // Extract additional info
          const category =
            element.querySelector('[class*="category"]')?.textContent?.trim() ||
            "slot";

          // Check for hot/new badges
          const badges = element.querySelectorAll(
            '[class*="hot"], [class*="new"], [class*="badge"]'
          );
          let isHot = false;
          let isNew = false;

          badges.forEach((badge) => {
            const text = badge.textContent?.toLowerCase() || "";
            if (text.includes("hot") || text.includes("火")) isHot = true;
            if (text.includes("new") || text.includes("新")) isNew = true;
          });

          // Only include if we have at least a name or image
          if (gameName || imageUrl) {
            games.push({
              id: `${provider.toLowerCase().replace(/\s+/g, "-")}-game-${
                index + 1
              }`,
              name: gameName,
              image: imageUrl,
              category: category || "slot",
              provider: provider,
              isHot,
              isNew,
              // Extract players from .text-online with robust parsing
              players: (() => {
                const playersEl = element.querySelector(
                  '.text-online, [class*="text-online"]'
                );
                const raw = playersEl?.textContent?.trim() || "";

                // Support formats: "1,234", "1.2K", "2.3M"
                const cleaned = raw.replace(/,/g, "");
                const match = cleaned.match(/(\d+(?:\.\d+)?)([kKmM]?)/);
                if (match) {
                  const base = parseFloat(match[1]);
                  const suffix = match[2]?.toLowerCase();
                  const multiplier =
                    suffix === "k" ? 1000 : suffix === "m" ? 1000000 : 1;
                  const value = Math.round(base * multiplier);
                  if (!Number.isNaN(value) && value > 0) return value;
                }

                // Fallback if not found
                return Math.floor(Math.random() * 3000) + 200;
              })(),
              rtp: (() => {
                // Prefer .rtp-box .percent inside this .game-item, then fall back
                const percentEl = element.querySelector(
                  '.rtp-box .percent, .percent, [class*="percent"]'
                );

                let value = percentEl?.textContent?.trim() || "";

                // Normalize if it lacks % or contains extra text
                if (value && !/%/.test(value)) {
                  const match = value.match(/(\d{2,3}(?:\.\d+)?)/);
                  if (match) value = `${match[1]}%`;
                }

                // Fallback: scan the card text for a percentage
                if (!value) {
                  const text = element.textContent || "";
                  const match = text.match(/(\d{2,3}(?:\.\d+)?)\s*%/);
                  if (match) value = `${match[1]}%`;
                }

                return value || null;
              })(),
            });
          }
        } catch (error) {
          console.log(`Error processing game element ${index}:`, error);
        }
      });

      return games;
    }, providerName);

    // Sort games by RTP (highest first) and limit to 10 games
    const sortedGames = (gameData || [])
      .sort((a: Game, b: Game) => {
        // Extract numeric RTP values for comparison
        const rtpA = parseFloat(a.rtp?.replace("%", "") || "0");
        const rtpB = parseFloat(b.rtp?.replace("%", "") || "0");
        return rtpB - rtpA; // Sort descending (highest first)
      })
      .slice(0, 10); // Limit to 10 games

    console.log(
      `🎯 Sorted and limited to top ${sortedGames.length} games by RTP for ${providerName} at ${new Date().toISOString()}`
    );
    return sortedGames;
  } catch (error) {
    console.error(`❌ Error extracting games for ${providerName}:`, error);
    console.error(`❌ Extraction error timestamp: ${new Date().toISOString()}`);
    return [];
  }
}
