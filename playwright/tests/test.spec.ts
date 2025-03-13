import { test, expect } from '@playwright/test';

test('Open moby-epub3', async ({ page }) => {
  await page.goto('http://localhost:1234/html/moby-epub3');
  //await expect(page.getByRole('link', { name: 'Back' })).toBeVisible(); // does not work
  //await expect(page.getByRole('paragraph', { name: 'Back' })).toBeVisible(); // does not work
  //await expect(page.getByText('Back')).toBeVisible(); // works but could be found in epub
  await expect(page.getByLabel('Return to Homepage')).toBeVisible(); // works
});
