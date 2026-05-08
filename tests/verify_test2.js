
const { chromium } = require('playwright');
const BASE = 'https://product-web-app-umber.vercel.app';

(async () => {
  const browser = await chromium.launch({ headless: true });
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await ctx.newPage();

  // Try a completely fresh email from a different domain
  const uniqueId = Math.floor(Math.random() * 99999999);
  const email = 'neo.test.' + uniqueId + '@protonmail.com';
  console.log('Email:', email);

  await page.goto(BASE + '/join', { waitUntil: 'networkidle' });
  await page.getByTestId('input-display-name').fill('Test User');
  await page.getByTestId('input-email').fill(email);
  await page.getByTestId('input-password').fill('Test123456');
  await page.getByRole('button', { name: /create account/i }).click();
  await page.waitForTimeout(6000);

  const url = page.url();
  console.log('URL after signup:', url.replace(BASE, ''));
  
  // Check for error message
  const errorEl = await page.$('[class*="error"]');
  if (errorEl) {
    console.log('Error:', await errorEl.innerText());
  }
  
  const content = await page.content();
  if (content.includes('rate limit')) {
    console.log('STILL RATE LIMITED');
  }

  console.log('\n=== Also test BUG 4: /create-family auth protection ===');
  // Try accessing create-family without auth
  const res = await page.goto(BASE + '/create-family', { waitUntil: 'networkidle' });
  console.log('create-family URL (unauth):', page.url().replace(BASE, ''));

  await browser.close();
})();
