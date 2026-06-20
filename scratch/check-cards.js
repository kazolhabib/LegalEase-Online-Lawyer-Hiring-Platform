const puppeteer = require('puppeteer-core');

(async () => {
  let browser;
  try {
    console.log('Connecting to Chrome on port 9222...');
    browser = await puppeteer.connect({
      browserURL: 'http://127.0.0.1:9222',
      defaultViewport: null
    });
    console.log('Connected successfully!');

    const pages = await browser.pages();
    let targetPage = pages.find(p => p.url().includes('localhost:3000') && !p.url().includes('dashboard'));
    
    if (!targetPage) {
      console.log('Home page tab not found, creating a new tab...');
      targetPage = await browser.newPage();
      await targetPage.setViewport({ width: 1440, height: 900 });
      await targetPage.goto('http://localhost:3000/', { waitUntil: 'domcontentloaded' });
    } else {
      console.log('Found open homepage tab, reloading...');
      await targetPage.reload({ waitUntil: 'networkidle0' });
    }

    // Wait for the Featured Legal Advocates section
    console.log('Waiting for Featured section...');
    await targetPage.waitForFunction(() => {
      const headings = Array.from(document.querySelectorAll('h2'));
      return headings.some(h => h.textContent.includes('Featured Legal Advocates'));
    }, { timeout: 10000 });

    const cardCount = await targetPage.evaluate(() => {
      const heading = Array.from(document.querySelectorAll('h2')).find(h => h.textContent.includes('Featured Legal Advocates'));
      if (!heading) return -1;
      
      const section = heading.closest('section');
      if (!section) return -2;
      
      // Find the grid container under this section
      const grids = Array.from(section.querySelectorAll('div'));
      // The grid container has the class "grid"
      const grid = grids.find(g => g.className && g.className.includes('grid'));
      if (!grid) return -3;
      
      // Find the card elements inside this grid
      const cards = grid.children;
      return cards.length;
    });

    console.log(`\n>>> RESULT: Number of featured cards found = ${cardCount} <<<\n`);
    
    if (cardCount === 8) {
      console.log('✔ SUCCESS: Exactly 8 featured cards are displayed!');
    } else {
      console.log(`❌ FAILURE: Expected 8 cards, but found ${cardCount}.`);
      // Dump the HTML for troubleshooting if needed
      const debugHtml = await targetPage.evaluate(() => {
        const h = Array.from(document.querySelectorAll('h2')).find(h => h.textContent.includes('Featured Legal Advocates'));
        return h ? h.closest('section').innerHTML : 'Heading not found';
      });
      console.log('Debug Section HTML:', debugHtml.substring(0, 1000));
    }

  } catch (err) {
    console.error('Error during card check:', err);
  } finally {
    if (browser) {
      await browser.disconnect();
    }
  }
})();
