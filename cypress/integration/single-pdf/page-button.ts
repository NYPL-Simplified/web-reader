describe('Pagebutton on single PDF page', () => {
  beforeEach(() => {
    cy.loadPdf('/pdf');
  });

  it('Should disable page buttons on scrolling mode', () => {
    cy.findByRole('button', { name: 'Next Page' }).should('not.be.disabled');
    cy.findByRole('button', { name: 'Previous Page' }).should('be.disabled');

    cy.findByRole('button', { name: 'Settings' }).click();
    cy.findByText('Scrolling').click();

    cy.findByRole('button', { name: 'Next Page' }).should('be.disabled');
    cy.findByRole('button', { name: 'Previous Page' }).should('be.disabled');
  });

  it('Should trigger page button state when moving back and forward between pages on paginated mode', () => {
    cy.findByRole('button', { name: 'Next Page' }).click();

    cy.findByRole('button', { name: 'Next Page' }).should('not.be.disabled');
    cy.findByRole('button', { name: 'Previous Page' }).should(
      'not.be.disabled'
    );

    cy.findByRole('button', { name: 'Previous Page' }).click();

    cy.findByRole('button', { name: 'Next Page' }).should('not.be.disabled');
    cy.findByRole('button', { name: 'Previous Page' }).should('be.disabled');
  });
});
