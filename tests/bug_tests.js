
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

  console.log('=== BUG TESTS ===');

  // BUG 1: Signup redirect destination
  console.log('\n[BUG 1] Signup redirect destination');
  await page.goto(BASE + '/join', { waitUntil: 'networkidle' });
  await page.getByTestId('input-display-name').fill('Test User');
  await page.getByTestId('input-email').fill('neo.bugtest.' + Date.now() + '@gmail.com');
  await page.getByTestId('input-password').fill('Test123456');
  await page.getByRole('button', { name: /create account/i }).click();
  await page.waitForTimeout(3000);
  const urlAfterSignup = page.url();
  console.log('  URL after signup:', urlAfterSignup);
  console.log('  EXPECTED: /dashboard or /create-family');
  const bug1 = urlAfterSignup.includes('/dashboard') ? 'PASS' : 'FAIL - stays at ' + urlAfterSignup.replace(BASE, '');
  console.log('  STATUS:', bug1);

  // BUG 2: Console errors check
  console.log('\n[BUG 2] Console errors after signup');
  if (consoleErrors.length > 0) {
    console.log('  ERRORS:', consoleErrors.slice(0, 5).join('; '));
  } else {
    console.log('  No console errors');
  }

  // BUG 3: Dashboard without family
  console.log('\n[BUG 3] Dashboard behavior when user has no family');
  const res = await page.goto(BASE + '/dashboard', { waitUntil: 'networkidle' });
  console.log('  HTTP:', res.status(), 'URL:', page.url());
  const dashContent = await page.content();
  if (dashContent.includes('no family') || dashContent.includes('create family') || dashContent.includes('create-family')) {
    console.log('  Shows family creation: YES');
  } else {
    console.log('  Shows family creation: NO (may crash)');
  }

  // BUG 4: SignIn redirect destination (test with invalid creds to see error)
  console.log('\n[BUG 4] SignIn error handling');
  await page.goto(BASE + '/login', { waitUntil: 'networkidle' });
  await page.getByTestId('input-email').fill('notexist@test.com');
  await page.getByTestId('input-password').fill('wrongpass');
  await page.getByTestId('btn-login').click();
  await page.waitForTimeout(2000);
  const errorEl = await page.$('[class*="error"]');
  const errorText = errorEl ? await errorEl.innerText() : 'no error element found';
  console.log('  Error shown:', errorText.substring(0, 100));

  console.log('\n=== DONE ===');
  await browser.close();
})();
