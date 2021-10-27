import { IFRAME_SELECTOR } from '../../support/constants';

describe('display settings', () => {
  beforeEach(() => {
    cy.loadPage('/streamed-alice-epub');
  });

  it('should have the default settings', () => {
    cy.get('#reader-loading').should('not.be.visible');
    // without this wait we are getting "element is detached from dom" errors
    cy.wait(3000);
    cy.getIframeHtml(IFRAME_SELECTOR)
      .should('have.attr', 'data-viewer-font', 'publisher')
      .should('have.css', '--USER__appearance', 'readium-default-on')
      .should('have.css', '--USER__fontFamily', 'Original')
      .should('have.css', '--USER__scroll', 'readium-scroll-off');
  });

  it('should update the font family to serif, scroll mode, and on sepia theme', () => {
    cy.log('open the settings menu');
    cy.findByRole('button', { name: 'Settings' }).click();

    cy.findByText('Serif').click();
    cy.findByText('Paginated').click();
    cy.findByText('Sepia').click();

    cy.getIframeHtml(IFRAME_SELECTOR)
      .should('have.attr', 'data-viewer-font', 'serif')
      .should('have.css', '--USER__appearance', 'readium-sepia-on')
      .should('have.css', '--USER__scroll', 'readium-scroll-on');
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
