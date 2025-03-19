import { test, expect } from '@playwright/test';
import { WebReaderPage } from '../pageobjects/web-reader.page.ts';

test.describe('Test HTML pub', () => {
  test.beforeEach(async ({ page }) => {
    // goto
  });

  test('Confirm reader settings are visible', async ({ page }) => {
    const webReaderPage = new WebReaderPage(page);
    await webReaderPage.loadPage(
      'https://nypl-web-reader.vercel.app/html/moby-epub3'
    ); // temporary
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
    await expect(webReaderPage.zoomInButton).not.toBeVisible();
  });

  test('Open and close reader settings', async ({ page }) => {
    const webReaderPage = new WebReaderPage(page);
    await webReaderPage.loadPage(
      'https://nypl-web-reader.vercel.app/html/moby-epub3'
    ); // temporary
    await webReaderPage.settingsButton.click();
    await expect(webReaderPage.defaultFont).toBeVisible();
    await webReaderPage.settingsButton.click();
    await expect(webReaderPage.defaultFont).not.toBeVisible();
  });

  test('Displays default settings', async ({ page }) => {
    const webReaderPage = new WebReaderPage(page);
    await webReaderPage.loadPage(
      'https://nypl-web-reader.vercel.app/html/moby-epub3'
    ); // temporary
    await webReaderPage.settingsButton.click();
    await expect(webReaderPage.defaultFont).toBeChecked();
    await expect(webReaderPage.whiteBackground).toBeChecked();
    //await expect(webReaderPage.getTextSize).toBe('100%'); // expect --USER__fontSize: 100%
    await expect(webReaderPage.paginatedStyle).toBeChecked();
  });

  test('Change font', async ({ page }) => {
    const webReaderPage = new WebReaderPage(page);
    await webReaderPage.loadPage(
      'https://nypl-web-reader.vercel.app/html/moby-epub3'
    ); // temporary
    await webReaderPage.settingsButton.click();
    await webReaderPage.serifFont.click();
    await expect(webReaderPage.serifFont).toBeChecked();
    await webReaderPage.sansSerifFont.click();
    await expect(webReaderPage.sansSerifFont).toBeChecked();
    await webReaderPage.dyslexiaFont.click();
    await expect(webReaderPage.dyslexiaFont).toBeChecked();
    await webReaderPage.defaultFont.click();
    await expect(webReaderPage.defaultFont).toBeChecked();
  });

  test('Change background color', async ({ page }) => {
    const webReaderPage = new WebReaderPage(page);
    await webReaderPage.loadPage(
      'https://nypl-web-reader.vercel.app/html/moby-epub3'
    ); // temporary
    await webReaderPage.settingsButton.click();
    await webReaderPage.sepiaBackground.click();
    await expect(webReaderPage.sepiaBackground).toBeChecked();
    await webReaderPage.blackBackground.click();
    await expect(webReaderPage.blackBackground).toBeChecked();
    await webReaderPage.whiteBackground.click();
    await expect(webReaderPage.whiteBackground).toBeChecked();
  });

  test('Change text size', async ({ page }) => {
    const webReaderPage = new WebReaderPage(page);
    await webReaderPage.loadPage(
      'https://nypl-web-reader.vercel.app/html/moby-epub3'
    ); // temporary
    await webReaderPage.settingsButton.click();
    await webReaderPage.decreaseTextSize.click();
    //await expect(webReaderPage.getTextSize).toBe('96%'); // fix
    await webReaderPage.resetTextSize.click();
    await webReaderPage.increaseTextSize.click();
    //await expect(webReaderPage.getTextSize).toBe('104%'); // fix
  });

  test('Change pagination style', async ({ page }) => {
    const webReaderPage = new WebReaderPage(page);
    await webReaderPage.loadPage(
      'https://nypl-web-reader.vercel.app/html/moby-epub3'
    ); // temporary
    await webReaderPage.settingsButton.click();
    await webReaderPage.scrollingStyle.click();
    await expect(webReaderPage.scrollingStyle).toBeChecked();
    await webReaderPage.scrollDown();
    await webReaderPage.settingsButton.click();
    await webReaderPage.paginatedStyle.click();
    await expect(webReaderPage.paginatedStyle).toBeChecked();
  });

  // maintains changed settings when exit and reenter reader
  // reset all reader settings
  // visit pub that doesn't retain settings html/moby-epub3-no-local-storage
  // stay on same page if change pagination

  test('Open and exit full screen', async ({ page }) => {
    const webReaderPage = new WebReaderPage(page);
    await webReaderPage.loadPage(
      'https://nypl-web-reader.vercel.app/html/moby-epub3'
    ); // temporary
    await webReaderPage.fullScreenButton.click();
    await webReaderPage.exitFullScreenButton.click();
    await expect(webReaderPage.fullScreenButton).toBeVisible();
  });

  // change settings in full screen
});

