import { IFRAME_SELECTOR } from '../../support/constants';

describe('useHtmlReader configuration settings', () => {
  it('should have no injectables by default', () => {
    cy.loadPage('/test/no-injectables');

    cy.get('#reader-loading').should('be.visible');
    cy.get('#reader-loading').should('not.be.visible');

    cy.getIframeHead(IFRAME_SELECTOR).find('link').should('not.exist');
    cy.getIframeHead(IFRAME_SELECTOR).contains('title', 'Cover');
  });

  it('should render css injectables when provided', () => {
    cy.loadPage('/test/with-injectables');

    cy.get('#reader-loading').should('be.visible');
    cy.get('#reader-loading').should('not.be.visible');

    cy.getIframeHead(IFRAME_SELECTOR).contains('title', 'Cover');
    cy.getIframeHead(IFRAME_SELECTOR)
      .find(`link[href$="/fonts/opensyslexic/opendyslexic.css"]`)
      .should('exist');
    cy.getIframeHead(IFRAME_SELECTOR)
      .find(`link[href$="/css/sample.css"]`)
      .should('exist');
    cy.getIframeBody(IFRAME_SELECTOR).should(
      'have.css',
      'color',
      'rgb(0, 0, 255)'
    );
  });
});
