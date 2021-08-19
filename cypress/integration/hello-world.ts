describe('Hello world', () => {
  it('Renders content on the streamed epub page', () => {
    cy.visit('/streamed-epub');
    cy.findByRole('link', { name: 'Return to NYPL' }).should('exist');
  });
});
