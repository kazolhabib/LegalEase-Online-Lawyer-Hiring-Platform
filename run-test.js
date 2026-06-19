const puppeteer = require('puppeteer-core');

(async () => {
  let browser, page;
  try {
    console.log('Connecting to Chrome on port 9222...');
    browser = await puppeteer.connect({
      browserURL: 'http://127.0.0.1:9222',
      defaultViewport: null
    });
    console.log('Connected successfully!');

    // Create a new tab
    page = await browser.newPage();
    // Set a good viewport size
    await page.setViewport({ width: 1440, height: 900 });

    // Enable console, error, and response logging
    page.on('console', msg => console.log('PAGE LOG:', msg.text()));
    page.on('pageerror', err => console.log('PAGE ERROR:', err.toString()));
    page.on('requestfailed', req => console.log('PAGE REQUEST FAILED:', req.url(), req.failure()?.errorText || ''));
    page.on('response', res => {
      if (res.status() >= 400) {
        console.log(`PAGE RESPONSE ERROR (${res.status()}):`, res.url());
      } else {
        console.log(`PAGE RESPONSE (${res.status()}):`, res.url());
      }
    });

    const clearAndType = async (selector, text) => {
      await page.focus(selector);
      await page.evaluate((sel, val) => {
        const input = document.querySelector(sel);
        // React 16+ tracks values via descriptor to prevent bypassing React's setter.
        const nativeInputValueSetter = Object.getOwnPropertyDescriptor(
          window.HTMLInputElement.prototype,
          "value"
        ).set;
        nativeInputValueSetter.call(input, val);

        // Dispatch input event to trigger React onChange
        const event = new Event('input', { bubbles: true });
        input.dispatchEvent(event);
      }, selector, text);
    };

    const loginAndCheck = async (email, password) => {
      console.log('Ensuring clean state / logging out...');
      await page.goto('http://localhost:3000/', { waitUntil: 'domcontentloaded' });
      await page.evaluate(() => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      });
      
      let attempts = 0;
      while (attempts < 3) {
        try {
          attempts++;
          console.log(`Navigating to login page for ${email} (attempt ${attempts}/3)...`);
          await page.goto('http://localhost:3000/login', { waitUntil: 'domcontentloaded' });
          
          console.log('Waiting for login form fields to be ready...');
          await page.waitForSelector('input[placeholder="you@example.com"]', { timeout: 8000 });
          await page.waitForSelector('input[type="password"]', { timeout: 8000 });
          await page.waitForSelector('form button[type="submit"]', { timeout: 8000 });
          break; // success
        } catch (e) {
          console.log(`Login page fields loading failed (attempt ${attempts}): ${e.message}`);
          if (attempts >= 3) throw e;
          console.log('Reloading/retrying page...');
          await new Promise(r => setTimeout(r, 2000));
        }
      }

      // Dismiss Google Sign-In popup if visible
      try {
        await page.evaluate(() => {
          const popup = document.querySelector('iframe[src*="accounts.google.com"]');
          if (popup) popup.remove();
        });
      } catch (e) {}

      await new Promise(r => setTimeout(r, 500));

      console.log('Clearing and filling email...');
      await clearAndType('input[placeholder="you@example.com"]', email);

      console.log('Clearing and filling password...');
      await clearAndType('input[type="password"]', password);

      await new Promise(r => setTimeout(r, 500));

      // Inspect values before clicking
      const values = await page.evaluate(() => {
        const emailInput = document.querySelector('input[placeholder="you@example.com"]');
        const passInput = document.querySelector('input[type="password"]');
        return {
          email: emailInput ? emailInput.value : null,
          password: passInput ? passInput.value : null
        };
      });
      console.log('INPUT VALUES BEFORE SUBMITTING:', values);

      console.log('Submitting login form by clicking Sign In button...');
      await page.evaluate(() => {
        const submitBtn = Array.from(document.querySelectorAll('form button')).find(b => b.textContent.toLowerCase().includes('sign in'));
        if (submitBtn) submitBtn.click();
      });
      
      console.log('Waiting for redirection...');
      try {
        await page.waitForFunction(() => window.location.pathname === '/' || window.location.pathname.startsWith('/dashboard'), { timeout: 10000 });
        console.log('Logged in successfully!');
      } catch (e) {
        console.log('Redirection failed or timed out. Fetching page details for debugging:');
        const url = page.url();
        const content = await page.evaluate(() => {
          const errDiv = document.querySelector('div.bg-rose-500\\/10');
          return errDiv ? errDiv.innerText : 'No error message div found';
        });
        console.log(`Current URL: ${url}`);
        console.log(`Error Message on Page: "${content}"`);
        throw e;
      }
    };

    const logout = async () => {
      console.log('Logging out...');
      await page.goto('http://localhost:3000/', { waitUntil: 'domcontentloaded' });
      await page.evaluate(() => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      });
      await page.reload({ waitUntil: 'domcontentloaded' });
      console.log('Logged out successfully.');
    };

    // ==========================================
    // TEST 1: Admin Login & Dashboard Overview
    // ==========================================
    console.log('\n--- Running Test 1: Admin Login & Dashboard ---');
    await loginAndCheck('admin@gmail.com', '123456');
    
    console.log('Navigating to Admin Dashboard...');
    await page.goto('http://localhost:3000/dashboard/admin/analytics', { waitUntil: 'domcontentloaded' });
    await page.waitForSelector('h2');
    
    // Check if the Admin title is present
    const adminHeader = await page.evaluate(() => {
      const h2 = document.querySelector('h2');
      return h2 ? h2.textContent : null;
    });
    console.log(`Admin dashboard header found: "${adminHeader}"`);
    if (adminHeader && (adminHeader.includes('System Analytics') || adminHeader.includes('Platform Analytics'))) {
      console.log('✔ Test 1 PASS: Admin can view system overview/analytics.');
    } else {
      console.log('❌ Test 1 FAIL: Admin dashboard header not found or incorrect.');
    }

    await logout();

    // ==========================================
    // TEST 2: Client Login & Initiate Hiring
    // ==========================================
    console.log('\n--- Running Test 2: Client Login & Initiate Hiring ---');
    await loginAndCheck('client@gmail.com', '123456');

    console.log('Navigating directly to lawyers browse page filtered by Rafique...');
    await page.goto('http://localhost:3000/browse?search=Rafique', { waitUntil: 'domcontentloaded' });

    // Wait for the search results to load
    console.log('Waiting for search results to load...');
    await page.waitForSelector('div.group', { timeout: 15000 });

    // Find and click View Profile on Barrister Rafique-ul Huq's card
    console.log('Finding Rafique-ul Huq\'s profile...');
    const lawyerProfileUrl = await page.evaluate(() => {
      const cards = Array.from(document.querySelectorAll('div.group'));
      for (const card of cards) {
        if (card.textContent.includes('Rafique-ul Huq')) {
          const link = card.querySelector('a');
          return link ? link.href : null;
        }
      }
      return null;
    });

    if (!lawyerProfileUrl) {
      throw new Error('Could not find Rafique-ul Huq in browse page.');
    }
    console.log(`Navigating to lawyer profile: ${lawyerProfileUrl}`);
    await page.goto(lawyerProfileUrl, { waitUntil: 'domcontentloaded' });
    // Wait for the actual hire button to be rendered (loader finished)
    await page.waitForFunction(() => {
      const btns = Array.from(document.querySelectorAll('button'));
      return btns.some(b => b.textContent.toLowerCase().includes('hire') || b.textContent.toLowerCase().includes('hiring'));
    }, { timeout: 15000 });

    // Click "Initiate Hiring Case" button
    console.log('Opening hiring modal...');
    const hireBtnClicked = await page.evaluate(() => {
      const btns = Array.from(document.querySelectorAll('button'));
      const hireBtn = btns.find(b => b.textContent.toLowerCase().includes('initiate hiring case'));
      if (hireBtn) {
        hireBtn.click();
        return true;
      }
      return false;
    });
    if (!hireBtnClicked) throw new Error('Could not find Initiate Hiring Case button');
    await new Promise(r => setTimeout(r, 1500)); // wait for modal

    // Click "Confirm Hire" inside modal
    console.log('Confirming hiring request...');
    const confirmBtnClicked = await page.evaluate(() => {
      const btns = Array.from(document.querySelectorAll('button'));
      const confirmBtn = btns.find(b => b.textContent.toLowerCase().includes('confirm hire'));
      if (confirmBtn) {
        confirmBtn.click();
        return true;
      }
      return false;
    });
    if (!confirmBtnClicked) throw new Error('Could not find Confirm Hire button inside modal');

    // Wait for redirect to client hiring history page (client-side routing)
    console.log('Waiting for redirect to hiring history...');
    await page.waitForFunction(() => window.location.pathname === '/dashboard/user/hiring-history', { timeout: 10000 });
    await page.waitForSelector('tbody');
    console.log(`Current page after hiring: ${page.url()}`);

    // Check if the hiring request is present with status "pending"
    const pendingRequest = await page.evaluate(() => {
      const rows = Array.from(document.querySelectorAll('tbody tr'));
      for (const row of rows) {
        if (row.textContent.includes('Rafique-ul Huq') && row.textContent.includes('pending')) {
          return true;
        }
      }
      return false;
    });

    if (pendingRequest) {
      console.log('✔ Test 2 PASS: Client successfully submitted a hiring request (Awaiting Lawyer Review).');
    } else {
      console.log('❌ Test 2 FAIL: Hiring request not found in history or status not pending.');
    }

    await logout();

    // ==========================================
    // TEST 3: Lawyer Login & Accept Request
    // ==========================================
    console.log('\n--- Running Test 3: Lawyer Login & Accept Request ---');
    await loginAndCheck('rafique@legalease.com', '123456');

    console.log('Navigating to Lawyer Inbound Consultations...');
    await page.goto('http://localhost:3000/dashboard/lawyer/hiring-history', { waitUntil: 'domcontentloaded' });
    await page.waitForSelector('tbody');

    // Find the request from Client and accept it
    console.log('Accepting the incoming client request...');
    const accepted = await page.evaluate(async () => {
      const rows = Array.from(document.querySelectorAll('tbody tr'));
      for (const row of rows) {
        if (row.textContent.includes('Kazi Client') && row.textContent.includes('pending')) {
          const acceptBtn = Array.from(row.querySelectorAll('button')).find(b => b.textContent.toLowerCase().includes('accept'));
          if (acceptBtn) {
            acceptBtn.click();
            return true;
          }
        }
      }
      return false;
    });

    if (accepted) {
      await new Promise(r => setTimeout(r, 2000));
      console.log('✔ Test 3 PASS: Lawyer accepted the request successfully.');
    } else {
      console.log('❌ Test 3 FAIL: No pending request found from Client or Accept button click failed.');
    }

    await logout();

    // ==========================================
    // TEST 4: Client Settle Fee (Mock Pay)
    // ==========================================
    console.log('\n--- Running Test 4: Client Settle Fee (Mock Pay) ---');
    await loginAndCheck('client@gmail.com', '123456');

    console.log('Navigating back to client hiring history...');
    await page.goto('http://localhost:3000/dashboard/user/hiring-history', { waitUntil: 'domcontentloaded' });
    await page.waitForSelector('tbody');

    // Click "Mock Pay" on the accepted request
    console.log('Executing Mock Pay...');
    const paid = await page.evaluate(async () => {
      const rows = Array.from(document.querySelectorAll('tbody tr'));
      for (const row of rows) {
        if (row.textContent.includes('Rafique-ul Huq') && row.textContent.includes('accepted')) {
          const payBtn = Array.from(row.querySelectorAll('button')).find(b => b.textContent.toLowerCase().includes('mock pay'));
          if (payBtn) {
            payBtn.click();
            return true;
          }
        }
      }
      return false;
    });

    if (paid) {
      await new Promise(r => setTimeout(r, 2000)); // Wait for update
      const verifyPaid = await page.evaluate(() => {
        const rows = Array.from(document.querySelectorAll('tbody tr'));
        for (const row of rows) {
          if (row.textContent.includes('Rafique-ul Huq') && row.textContent.includes('paid')) {
            return true;
          }
        }
        return false;
      });

      if (verifyPaid) {
        console.log('✔ Test 4 PASS: Client successfully completed payment (Mock Pay) and status updated to paid.');
      } else {
        console.log('❌ Test 4 FAIL: Status did not update to paid after clicking Mock Pay.');
      }
    } else {
      console.log('❌ Test 4 FAIL: Accepted request not found or Mock Pay button not clickable.');
    }

    console.log('\nAll tests executed.');
    await page.close();

  } catch (err) {
    console.error('Test script crashed:', err);
    if (page) {
      try {
        const url = page.url();
        console.log('Crash Page URL:', url);
        await page.screenshot({ path: './crash.png' });
        console.log('Screenshot saved to ./crash.png');
      } catch (e) {
        console.error('Failed to log page state on crash:', e);
      }
    }
  } finally {
    console.log('Test run finished.');
    if (browser) {
      try {
        await browser.disconnect();
      } catch (e) {}
    }
    process.exit(0);
  }
})();
