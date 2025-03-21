import { test, expect } from '@playwright/test';
import { PdfReaderPage } from '../pageobjects/web-reader.page.ts';

test.describe('Test PDF pub', () => {
  test('Confirm reader settings are visible', async ({ page }) => {
    const pdfReaderPage = new PdfReaderPage(page);
    await pdfReaderPage.loadPage(
      'https://nypl-web-reader.vercel.app/pdf/collection'
    ); // temporary
    await expect(pdfReaderPage.fullScreenButton).toBeVisible();
    await pdfReaderPage.settingsButton.click();
    await expect(pdfReaderPage.zoomInButton).toBeVisible();
    await expect(pdfReaderPage.zoomOutButton).toBeVisible();
    await expect(pdfReaderPage.paginatedStyle).toBeVisible();
    await expect(pdfReaderPage.scrollingStyle).toBeVisible();
  });

  test('Open and close reader settings', async ({ page }) => {
    const pdfReaderPage = new PdfReaderPage(page);
    await pdfReaderPage.loadPage(
      'https://nypl-web-reader.vercel.app/pdf/collection'
    ); // temporary
    await pdfReaderPage.settingsButton.click();
    await expect(pdfReaderPage.zoomInButton).toBeVisible();
    await pdfReaderPage.settingsButton.click();
    await expect(pdfReaderPage.zoomInButton).not.toBeVisible();
  });

  test('Displays default settings', async ({ page }) => {
    const pdfReaderPage = new PdfReaderPage(page);
    await pdfReaderPage.loadPage(
      'https://nypl-web-reader.vercel.app/pdf/collection'
    ); // temporary
    await pdfReaderPage.settingsButton.click();
    await expect(pdfReaderPage.paginatedStyle).toBeChecked();
  });

  test('Change pagination style', async ({ page }) => {
    const pdfReaderPage = new PdfReaderPage(page);
    await pdfReaderPage.loadPage(
      'https://nypl-web-reader.vercel.app/pdf/collection'
    ); // temporary
    await pdfReaderPage.settingsButton.click();
    await pdfReaderPage.scrollingStyle.click();
    await expect(pdfReaderPage.scrollingStyle).toBeChecked();
    await pdfReaderPage.scrollDown();
    await pdfReaderPage.scrollUp();
    await pdfReaderPage.paginatedStyle.click();
    await expect(pdfReaderPage.paginatedStyle).toBeChecked();
  });

  test('Zoom in', async ({ page }) => {
    const pdfReaderPage = new PdfReaderPage(page);
    await pdfReaderPage.loadPage(
      'https://nypl-web-reader.vercel.app/pdf/collection'
    ); // temporary
    await expect(await pdfReaderPage.zoomIn()).toBeTruthy;
  });

  test('Zoom out', async ({ page }) => {
    const pdfReaderPage = new PdfReaderPage(page);
    await pdfReaderPage.loadPage(
      'https://nypl-web-reader.vercel.app/pdf/collection'
    ); // temporary
    await expect(await pdfReaderPage.zoomOut()).toBeTruthy;
  });

  test('Open and exit full screen', async ({ page }) => {
    const pdfReaderPage = new PdfReaderPage(page);
    await pdfReaderPage.loadPage(
      'https://nypl-web-reader.vercel.app/pdf/collection'
    ); // temporary
    await pdfReaderPage.fullScreenButton.click();
    await pdfReaderPage.exitFullScreenButton.click();
    await expect(pdfReaderPage.fullScreenButton).toBeVisible();
  });

  test('Change settings in full screen', async ({ page }) => {
    const pdfReaderPage = new PdfReaderPage(page);
    await pdfReaderPage.loadPage(
      'https://nypl-web-reader.vercel.app/pdf/collection'
    ); // temporary
    await pdfReaderPage.fullScreenButton.click();
    await pdfReaderPage.changeSettings();
  });
});
