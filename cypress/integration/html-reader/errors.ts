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

  it('throws error for unparsable manifest', () => {
    /* 
      we use visit here instead of 'loadPage' because 'loadPage'
      checks for an iframe that should fail to render in this test 
    */
    cy.visit('/test/unparsable-manifest');

    cy.findByRole('heading', { name: 'An error occurred' });
    cy.findByRole('alert', {
      name: `Network Error: Unparsable JSON file found at ${
        Cypress.config().baseUrl
      }/samples/test/unparsable-manifest.json.`,
    });
  });

  // @TODO - Improve this error UX. Requires change in R2D2BC.
  it('throws error for missing resource', () => {
    cy.loadPage('/test/missing-resource');

    cy.getIframeBody().contains('Page not found.', { timeout: 10000 });
  });

  it('throws error for missing injectable', () => {
    cy.visit('/test/missing-injectable');

    cy.findByRole('heading', { name: 'An error occurred' });
    cy.findByRole('alert', {
      name: `Injectable failed to load at: http://example.com/doesnt-exist.css`,
    });
  });
});
