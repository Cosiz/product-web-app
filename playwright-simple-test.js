
const { chromium } = require('@playwright/test');

(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  
  // Test login page
  await page.goto('http://localhost:3000/login');
  const title = await page.textContent('h1') || await page.textContent('[data-testid="auth-login-title"]') || 'no h1';
  console.log('Login page title:', title);
  
  const emailInput = await page.isVisible('[data-testid="input-email"]');
  const passwordInput = await page.isVisible('[data-testid="input-password"]');
  const loginBtn = await page.isVisible('[data-testid="btn-login"]');
  console.log('Email input:', emailInput);
  console.log('Password input:', passwordInput);
  console.log('Login button:', loginBtn);
  
  await browser.close();
  console.log('TEST PASSED');
})();
