
const { chromium } = require('playwright');
const BASE = 'https://product-web-app-umber.vercel.app';

(async () => {
  const browser = await chromium.launch({ headless: true });
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await ctx.newPage();

  const consoleErrors = [];
  page.on('console', msg => {
    if (msg.type() === 'error') consoleErrors.push(msg.text());
  });

  console.log('=== SIGNUP FLOW TEST (after rate limit cooldown) ===');

  // Use a unique email to avoid rate limit
  const uniqueId = Date.now();
  const email = 'neo+' + uniqueId + '@outlook.com';
  console.log('Using email:', email);

  await page.goto(BASE + '/join', { waitUntil: 'networkidle' });
  await page.getByTestId('input-display-name').fill('Test User');
  await page.getByTestId('input-email').fill(email);
  await page.getByTestId('input-password').fill('Test123456');
  await page.getByRole('button', { name: /create account/i }).click();
  await page.waitForTimeout(5000);

  const url = page.url();
  console.log('URL after signup:', url.replace(BASE, ''));
  console.log('BUG 1 FIXED:', url.includes('/create-family') ? 'YES' : 'NO (url=' + url.replace(BASE,'') + ')');

  // Check if we stayed on /join (error case)
  const errorEl = await page.$('[class*="error"]');
  if (errorEl) {
    const errText = await errorEl.innerText();
    console.log('Signup error:', errText);
  }

  // Check console errors
  console.log('Console errors:', consoleErrors.length > 0 ? consoleErrors.slice(0,3).join('; ') : 'none');

  await browser.close();
})();
