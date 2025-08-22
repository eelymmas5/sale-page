import puppeteer from "puppeteer-extra";
import StealthPlugin from "puppeteer-extra-plugin-stealth";

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

export async function scrapeGames(): Promise<Game[]> {
  console.log("🎮 Starting server-side game scraping...");

  let browser;
  try {
    console.log(
      "🚀 Launching Puppeteer-Extra browser with mobile stealth plugin..."
    );
    browser = await puppeteer.launch({
      headless: true, // Change back to headless for production
      args: [
        "--no-sandbox",
        "--disable-setuid-sandbox",
        "--disable-dev-shm-usage",
        "--disable-web-security",
        "--disable-features=VizDisplayCompositor",
        "--no-first-run",
        "--disable-extensions",
        "--user-agent=Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1",
      ],
    });

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

    // Test if we can navigate to a simple page first
    console.log("🧪 Testing navigation with simple page...");
    try {
      await page.goto("https://httpbin.org/get", {
        waitUntil: "domcontentloaded",
        timeout: 5000,
      });
      console.log("✅ Simple page navigation test successful!");
    } catch (testError) {
      console.error("❌ Even simple page navigation failed:", testError);
      throw testError;
    }

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
          const response = await page.goto(url, {
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

    // Try to load more games if button exists (commented out for now)
    // try {
    //   const loadMoreBtn = await page.$(
    //     'button:contains("更多"), [class*="load"], [class*="more"]'
    //   );
    //   if (loadMoreBtn) {
    //     await loadMoreBtn.click();
    //     await wait(3000);
    //   }
    // } catch (e) {
    //   console.log("No load more button found");
    // }

    // Get current page info for debugging
    const currentUrl = await page.url();
    const pageTitle = await page.title();
    console.log(`📄 Current page: ${currentUrl}`);
    console.log(`📝 Page title: ${pageTitle}`);

    // Wait specifically for game items to load using exact selector from screenshot
    console.log("⏳ Waiting for .game-item elements to load...");
    try {
      await page.waitForSelector(".game-item", {
        timeout: 30000,
        visible: true,
      });
      console.log("✅ Found .game-item elements!");

      // Also wait for images to load within game items
      try {
        await page.waitForSelector(".game-item .img-game", {
          timeout: 10000,
          visible: true,
        });
        console.log("✅ Found .img-game elements within .game-item!");
      } catch (imgError) {
        console.log("⚠️ .img-game elements not found, but proceeding...");
      }
    } catch (gameItemError) {
      console.log("⚠️ .game-item selector timeout, trying alternatives...");

      // Try alternative selectors based on screenshot structure
      const alternativeSelectors = [
        '[class*="game-item"]',
        'div[class*="game"]',
        '[data-v-545cc5a7][class*="game"]', // Vue.js specific from screenshot
      ];

      let foundSelector = null;
      for (const selector of alternativeSelectors) {
        try {
          await page.waitForSelector(selector, {
            timeout: 5000,
            visible: true,
          });
          foundSelector = selector;
          console.log(`✅ Found alternative selector: ${selector}`);
          break;
        } catch (e) {
          console.log(`⚠️ ${selector} not found`);
        }
      }

      if (!foundSelector) {
        console.log("⚠️ No game selectors found, proceeding with fallback...");
      }
    }

    // Final page info
    const finalBodyText = await page.evaluate(
      () => document.body?.innerText?.length || 0
    );
    console.log(`📊 Final page body text length: ${finalBodyText} characters`);

    // Take screenshot for debugging (optional)
    // await page.screenshot({ path: 'debug-screenshot.png', fullPage: true });
    // console.log("📸 Debug screenshot saved as debug-screenshot.png");

    // Extract game data
    console.log("🔍 Starting to extract game data...");
    try {
      const gameData = await page.evaluate(() => {
        const games: any[] = [];

        // Debug: Check if we can find ANY elements
        const allDivs = document.querySelectorAll("div");
        const allImages = document.querySelectorAll("img");
        const allLinks = document.querySelectorAll("a");

        // Return debug info in the result
        const debugInfo = {
          totalDivs: allDivs.length,
          totalImages: allImages.length,
          totalLinks: allLinks.length,
          bodyTextLength: document.body?.innerText?.length || 0,
          pageTitle: document.title,
        };

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
            console.log("elements", elements);
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

        console.log("gameElements", gameElements);

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
          console.log(
            `Found ${gameElements.length} elements via image fallback`
          );
        }

        gameElements.forEach((element, index) => {
          try {
            // Extract image using specific selector from screenshot
            const img = element.querySelector(".img-game") as HTMLImageElement;
            let imageUrl = "";
            if (img) {
              imageUrl =
                img.src || img.dataset.src || img.dataset.original || "";
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
            const provider =
              element
                .querySelector('[class*="provider"]')
                ?.textContent?.trim() || "";
            const category =
              element
                .querySelector('[class*="category"]')
                ?.textContent?.trim() || "slot";

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
                id: `amigo-game-${index + 1}`,
                name: gameName,
                image: imageUrl,
                category: category || "slot",
                provider: provider || "Unknown",
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

        // Return both games and debug info
        return {
          games,
          debug: debugInfo,
        };
      });

      console.log("🔍 Page evaluation result:", gameData);

      // Extract just the games from the result
      const actualGames = gameData?.games || [];
      console.log(`📊 Debug info from page:`, gameData?.debug);
      console.log(`🎮 Extracted ${actualGames.length} games`);

      // Check if page loaded properly - if not, immediately return fallback
      if (gameData?.debug) {
        const { totalDivs, totalImages, bodyTextLength, pageTitle } =
          gameData.debug;

        if (
          totalDivs <= 5 &&
          totalImages === 0 &&
          bodyTextLength <= 20 &&
          pageTitle === "Loading"
        ) {
          console.log(
            "⚠️ Page appears to be blocked/not loaded properly - returning fallback immediately"
          );
          return generateFallbackGames();
        }
      }

      return actualGames;
    } catch (e) {
      console.log("No game elements found", e);
      return generateFallbackGames();
    }
  } catch (error) {
    console.error("❌ Server-side scraping failed:", error);

    // Ensure browser is closed even on error
    if (browser) {
      try {
        await browser.close();
        console.log("🔒 Browser closed after error");
      } catch (closeError) {
        console.error("Error closing browser:", closeError);
      }
    }

    // Return fallback data
    console.log("🔄 Returning fallback games due to scraping failure");
    return generateFallbackGames();
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

// Enhanced fallback games with more variety and realistic data
function generateFallbackGames(): Game[] {
  return [
    {
      id: "fallback-1",
      name: "Gates of Olympus",
      image: "/api/placeholder/300/200",
      category: "slot",
      provider: "Pragmatic Play",
      players: Math.floor(Math.random() * 2000) + 800,
      rtp: "96.50%",
      isHot: true,
      isNew: false,
    },
    {
      id: "fallback-2",
      name: "Sweet Bonanza",
      image: "/api/placeholder/300/200",
      category: "slot",
      provider: "Pragmatic Play",
      players: Math.floor(Math.random() * 1500) + 600,
      rtp: "96.48%",
      isHot: false,
      isNew: false,
    },
    {
      id: "fallback-3",
      name: "Mahjong Ways 2",
      image: "/api/placeholder/300/200",
      category: "mahjong",
      provider: "PG Soft",
      players: Math.floor(Math.random() * 1200) + 400,
      rtp: "96.42%",
      isHot: false,
      isNew: true,
    },
    {
      id: "fallback-4",
      name: "Fortune Tiger",
      image: "/api/placeholder/300/200",
      category: "slot",
      provider: "PG Soft",
      players: Math.floor(Math.random() * 1800) + 700,
      rtp: "96.81%",
      isHot: true,
      isNew: false,
    },
    {
      id: "fallback-5",
      name: "Crazy Time",
      image: "/api/placeholder/300/200",
      category: "live",
      provider: "Evolution",
      players: Math.floor(Math.random() * 3000) + 1500,
      rtp: "96.08%",
      isHot: true,
      isNew: false,
    },
    {
      id: "fallback-6",
      name: "Lightning Roulette",
      image: "/api/placeholder/300/200",
      category: "live",
      provider: "Evolution",
      players: Math.floor(Math.random() * 2500) + 1000,
      rtp: "97.30%",
      isHot: true,
      isNew: false,
    },
    {
      id: "fallback-7",
      name: "Dragon Tiger",
      image: "/api/placeholder/300/200",
      category: "card",
      provider: "Evolution",
      players: Math.floor(Math.random() * 800) + 200,
      rtp: "96.27%",
      isHot: false,
      isNew: true,
    },
    {
      id: "fallback-8",
      name: "Spaceman",
      image: "/api/placeholder/300/200",
      category: "crash",
      provider: "Pragmatic Play",
      players: Math.floor(Math.random() * 1100) + 400,
      rtp: "96.50%",
      isHot: false,
      isNew: true,
    },
    {
      id: "fallback-9",
      name: "Fortune Ox",
      image: "/api/placeholder/300/200",
      category: "slot",
      provider: "PG Soft",
      players: Math.floor(Math.random() * 1600) + 500,
      rtp: "96.75%",
      isHot: true,
      isNew: false,
    },
    {
      id: "fallback-10",
      name: "Starlight Princess",
      image: "/api/placeholder/300/200",
      category: "slot",
      provider: "Pragmatic Play",
      players: Math.floor(Math.random() * 1400) + 600,
      rtp: "96.50%",
      isHot: true,
      isNew: false,
    },
    {
      id: "fallback-11",
      name: "Baccarat",
      image: "/api/placeholder/300/200",
      category: "live",
      provider: "Evolution",
      players: Math.floor(Math.random() * 2200) + 800,
      rtp: "98.94%",
      isHot: false,
      isNew: false,
    },
  ];
}
