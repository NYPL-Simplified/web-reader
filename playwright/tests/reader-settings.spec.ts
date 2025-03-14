import { test, expect } from '@playwright/test';
import { WebReaderPage } from '../pageobjects/web-reader.page';

test('Open and close reader settings in HTML pub', async ({ page }) => {
  const webReaderPage = new WebReaderPage(page);
  await page.goto('/html/moby-epub3');
  await webReaderPage.settingsButton.click();
  await expect(webReaderPage.defaultFont).toBeVisible();
  await webReaderPage.settingsButton.click();
  await expect(webReaderPage.defaultFont).not.toBeVisible();
});

test('Open and close reader settings in PDF pub', async ({ page }) => {
  const webReaderPage = new WebReaderPage(page);
  await page.goto(
    'https://nypl-web-reader.vercel.app/pdf/single-resource-short'
  ); // times out on localhost
  await webReaderPage.settingsButton.click();
  await expect(webReaderPage.zoomInButton).toBeVisible();
  await webReaderPage.settingsButton.click();
  await expect(webReaderPage.zoomInButton).not.toBeVisible();
});
