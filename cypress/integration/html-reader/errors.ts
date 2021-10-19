describe('error states', () => {
  beforeEach(() => {
    /**
     * React re-throws caught exceptions in dev so that they appear in the
     * console, but this makes cypress think it was uncaught, so we have to
     * turn this off
     */
    cy.on('uncaught:exception', (err, runnable) => {
      // returning false here prevents Cypress from
      // failing the test
      return false;
    });
  });

  it('throws error for unparseable manifest', () => {
    cy.loadPage('/test/unparseable-manifest');

    cy.findByRole('heading', { name: 'An error occurred' });
    cy.findByRole('alert', {
      name: `Network Error: Unparseable JSON file found at ${
        Cypress.config().baseUrl
      }/samples/test/unparseable-manifest.json.`,
    });
  });

  // @TODO - Improve this error UX. Requires change in R2D2BC.
  it('throws error for missing resource', () => {
    cy.loadPage('/test/missing-resource');

    cy.getIframeBody().contains('Page not found.', { timeout: 10000 });
  });

  // @TODO - this requires change in R2D2BC.
  // it('throws error for missing injectable', () => {});
});
