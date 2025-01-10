import { test, expect } from '@playwright/test';

test.describe('Chatly X - E2E Test', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:3000');
  });

  // 1️⃣ User can enter a username and join
  test('User can enter a username and join', async ({ page }) => {
    await page.fill('input[placeholder="Enter your username"]', 'TestUser');
    await page.click('button:has-text("Join")');

    await expect(page.locator('aside[aria-label="Sidebar"]')).toBeVisible();
  });

  // 2️⃣ User can create a new chat room
  test('User can create a new chat room', async ({ page }) => {
    await page.fill('input[placeholder="Enter your username"]', 'RoomCreator');
    await page.click('button:has-text("Join")');

    await page.waitForSelector('img[alt="Create Room"]', { timeout: 10000 });
    await page.click('img[alt="Create Room"]');

    await page.fill('input[placeholder="Room name"]', 'New Test Room');
    await page.click('button:has-text("Create")');

    await page.waitForSelector('li[aria-label="Join New Test Room room"]', { timeout: 10000 });
    const newRoom = page.locator('li[aria-label="Join New Test Room room"]').first();
    await expect(newRoom).toBeVisible();
  });

//   // 3️⃣ User can join a chat room
//   test('User can join a chat room', async ({ page }) => {
//     await page.fill('input[placeholder="Enter your username"]', 'RoomJoiner');
//     await page.click('button:has-text("Join")');

//     // Wait for the room to appear
//     const newRoom = page.locator('li[aria-label="Join New Test Room room"]').first();
//     await newRoom.waitFor({ state: 'visible', timeout: 10000 });

//     // Click to join
//     await newRoom.click();

//     // Wait for confirmation that the room is active
//     await expect(page.getByRole('region', { name: 'Main Content' })).toContainText('New Test Room');
//   });

//   // 4️⃣ User can send a message
//   test('User can send a message', async ({ page }) => {
//     await page.fill('input[placeholder="Enter your username"]', 'MessageUser');
//     await page.click('button:has-text("Join")');

//     // Ensure WebSocket is connected
//     await page.waitForTimeout(2000);

//     // Click on "Main Chat" room
//     const mainChat = page.locator('li[aria-label="Join Main Chat room"]').first();
//     await mainChat.waitFor({ state: 'visible', timeout: 10000 });
//     await mainChat.click();

//     // Wait for input to appear
//     const messageInput = page.locator('[data-testid="message-input"]');
//     await messageInput.waitFor({ state: 'visible', timeout: 10000 });

//     // Type and send the message
//     await messageInput.fill('Hello Playwright!');
//     await page.click('[data-testid="send-button"]');

//     // Verify the message was sent
//     await expect(page.locator('.messageContent')).toContainText('Hello Playwright!');
//   });
});
