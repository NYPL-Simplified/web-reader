import { test, expect } from '@playwright/test';
import { WebReaderPage } from '../pageobjects/web-reader.page.ts';

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

test('Confirm reader settings is visible in PDF pub', async ({ page }) => {
  const webReaderPage = new WebReaderPage(page);
  await page.goto(
    'https://nypl-web-reader.vercel.app/pdf/single-resource-short'
  ); // times out on localhost
  await expect(webReaderPage.fullScreenButton).toBeVisible(); // failing on webkit
  await webReaderPage.settingsButton.click();
  await expect(webReaderPage.zoomInButton).toBeVisible();
  await expect(webReaderPage.zoomOutButton).toBeVisible();
  await expect(webReaderPage.paginatedStyle).toBeVisible();
  await expect(webReaderPage.scrollingStyle).toBeVisible();
});
