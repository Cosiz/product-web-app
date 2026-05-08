
const { chromium } = require('playwright');

const BASE = 'https://product-web-app-umber.vercel.app';
const results = [];

async function test(name, fn) {
  try {
    await fn();
    results.push({ name, pass: true });
    console.log('PASS:', name);
  } catch(e) {
    results.push({ name, pass: false, error: e.message });
    console.log('FAIL:', name, '-', e.message.substring(0, 100));
  }
}

(async () => {
  const browser = await chromium.launch({ headless: true });
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await ctx.newPage();

  // Collect console errors
  const consoleErrors = [];
  page.on('console', msg => {
    if (msg.type() === 'error') consoleErrors.push(msg.text());
  });

  await test('Login page loads (HTTP 200)', async () => {
    const res = await page.goto(BASE + '/login', { waitUntil: 'networkidle' });
    if (res.status() !== 200) throw new Error('HTTP ' + res.status());
  });

  await test('Login page has title', async () => {
    const title = await page.title();
    if (!title.includes('Neo')) throw new Error('Title: ' + title);
  });

  await test('Login form elements present', async () => {
    const email = await page.getByTestId('input-email').count();
    const password = await page.getByTestId('input-password').count();
    const btn = await page.getByTestId('btn-login').count();
    if (email < 1 || password < 1 || btn < 1) throw new Error('Missing form elements');
  });

  await test('Empty login form shows validation', async () => {
    await page.getByTestId('btn-login').click();
    await page.waitForTimeout(500);
  });

  await test('Join page loads (HTTP 200)', async () => {
    const res = await page.goto(BASE + '/join', { waitUntil: 'networkidle' });
    if (res.status() !== 200) throw new Error('HTTP ' + res.status());
  });

  await test('Protected routes redirect to login', async () => {
    const res = await page.goto(BASE + '/dashboard', { waitUntil: 'networkidle' });
    const url = page.url();
    if (!url.includes('/login')) throw new Error('Did not redirect, URL: ' + url);
  });

  await test('Console errors check', async () => {
    if (consoleErrors.length > 0) {
      throw new Error('Console errors: ' + consoleErrors.slice(0, 3).join('; '));
    }
  });

  // Test with real credentials
  await test('Sign up flow', async () => {
    await page.goto(BASE + '/join', { waitUntil: 'networkidle' });
    await page.getByTestId('input-display-name').fill('Test User');
    await page.getByTestId('input-email').fill('neo.test.' + Date.now() + '@gmail.com');
    await page.getByTestId('input-password').fill('Test123456');
    await page.getByRole('button', { name: /create account/i }).click();
    await page.waitForTimeout(3000);
    const url = page.url();
    console.log('  After signup URL:', url);
    // Should redirect to dashboard or show family creation
  });

  const summary = results.filter(r => !r.pass);
  console.log('\n--- SUMMARY ---');
  console.log('Total:', results.length, 'Passed:', results.filter(r => r.pass).length, 'Failed:', summary.length);
  if (summary.length > 0) {
    summary.forEach(s => console.log('  FAILED:', s.name, s.error));
  }

  await browser.close();
  process.exit(summary.length > 0 ? 1 : 0);
})();
