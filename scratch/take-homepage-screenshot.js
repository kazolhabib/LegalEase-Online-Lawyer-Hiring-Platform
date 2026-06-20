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
      await targetPage.goto('http://localhost:3000/', { waitUntil: 'networkidle0' });
    } else {
      console.log('Found open homepage tab, bringing to front...');
      await targetPage.bringToFront();
      await targetPage.reload({ waitUntil: 'networkidle0' });
    }

    // Scroll to the heading "Our Impact in Numbers"
    console.log('Scrolling to Stats section...');
    await targetPage.evaluate(() => {
      const heading = Array.from(document.querySelectorAll('h2')).find(h => h.textContent.includes('Our Impact in Numbers'));
      if (heading) {
        heading.scrollIntoView({ block: 'center' });
      }
    });

    // Wait a brief moment for scroll to settle
    await new Promise(r => setTimeout(r, 1500));

    const screenshotPath = '/Users/kazollhabib/.gemini/antigravity-ide/brain/429232e2-10a5-430a-a386-5ebef145f714/homepage_stats_section.png';
    console.log(`Taking screenshot: ${screenshotPath}`);
    await targetPage.screenshot({ path: screenshotPath });
    console.log('Screenshot captured successfully!');

  } catch (err) {
    console.error('Error during screenshot capture:', err);
  } finally {
    if (browser) {
      await browser.disconnect();
    }
  }
})();
