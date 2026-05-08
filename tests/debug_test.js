
const { chromium } = require('playwright');
const BASE = 'https://product-web-app-umber.vercel.app';

(async () => {
  const browser = await chromium.launch({ headless: true });
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await ctx.newPage();

  page.on('console', msg => {
    if (msg.type() === 'error') console.log('CONSOLE ERROR:', msg.text());
  });
  page.on('pageerror', err => console.log('PAGE ERROR:', err.message));

  // Intercept network requests
  page.on('response', res => {
    if (res.url().includes('supabase') || res.url().includes('/api/')) {
      console.log('NETWORK:', res.status(), res.url().substring(0, 80));
    }
  });

  console.log('=== DEBUG: Signup Flow ===');
  await page.goto(BASE + '/join', { waitUntil: 'networkidle' });

  const email = 'neo.debug' + Date.now() + '@gmail.com';
  console.log('Email:', email);
  
  await page.getByTestId('input-display-name').fill('Test User');
  await page.getByTestId('input-email').fill(email);
  await page.getByTestId('input-password').fill('Test123456');
  
  // Listen for response
  const [response] = await Promise.all([
    page.waitForResponse(r => r.url().includes('supabase') || r.url().includes('/api/'), { timeout: 10000 }).catch(e => null),
    page.getByRole('button', { name: /create account/i }).click()
  ]);
  
  await page.waitForTimeout(5000);
  
  const url = page.url();
  console.log('Final URL:', url.replace(BASE, ''));
  
  // Check for error message
  const errorEl = await page.$('[class*="error"]');
  if (errorEl) {
    console.log('Error element:', await errorEl.innerText());
  }
  
  // Check page content for any error text
  const content = await page.content();
  if (content.includes('rate limit')) {
    console.log('RATE LIMIT DETECTED');
  }
  if (content.includes('email')) {
    const match = content.match(/"error"[^}]+}/);
    if (match) console.log('Error in page:', match[0].substring(0, 200));
  }

  await browser.close();
})();
