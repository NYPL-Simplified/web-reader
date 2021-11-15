describe('Page button on Multiple PDF page', () => {
  beforeEach(() => {
    cy.loadPdf('/pdf-collection');
  });

  it('Should enable next button at the start of the book', () => {
    cy.findByRole('button', { name: 'Next Page' }).should('not.be.disabled');
    cy.findByRole('button', { name: 'Previous Page' }).should('be.disabled');

    cy.log('Change to Scroll mode');
    cy.findByRole('button', { name: 'Settings' }).click();
    cy.findByText('Scrolling').click();

    cy.findByRole('button', { name: 'Next Page' }).should('not.be.disabled');
    cy.findByRole('button', { name: 'Previous Page' }).should('be.disabled');
  });

  it('Should hide or show when moving back and forward between pages', () => {
    cy.findByRole('button', { name: 'Next Page' }).click();

    cy.findByRole('button', { name: 'Next Page' }).should('not.be.disabled');
    cy.findByRole('button', { name: 'Previous Page' }).should(
      'not.be.disabled'
    );

    cy.findByRole('button', { name: 'Previous Page' }).click();

    cy.findByRole('button', { name: 'Next Page' }).should('not.be.disabled');
    cy.findByRole('button', { name: 'Previous Page' }).should('be.disabled');
  });

  it('Should disable next page button at the end of the page', () => {
    cy.findByRole('button', { name: 'Settings' }).click();
    cy.findByRole('button', { name: 'Table of Contents' }).click();
    cy.findByRole('menuitem', { name: 'Index' }).click();

    cy.wait('@pdf');
    cy.wait(1000);

    // FIXME: Find a smaller PDF or a better way to simulate 10 clicks
    let clicks = 10;
    while (clicks-- > 0) {
      cy.findByRole('button', { name: 'Next Page' }).click();
    }

    cy.wait(1000);

    cy.findByRole('button', { name: 'Next Page' }).should('be.disabled');
    cy.findByRole('button', { name: 'Previous Page' }).should(
      'not.be.disabled'
    );

    cy.log('Shows next page');
    cy.findByRole('button', { name: 'Previous Page' }).click();
    cy.findByRole('button', { name: 'Next Page' }).should('not.be.disabled');
    cy.findByRole('button', { name: 'Previous Page' }).should(
      'not.be.disabled'
    );
  });
});
