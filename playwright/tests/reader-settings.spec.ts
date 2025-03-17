import { test, expect } from '@playwright/test';
import { WebReaderPage } from '../pageobjects/web-reader.page.ts';

test('Open and close reader settings in HTML pub', async ({ page }) => {
  const webReaderPage = new WebReaderPage(page);
  await page.goto('https://nypl-web-reader.vercel.app/html/moby-epub3'); // temporary
  await webReaderPage.settingsButton.click();
  await expect(webReaderPage.defaultFont).toBeVisible();
  await webReaderPage.settingsButton.click();
  await expect(webReaderPage.defaultFont).not.toBeVisible();
});

test('Open and close reader settings in PDF pub', async ({ page }) => {
  const webReaderPage = new WebReaderPage(page);
  await page.goto('https://nypl-web-reader.vercel.app/pdf/collection'); // times out on localhost
  await webReaderPage.settingsButton.click();
  await expect(webReaderPage.zoomInButton).toBeVisible();
  await webReaderPage.settingsButton.click();
  await expect(webReaderPage.zoomInButton).not.toBeVisible();
});

test('Reader settings is visible in HTML pub', async ({ page }) => {
  const webReaderPage = new WebReaderPage(page);
  await page.goto('https://nypl-web-reader.vercel.app/html/moby-epub3'); // temporary
  await expect(webReaderPage.fullScreenButton).toBeVisible();
  await webReaderPage.settingsButton.click();
  await expect(webReaderPage.defaultFont).toBeVisible();
  await expect(webReaderPage.serifFont).toBeVisible();
  await expect(webReaderPage.sansSerifFont).toBeVisible();
  await expect(webReaderPage.dyslexiaFont).toBeVisible();
  await expect(webReaderPage.whiteBackground).toBeVisible();
  await expect(webReaderPage.sepiaBackground).toBeVisible();
  await expect(webReaderPage.blackBackground).toBeVisible();
  await expect(webReaderPage.resetTextSize).toBeVisible();
  await expect(webReaderPage.decreaseTextSize).toBeVisible();
  await expect(webReaderPage.increaseTextSize).toBeVisible();
  await expect(webReaderPage.paginatedStyle).toBeVisible();
  await expect(webReaderPage.scrollingStyle).toBeVisible();
});

test('Reader settings is visible in PDF pub', async ({ page }) => {
  const webReaderPage = new WebReaderPage(page);
  await page.goto('https://nypl-web-reader.vercel.app/pdf/collection'); // times out on localhost
  await expect(webReaderPage.fullScreenButton).toBeVisible();
  await webReaderPage.settingsButton.click();
  await expect(webReaderPage.zoomInButton).toBeVisible();
  await expect(webReaderPage.zoomOutButton).toBeVisible();
  await expect(webReaderPage.paginatedStyle).toBeVisible();
  await expect(webReaderPage.scrollingStyle).toBeVisible();
});
