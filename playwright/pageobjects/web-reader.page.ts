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
  readonly exitFullScreenButton: Locator;
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
    this.fullScreenButton = page.getByText('Full screen', { exact: true });
    this.exitFullScreenButton = page.getByText('Full screen exit', {
      exact: true,
    });

    // reader settings
    this.zoomInButton = page.getByLabel('Zoom In');
    this.zoomOutButton = page.getByLabel('Zoom Out');

    this.defaultFont = page.getByText('Default', { exact: true });
    this.serifFont = page.getByText('Serif', { exact: true });
    this.sansSerifFont = page.getByText('Sans-Serif', { exact: true });
    this.dyslexiaFont = page.getByText('Dyslexia', { exact: true });

    this.whiteBackground = page.getByText('Day', { exact: true });
    this.sepiaBackground = page.getByText('Sepia', { exact: true });
    this.blackBackground = page.getByText('Night', { exact: true });

    this.resetTextSize = page.getByLabel('Reset settings');
    this.decreaseTextSize = page.getByLabel('Decrease font size');
    this.increaseTextSize = page.getByLabel('Increase font size');

    this.paginatedStyle = page.getByText('Paginated', { exact: true });
    this.scrollingStyle = page.getByText('Scrolling', { exact: true });

    // footer
    this.previousPageButton = page.getByLabel('Previous Page');
    this.nextPageButton = page.getByLabel('Next Page');
  }

  // hopefully better handles slow load time (use load or networkidle)
  async loadPage(gotoPage: string) {
    await this.page.goto(gotoPage, { waitUntil: 'load' });
    return this;
  }

  async getTextSize() {
    const htmlElement = this.page.frameLocator('#mainContent').locator('html');
    htmlElement.evaluate((el) => {
      return window.getComputedStyle(el).getPropertyValue('--USER__fontSize');
    });
  }

  // pulled from cypress tests so needs reworking
  // async pdfZoomTestHelper() {
  //   const pdfZoomTestHelper = (
  //     $elm: JQuery<HTMLElement>,
  //     expectedValueX: string,
  //     expectedValueY: string
  //   ): void => {
  //     this.page.window().then((win) => {
  //       const styles = win.getComputedStyle($elm[0]);
  //       const scaleX = styles.getPropertyValue('--chakra-scale-x');
  //       const scaleY = styles.getPropertyValue('--chakra-scale-y');
  //       expect(scaleX).to.eq(expectedValueX);
  //       expect(scaleY).to.eq(expectedValueY);
  //     });
  //   };
  // };
}

export { WebReaderPage };
