describe('Renders multi PDF', () => {
  it('Renders page content', () => {
    cy.loadPdf('/pdf/collection');

    cy.log('check that all the essential buttons are on the page');
    cy.findByRole('link', { name: 'Back' }).should('exist');
    cy.findByRole('button', { name: 'Table of Contents' }).should('exist');
    cy.findByRole('button', { name: 'Settings' }).should('exist');
    cy.findByRole('button', { name: 'Toggle full screen' }).should('exist');
    cy.findByRole('button', { name: 'Next Page' }).should('not.be.disabled');
    cy.findByRole('button', { name: 'Previous Page' }).should('be.disabled');

    cy.findByText('Anthropology without Informants').should('be.visible');
  });
});
