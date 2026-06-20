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
    let targetPage = pages.find(p => p.url().includes('localhost:3000/browse'));
    
    if (!targetPage) {
      console.log('Browse page tab not found, creating a new tab...');
      targetPage = await browser.newPage();
      await targetPage.setViewport({ width: 1440, height: 900 });
      await targetPage.goto('http://localhost:3000/browse', { waitUntil: 'networkidle0' });
    } else {
      console.log('Found open browse page tab, reloading...');
      await targetPage.reload({ waitUntil: 'networkidle0' });
    }

    // Wait for the lawyer cards to load
    console.log('Waiting for lawyer cards...');
    await targetPage.waitForSelector('.grid img', { timeout: 10000 });

    const imageUrls = await targetPage.evaluate(() => {
      const imgs = Array.from(document.querySelectorAll('.grid img'));
      return imgs.map(img => img.src);
    });

    console.log(`\nFound ${imageUrls.length} lawyer card images on the page.`);
    
    const duplicates = imageUrls.filter((item, index) => imageUrls.indexOf(item) !== index);
    
    if (duplicates.length === 0) {
      console.log('✔ SUCCESS: All displayed lawyer images are unique!');
    } else {
      console.log('❌ FAILURE: Found duplicate images on the page:');
      duplicates.forEach(url => console.log(`  - Duplicate: ${url}`));
    }

  } catch (err) {
    console.error('Error during unique image check:', err);
  } finally {
    if (browser) {
      await browser.disconnect();
    }
  }
})();
