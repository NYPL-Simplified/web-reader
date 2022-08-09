describe('useHtmlReader configuration settings', () => {
  it('should have no injectables by default', () => {
    cy.loadPage('/html/test/no-injectables');
    cy.getIframeHead()
      .find('link[href$="/fonts/opensyslexic/opendyslexic.css"]')
      .should('not.exist');
    cy.getIframeHead()
      .find('link[href$="/css/sample.css"]')
      .should('not.exist');
  });

  it('should render injectables script when provided', () => {
    cy.log('Reflowable Book with both fixed and reflowable CSS injected');
    cy.loadPage('/html/test/with-script-injectable');

    cy.getIframeHead()
      .find(`script[src$="/js/sample.js"]`, { timeout: 50000 })
      .should('exist');
  });

  it('should render reflowable injectables CSS when provided for reflowable books', () => {
    cy.log('Reflowable Book with both fixed and reflowable CSS injected');
    cy.loadPage('/html/test/with-reflowable-layout');
    cy.getIframeHead()
      .find(`link[href$="/fonts/opensyslexic/opendyslexic.css"]`, {
        timeout: 50000,
      })
      .should('exist');
    cy.getIframeHead()
      .find(`link[href$="/css/sample.css"]`, { timeout: 50000 })
      .should('exist');
    cy.getIframeBody().should('have.css', 'color', 'rgb(0, 0, 255)');
  });

  it('should not render reflowable injectables CSS for FXL books', () => {
    cy.log('FXL Book with both fixed and reflowable CSS injected');
    cy.loadPage('/html/test/with-fixed-layout');
    cy.getIframeHead()
      .find('link[href$="/fonts/opensyslexic/opendyslexic.css"]')
      .should('not.exist');
    cy.getIframeHead()
      .find('link[href$="/css/sample.css"]')
      .should('not.exist');
  });
});
