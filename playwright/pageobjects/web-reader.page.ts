import { Locator, Page } from '@playwright/test';

class WebReaderPage {
  readonly page: Page;
  readonly backButton: Locator;
  readonly tocButton: Locator;
  readonly settingsButton: Locator;
  readonly defaultFont: Locator;
  readonly serifFont: Locator;
  readonly sansSerifFont: Locator;
  readonly dyslexiaFont: Locator;
  readonly whiteBackground: Locator;
  readonly sepiaBackground: Locator;
  readonly blackBackground: Locator;
  readonly resetTextSize: Locator;
  readonly decreaseTextSize: Locator;
  readonly increaseTextSize: Locator;
  readonly zoomInButton: Locator;
  readonly zoomOutButton: Locator;
  readonly paginatedStyle: Locator;
  readonly scrollingStyle: Locator;
  readonly fullScreenButton: Locator;
  readonly previousPage: Locator;
  readonly nextPage: Locator;

  constructor(page: Page) {
    this.page = page;

    // header
    this.backButton = page.getByLabel('Return to Homepage');
    this.tocButton = page.getByLabel('');
    this.settingsButton = page.getByRole('button', {
      name: 'Settings',
      exact: true,
    });
    this.fullScreenButton = page.getByLabel('');

    // reader settings
    this.zoomInButton = page.getByLabel('Zoom In');
    this.zoomOutButton = page.getByLabel('Zoom Out');

    this.defaultFont = page.getByRole('radio', { name: 'Default' });
    this.serifFont = page.getByLabel('Serif');
    this.sansSerifFont = page.getByLabel('Sans-Serif');
    this.dyslexiaFont = page.getByLabel('Dyslexia');

    this.whiteBackground = page.getByLabel('');
    this.sepiaBackground = page.getByLabel('');
    this.blackBackground = page.getByLabel('');

    this.resetTextSize = page.getByLabel('');
    this.decreaseTextSize = page.getByLabel('');
    this.increaseTextSize = page.getByLabel('');

    this.paginatedStyle = page.getByLabel('');
    this.scrollingStyle = page.getByLabel('');

    // iframe

    // footer
    this.previousPage = page.getByLabel('Previous Page');
    this.nextPage = page.getByLabel('Next Page');
  }
}

export { WebReaderPage };
