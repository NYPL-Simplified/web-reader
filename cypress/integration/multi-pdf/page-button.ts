describe('Page button on Multiple PDF page', () => {
  beforeEach(() => {
    cy.loadPdf('/pdf-collection');
  });

  it('Should show next button at the start of the book', () => {
    cy.findByRole('button', { name: 'Next Page' }).should('exist');
    cy.findByRole('button', { name: 'Previous Page' }).should('not.exist');

    cy.log('Change to Scroll mode');
    cy.findByRole('button', { name: 'Settings' }).click();
    cy.findByText('Scrolling').click();

    cy.findByRole('button', { name: 'Next Page' }).should('exist');
    cy.findByRole('button', { name: 'Previous Page' }).should('not.exist');
  });

  it('Should hide or show when moving back and forward between pages', () => {
    cy.findByRole('button', { name: 'Next Page' }).click();

    cy.findByRole('button', { name: 'Next Page' }).should('exist');
    cy.findByRole('button', { name: 'Previous Page' }).should('exist');

    cy.findByRole('button', { name: 'Previous Page' }).click();

    cy.findByRole('button', { name: 'Next Page' }).should('exist');
    cy.findByRole('button', { name: 'Previous Page' }).should('not.exist');
  });

  it('Should hide next page button at the end of the page', () => {
    cy.findByRole('button', { name: 'Settings' }).click();
    cy.findByRole('button', { name: 'Table of Contents' }).click();
    cy.findByRole('menuitem', { name: 'Index' }).click();

    cy.wait('@pdf');

    // FIXME: Find a smaller PDF or a better way to simulate 10 clicks
    let clicks = 10;
    while (clicks-- >= 0) {
      cy.findByRole('button', { name: 'Next Page' }).click();
    }

    cy.findByRole('button', { name: 'Next Page' }).should('not.exist');
    cy.findByRole('button', { name: 'Previous Page' }).should('exist');

    cy.log('Shows next page');
    cy.findByRole('button', { name: 'Previous Page' }).click();
    cy.findByRole('button', { name: 'Next Page' }).should('exist');
    cy.findByRole('button', { name: 'Previous Page' }).should('exist');
  });
});
