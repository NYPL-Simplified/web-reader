describe('Single PDF navigation', () => {
  beforeEach(() => {
    cy.loadPdf('/pdf');
  });

  // TODO: Add this test after pulling in changes from Crystal's TOC pr
  //   it('should update page content after clicking on TOC link', () => {
  //   });

  it('should navigate forward and backwards with page buttons', () => {
    cy.findByText('Julius H. Schoeps').should('be.visible');
    cy.findByText('European-Jewish Studies').should('not.exist');
    cy.findByRole('button', { name: 'Next Page' }).click();
    cy.findByText('European-Jewish Studies').should('be.visible');
    cy.findByRole('button', { name: 'Previous Page' }).click();
    cy.findByText('Julius H. Schoeps').should('be.visible');
  });

  it('should switch to scrolling mode', () => {
    cy.findByText('Julius H. Schoeps').should('be.visible');
    cy.findByRole('button', { name: 'Settings' }).click();
    cy.findByText('Scrolling').click();
    cy.wait(5000);
    cy.get('div[data-page-number="5"]')
      .findByText('Immanuel Kant')
      .should('exist');
  });
});
