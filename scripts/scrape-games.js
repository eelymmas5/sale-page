/**
 * Game Scraper for amigo.love
 * 
 * This script scrapes game data from https://m.amigo.love/game-slot
 * and formats it for use in the PopularGames component.
 * 
 * Usage:
 * 1. Install puppeteer: npm install puppeteer
 * 2. Run: node scripts/scrape-games.js
 * 3. Copy the output to your games data
 */

const puppeteer = require('puppeteer');
const fs = require('fs');

async function scrapeGameData() {
  console.log('🎮 Starting game data scraper...');
  
  const browser = await puppeteer.launch({
    headless: false, // Set to true in production
    userDataDir: './chrome-profile',
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-dev-shm-usage',
      '--disable-web-security',
      '--user-agent=Mozilla/5.0 (iPhone; CPU iPhone OS 14_7_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.1.2 Mobile/15E148 Safari/604.1'
    ]
  });

  try {
    const page = await browser.newPage();
    
    // Set mobile viewport
    await page.setViewport({ width: 375, height: 667 });
    
    // Set additional headers
    await page.setExtraHTTPHeaders({
      'Accept-Language': 'en-US,en;q=0.9',
      'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8'
    });
    
    console.log('📱 Navigating to mobile game slot page...');
    await page.goto('https://m.amigo.love/game-slot', {
      waitUntil: 'networkidle2',
      timeout: 30000
    });
    
    // Wait for games to load
    console.log('⏳ Waiting for games to load...');
    await page.waitForTimeout(5000);
    
    // Try to find and click load more if exists
    try {
      const loadMoreBtn = await page.$('[class*="load"], [class*="more"], button:contains("更多")');
      if (loadMoreBtn) {
        console.log('🔄 Loading more games...');
        await loadMoreBtn.click();
        await page.waitForTimeout(3000);
      }
    } catch (e) {
      console.log('ℹ️  No load more button found');
    }
    
    // Extract game data
    console.log('🔍 Extracting game data...');
    const gameData = await page.evaluate(() => {
      const games = [];
      
      // Common selectors for game cards/items
      const gameSelectors = [
        '[class*="game"]',
        '[class*="card"]',
        '[class*="item"]',
        '[class*="slot"]',
        '.game-item',
        '.game-card',
        '.slot-item'
      ];
      
      let gameElements = [];
      
      // Try different selectors
      for (const selector of gameSelectors) {
        const elements = document.querySelectorAll(selector);
        if (elements.length > 0) {
          gameElements = Array.from(elements);
          console.log(`Found ${elements.length} games using selector: ${selector}`);
          break;
        }
      }
      
      // If no specific game elements found, try to find images with game-like patterns
      if (gameElements.length === 0) {
        const images = document.querySelectorAll('img[src*="game"], img[src*="slot"], img[alt*="game"], img[alt*="slot"]');
        gameElements = Array.from(images).map(img => img.closest('div') || img.parentElement);
      }
      
      gameElements.forEach((element, index) => {
        try {
          // Extract image
          const img = element.querySelector('img');
          const imageUrl = img ? (img.src || img.dataset.src || img.dataset.original) : '';
          
          // Extract title/name - try different approaches
          const titleSelectors = [
            '[class*="title"]',
            '[class*="name"]', 
            'h1, h2, h3, h4, h5, h6',
            '.title',
            '.name',
            '.game-title',
            '.game-name'
          ];
          
          let title = '';
          for (const selector of titleSelectors) {
            const titleEl = element.querySelector(selector);
            if (titleEl && titleEl.textContent.trim()) {
              title = titleEl.textContent.trim();
              break;
            }
          }
          
          // If no title found, try alt text or data attributes
          if (!title && img) {
            title = img.alt || img.dataset.title || img.title || '';
          }
          
          // Extract any additional data
          const provider = element.querySelector('[class*="provider"]')?.textContent?.trim() || '';
          const category = element.querySelector('[class*="category"]')?.textContent?.trim() || '';
          const status = element.querySelector('[class*="hot"], [class*="new"]')?.textContent?.trim() || '';
          
          // Only add if we have at least a title or image
          if (title || imageUrl) {
            games.push({
              id: `game-${index + 1}`,
              name: title || `Game ${index + 1}`,
              image: imageUrl,
              category: category || 'slot',
              provider: provider,
              isHot: status.toLowerCase().includes('hot'),
              isNew: status.toLowerCase().includes('new'),
              // Generate random but realistic data for demo
              players: Math.floor(Math.random() * 5000) + 100,
              rtp: (Math.random() * 8 + 92).toFixed(2) + '%'
            });
          }
        } catch (error) {
          console.log(`Error processing game ${index}:`, error.message);
        }
      });
      
      return games;
    });
    
    console.log(`✅ Successfully scraped ${gameData.length} games`);
    
    // Generate TypeScript/JavaScript data format
    const formattedData = {
      timestamp: new Date().toISOString(),
      source: 'https://m.amigo.love/game-slot',
      totalGames: gameData.length,
      games: gameData
    };
    
    // Save to file
    const outputPath = './scraped-games.json';
    fs.writeFileSync(outputPath, JSON.stringify(formattedData, null, 2));
    console.log(`💾 Data saved to ${outputPath}`);
    
    // Generate TypeScript format for direct use
    const tsFormat = `// Generated game data from amigo.love scraper
// Generated on: ${new Date().toISOString()}

export const scrapedGames = ${JSON.stringify(gameData, null, 2)};`;
    
    const tsOutputPath = './src/data/scraped-games.ts';
    const dir = './src/data';
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(tsOutputPath, tsFormat);
    console.log(`📝 TypeScript data saved to ${tsOutputPath}`);
    
    // Show preview
    console.log('\n🎮 Preview of scraped games:');
    gameData.slice(0, 3).forEach((game, index) => {
      console.log(`${index + 1}. ${game.name}`);
      console.log(`   Image: ${game.image ? game.image.substring(0, 50) + '...' : 'No image'}`);
      console.log(`   Category: ${game.category}`);
      console.log(`   Players: ${game.players}, RTP: ${game.rtp}`);
      console.log('');
    });
    
    return gameData;
    
  } catch (error) {
    console.error('❌ Scraping failed:', error.message);
    throw error;
  } finally {
    await browser.close();
  }
}

// Alternative: Manual data extraction helper
function generateGameDataTemplate() {
  console.log('\n📋 If scraping fails, you can manually create data like this:');
  console.log(`
const manualGameData = [
  {
    id: "game-1",
    name: "Golden Temple",
    image: "https://example.com/game-image.jpg",
    category: "slot",
    provider: "Pragmatic Play",
    players: 540,
    rtp: "96.25%",
    isHot: true,
    isNew: false
  },
  // Add more games...
];
  `);
}

// Run the scraper
if (require.main === module) {
  scrapeGameData()
    .then((games) => {
      console.log(`\n🎉 Scraping completed! Found ${games.length} games.`);
      console.log('\n📖 Next steps:');
      console.log('1. Review the scraped data in scraped-games.json');
      console.log('2. Update your PopularGames component to use the new data');
      console.log('3. Replace mock data with: import { scrapedGames } from "@/data/scraped-games"');
    })
    .catch((error) => {
      console.error('\n💥 Scraping failed. Showing manual alternative...');
      generateGameDataTemplate();
    });
}

module.exports = { scrapeGameData };