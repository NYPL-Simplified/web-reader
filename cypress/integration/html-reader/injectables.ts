describe('useHtmlReader configuration settings', () => {
  it('should have no injectables by default', () => {
    cy.loadPage('/test/no-injectables');
    cy.getIframeHead()
      .find('link[href$="/fonts/opensyslexic/opendyslexic.css"]')
      .should('not.exist');
    cy.getIframeHead()
      .find('link[href$="/css/sample.css"]')
      .should('not.exist');
  });

  it('should render css injectables when provided', () => {
    cy.loadPage('/test/with-injectables');
    cy.getIframeHead()
      .find(`link[href$="/fonts/opensyslexic/opendyslexic.css"]`)
      .should('exist');
    cy.getIframeHead().find(`link[href$="/css/sample.css"]`).should('exist');
    cy.getIframeBody().should('have.css', 'color', 'rgb(0, 0, 255)');
  });
});
