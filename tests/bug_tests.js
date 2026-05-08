
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

  console.log('=== BUG FIX VERIFICATION ===');

  // BUG 1: Signup redirect to /create-family
  console.log('\n[BUG 1] Signup redirect destination (FIXED)');
  await page.goto(BASE + '/join', { waitUntil: 'networkidle' });
  await page.getByTestId('input-display-name').fill('Test User');
  await page.getByTestId('input-email').fill('neo.fix' + Date.now() + '@gmail.com');
  await page.getByTestId('input-password').fill('Test123456');
  await page.getByRole('button', { name: /create account/i }).click();
  await page.waitForTimeout(3000);
  const urlAfterSignup = page.url();
  console.log('  URL after signup:', urlAfterSignup.replace(BASE, ''));
  const bug1Fixed = urlAfterSignup.includes('/create-family') || urlAfterSignup.includes('/dashboard');
  console.log('  STATUS:', bug1Fixed ? 'FIXED' : 'STILL BROKEN');

  // BUG 2: /create-family page renders
  console.log('\n[BUG 2] /create-family page renders (FIXED)');
  await page.goto(BASE + '/create-family', { waitUntil: 'networkidle' });
  const cfTitle = await page.getByText(/create your family/i).count();
  console.log('  Family creation form present:', cfTitle > 0 ? 'YES' : 'NO');

  // BUG 3: Console errors
  console.log('\n[BUG 3] Console errors');
  if (consoleErrors.length > 0) {
    console.log('  ERRORS:', consoleErrors.slice(0, 3).join('; '));
  } else {
    console.log('  No console errors');
  }

  // BUG 4: All protected routes redirect to login when unauthenticated
  console.log('\n[BUG 4] Auth protection on all routes');
  const protectedRoutes = ['/dashboard', '/tasks', '/map', '/feed', '/album', '/settings', '/create-family'];
  for (const route of protectedRoutes) {
    const res = await page.goto(BASE + route, { waitUntil: 'networkidle' });
    const finalUrl = page.url();
    const isLogin = finalUrl.includes('/login');
    console.log('  ' + route + ':', isLogin ? 'REDIRECTS TO LOGIN' : 'ALLOWS ACCESS (BUG)');
  }

  console.log('\n=== DONE ===');
  await browser.close();
})();
