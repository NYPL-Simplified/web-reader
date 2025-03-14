import { test, expect } from '@playwright/test';

test('Open moby-epub3', async ({ page }) => {
  await page.goto('/html/moby-epub3');
  await expect(page.getByLabel('Return to Homepage')).toBeVisible();
});
