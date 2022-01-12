import { IFRAME_SELECTOR } from '../../support/constants';

describe('useHtmlReader configuration settings', () => {
  it('should have no injectables by default', () => {
    cy.loadPage('/html/test/no-injectables');
    cy.getIframeHead(IFRAME_SELECTOR)
      .find('link[href$="/fonts/opensyslexic/opendyslexic.css"]')
      .should('not.exist');
    cy.getIframeHead(IFRAME_SELECTOR)
      .find('link[href$="/css/sample.css"]')
      .should('not.exist');
  });

  it('should render css injectables when provided', () => {
    cy.loadPage('/html/test/with-injectables');
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
