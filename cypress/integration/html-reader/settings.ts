import { IFRAME_SELECTOR } from '../../support/constants';

describe('display settings', () => {
  beforeEach(() => {
    cy.loadPage('/streamed-alice-epub');
  });

  it('should have the default settings', () => {
    cy.log('briefly see the loading indicator');
    cy.get('#reader-loading').should('be.visible');
    cy.get('#reader-loading').should('not.be.visible');

    cy.getIframeHtml(IFRAME_SELECTOR)
      .should('have.attr', 'data-viewer-font', 'publisher')
      .should('have.css', '--USER__appearance', 'readium-default-on')
      .should('have.css', '--USER__fontFamily', 'Original')
      .should('have.css', '--USER__scroll', 'readium-scroll-on');
  });

  it('should update the font family to serif, paginated mode, and on sepia theme', () => {
    cy.log('open the settings menu');
    cy.findByRole('button', { name: 'Settings' }).click();

    cy.findByText('Serif').click();
    cy.findByText('Paginated').click();
    cy.findByText('Sepia').click();

    cy.getIframeHtml(IFRAME_SELECTOR)
      .should('have.attr', 'data-viewer-font', 'serif')
      .should('have.css', '--USER__appearance', 'readium-sepia-on')
      .should('have.css', '--USER__scroll', 'readium-scroll-off');
  });

  it('should trigger font size setting', () => {
    cy.getIframeHtml(IFRAME_SELECTOR).should(
      'not.have.css',
      '--USER__fontSize'
    ); // by default, there's no font size set on the page

    cy.findByRole('button', { name: 'Settings' }).click();
    cy.findByRole('button', { name: 'Decrease font size' }).click();

    cy.getIframeHtml(IFRAME_SELECTOR).should(
      'have.css',
      '--USER__fontSize',
      '96%'
    ); // 4% per step?
  });
});

describe('useHtmlReader configuration settings', () => {
  it('should have no injectables by default', () => {
    cy.loadPage('/test/no-injectables');
    cy.getIframeHead(IFRAME_SELECTOR).find('link').should('not.exist');
    // make sure there is a title, the query does in fact work
    cy.getIframeHead(IFRAME_SELECTOR).find('title').should('exist');
  });

  it('should render css injectables when provided', () => {
    cy.loadPage('/test/with-injectables');

    cy.getIframeHead(IFRAME_SELECTOR).find('title').should('exist');
    cy.getIframeHead(IFRAME_SELECTOR)
      .find('link[href$="/fonts/opensyslexic/opendyslexic.css"]')
      .should('exist');
    cy.getIframeHead(IFRAME_SELECTOR)
      .find('link[href$="/css/sample.css"]')
      .should('exist');
    cy.getIframeBody(IFRAME_SELECTOR).should(
      'have.css',
      'color',
      'rgb(0, 0, 255)'
    );
  });
});
