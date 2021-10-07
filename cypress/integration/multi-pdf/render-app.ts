describe('Renders multi PDF', () => {
  it('Renders page content', () => {
    cy.loadPdf('/pdf-collection');

    cy.log('check that all the essential buttons are on the page');
    cy.findByRole('link', { name: 'Return to Homepage' }).should('exist');
    cy.findByRole('button', { name: 'Table of Contents' }).should('exist');
    cy.findByRole('button', { name: 'Settings' }).should('exist');
    cy.findByRole('button', { name: 'Toggle Fullscreen' }).should('exist');
    cy.findByRole('button', { name: 'Next Page' }).should('exist');
    cy.findByRole('button', { name: 'Previous Page' }).should('exist');

    cy.findByText('Anthropology without Informants').should('be.visible');
  });
});
