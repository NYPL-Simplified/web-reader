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
    this.tocButton = page.getByLabel('Table of Contents');
    this.settingsButton = page.getByRole('button', {
      name: 'Settings',
      exact: true,
    });
    this.fullScreenButton = page.getByRole('button', { name: 'Full screen' });

    // reader settings
    this.zoomInButton = page.getByLabel('Zoom In');
    this.zoomOutButton = page.getByLabel('Zoom Out');

    this.defaultFont = page.getByRole('radio', { name: 'Default' });
    this.serifFont = page.getByLabel('Serif');
    this.sansSerifFont = page.getByLabel('Sans-Serif');
    this.dyslexiaFont = page.getByLabel('Dyslexia');

    this.whiteBackground = page.getByLabel('Day');
    this.sepiaBackground = page.getByLabel('Sepia');
    this.blackBackground = page.getByLabel('Night');

    this.resetTextSize = page.getByLabel('Reset settings');
    this.decreaseTextSize = page.getByLabel('Decrease font size');
    this.increaseTextSize = page.getByLabel('Increase font size');

    this.paginatedStyle = page.getByRole('radio', { name: 'Paginated' });
    this.scrollingStyle = page.getByRole('radio', { name: 'Scrolling' });

    // footer
    this.previousPage = page.getByLabel('Previous Page');
    this.nextPage = page.getByLabel('Next Page');
  }
}

export { WebReaderPage };
