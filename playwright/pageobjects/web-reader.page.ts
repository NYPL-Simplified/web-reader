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
  readonly previousPageButton: Locator;
  readonly nextPageButton: Locator;
  readonly firstChapter: Locator;
  readonly lastChapter: Locator;

  constructor(page: Page) {
    this.page = page;

    // header
    this.backButton = page.getByLabel('Return to Homepage');
    this.tocButton = page.getByLabel('Table of Contents');
    this.firstChapter = page.getByRole('menuitem').first();
    this.lastChapter = page.getByRole('menuitem').last();
    this.settingsButton = page.getByRole('button', {
      name: 'Settings',
      exact: true,
    });
    this.fullScreenButton = page.getByRole('button', { name: 'Full screen' });

    // reader settings
    this.zoomInButton = page.getByLabel('Zoom In');
    this.zoomOutButton = page.getByLabel('Zoom Out');

    this.defaultFont = page.getByRole('radio', { name: 'Default' });
    this.serifFont = page.getByRole('radio', { name: 'Serif', exact: true });
    this.sansSerifFont = page.getByRole('radio', { name: 'Sans-Serif' });
    this.dyslexiaFont = page.getByRole('radio', { name: 'Dyslexia' });

    this.whiteBackground = page.getByRole('radio', { name: 'Day' });
    this.sepiaBackground = page.getByRole('radio', { name: 'Sepia' });
    this.blackBackground = page.getByRole('radio', { name: 'Night' });

    this.resetTextSize = page.getByLabel('Reset settings');
    this.decreaseTextSize = page.getByLabel('Decrease font size');
    this.increaseTextSize = page.getByLabel('Increase font size');

    this.paginatedStyle = page.getByRole('radio', { name: 'Paginated' });
    this.scrollingStyle = page.getByRole('radio', { name: 'Scrolling' });

    // footer
    this.previousPageButton = page.getByLabel('Previous Page');
    this.nextPageButton = page.getByLabel('Next Page');
  }
}

export { WebReaderPage };