test.describe('Test PDF pub', () => {
  test('Confirm reader settings are visible', async ({ page }) => {
    const webReaderPage = new WebReaderPage(page);
    await webReaderPage.loadPage(
      'https://nypl-web-reader.vercel.app/pdf/collection'
    ); // times out on localhost
    await expect(webReaderPage.fullScreenButton).toBeVisible();
    await webReaderPage.settingsButton.click();
    await expect(webReaderPage.zoomInButton).toBeVisible();
    await expect(webReaderPage.zoomOutButton).toBeVisible();
    await expect(webReaderPage.paginatedStyle).toBeVisible();
    await expect(webReaderPage.scrollingStyle).toBeVisible();
    await expect(webReaderPage.defaultFont).not.toBeVisible();
    await expect(webReaderPage.whiteBackground).not.toBeVisible();
    await expect(webReaderPage.increaseTextSize).not.toBeVisible();
  });

  test('Open and close reader settings', async ({ page }) => {
    const webReaderPage = new WebReaderPage(page);
    await webReaderPage.loadPage(
      'https://nypl-web-reader.vercel.app/pdf/collection'
    ); // times out on localhost
    await webReaderPage.settingsButton.click();
    await expect(webReaderPage.zoomInButton).toBeVisible();
    await webReaderPage.settingsButton.click();
    await expect(webReaderPage.zoomInButton).not.toBeVisible();
  });

  test('Displays default settings', async ({ page }) => {
    const webReaderPage = new WebReaderPage(page);
    await webReaderPage.loadPage(
      'https://nypl-web-reader.vercel.app/pdf/collection'
    ); // temporary
    await webReaderPage.settingsButton.click();
    //await expect(webReaderPage.pdfZoomTestHelper).toBe('%');
    await expect(webReaderPage.paginatedStyle).toBeChecked();
  });

  test('Change pagination style', async ({ page }) => {
    const webReaderPage = new WebReaderPage(page);
    await webReaderPage.loadPage(
      'https://nypl-web-reader.vercel.app/pdf/collection'
    ); // temporary
    await webReaderPage.settingsButton.click();
    await webReaderPage.scrollingStyle.click();
    await expect(webReaderPage.scrollingStyle).toBeChecked();
    await webReaderPage.scrollDown();
    await webReaderPage.paginatedStyle.click();
    await expect(webReaderPage.paginatedStyle).toBeChecked();
  });

  test('Open and exit full screen', async ({ page }) => {
    const webReaderPage = new WebReaderPage(page);
    await webReaderPage.loadPage(
      'https://nypl-web-reader.vercel.app/pdf/collection'
    ); // temporary
    await webReaderPage.fullScreenButton.click();
    await webReaderPage.exitFullScreenButton.click();
    await expect(webReaderPage.fullScreenButton).toBeVisible();
  });

  test('Zoom in and zoom out', async ({ page }) => {
    const webReaderPage = new WebReaderPage(page);
    await webReaderPage.loadPage(
      'https://nypl-web-reader.vercel.app/pdf/collection'
    ); // times out on localhost
    await webReaderPage.settingsButton.click();
    await webReaderPage.zoomInButton.click();
    //await expect(webReaderPage.pdfZoomTestHelper).toBe('%');
    await webReaderPage.zoomOutButton.click(); // resets to default
    //await expect(webReaderPage.pdfZoomTestHelper).toBe('%');
    await webReaderPage.zoomOutButton.click();
    //await expect(webReaderPage.pdfZoomTestHelper).toBe('%');
  });
});
