describe('Renders single PDF', () => {
  it('Render page content', () => {
    cy.loadPdf('/pdf');

    cy.log('check that all the essential buttons are on the page');
    cy.findByRole('link', { name: 'Return to Homepage' }).should('exist');
    cy.findByRole('button', { name: 'Table of Contents' }).should('exist');
    cy.findByRole('button', { name: 'Settings' }).should('exist');
    cy.findByRole('button', { name: 'Toggle Fullscreen' }).should('exist');
    cy.findByRole('button', { name: 'Next Page' }).should('exist');
    cy.findByRole('button', { name: 'Previous Page' }).should('not.exist');

    cy.findByText('Assessing climate change').should('be.visible');
  });
});
