describe('Pagebutton on single PDF page', () => {
  beforeEach(() => {
    cy.loadPdf('/pdf');
  });

  it('Should hide page buttons on scrolling mode', () => {
    cy.findByRole('button', { name: 'Next Page' }).should('exist');
    cy.findByRole('button', { name: 'Previous Page' }).should('not.exist');

    cy.findByRole('button', { name: 'Settings' }).click();
    cy.findByText('Scrolling').click();

    cy.findByRole('button', { name: 'Next Page' }).should('not.exist');
    cy.findByRole('button', { name: 'Previous Page' }).should('not.exist');
  });

  it('Should trigger hide or show when moving back and forward between pages on paginated mode', () => {
    cy.findByRole('button', { name: 'Next Page' }).click();

    cy.findByRole('button', { name: 'Next Page' }).should('exist');
    cy.findByRole('button', { name: 'Previous Page' }).should('exist');

    cy.findByRole('button', { name: 'Previous Page' }).click();

    cy.findByRole('button', { name: 'Next Page' }).should('exist');
    cy.findByRole('button', { name: 'Previous Page' }).should('not.exist');
  });
});
