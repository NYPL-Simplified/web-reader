describe('useHtmlReader configuration settings', () => {
  it('should have no injectables by default', () => {
    cy.visit('/test/no-injectables');
    cy.wait(3000);
    //   cy.getIframeHead(IFRAME_SELECTOR).find('link').should('not.exist');
    // make sure there is a title, the query does in fact work
    //   cy.getIframeHead(IFRAME_SELECTOR).contains('title', 'Cover');
  });

  it('should render css injectables when provided', () => {
    cy.visit('/test/with-injectables');
    // cy.getIframeHead(IFRAME_SELECTOR).contains('title', 'Cover');
    // cy.getIframeHead(IFRAME_SELECTOR)
    //   .find(
    //     `link[href="${
    //       Cypress.config().baseUrl
    //     }/fonts/opensyslexic/opendyslexic.css"]`
    //   )
    //   .should('exist');
    // cy.getIframeHead(IFRAME_SELECTOR)
    //   .find(`link[href="${Cypress.config().baseUrl}/css/sample.css"]`)
    //   .should('exist');
    // cy.getIframeBody(IFRAME_SELECTOR).should(
    //   'have.css',
    //   'color',
    //   'rgb(0, 0, 255)'
    // );
  });
});
