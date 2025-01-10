import { test, expect } from '@playwright/test';

test('User can send a message', async ({ page }) => {
  await page.goto('http://localhost:3000');
  
  // Set username
  await page.fill('input[aria-label="Enter your username"]', 'TestUser');
  await page.click('button:has-text("Join")');

  // Type and send a message
  await page.fill('input[aria-label="Type a message"]', 'Hello from Playwright!');
  await page.click('button[aria-label="Send message"]');

  // Assert message appears
  await expect(page.locator('text=Hello from Playwright!')).toBeVisible();
});
