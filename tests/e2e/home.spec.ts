import { test, expect } from '@playwright/test';

test('home page loads with ONE Health branding', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('h1')).toContainText('ONE Health');
});
