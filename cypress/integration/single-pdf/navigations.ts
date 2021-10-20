describe('Single PDF navigation', () => {
  beforeEach(() => {
    cy.loadPdf('/pdf');
  });

  // TODO: Add this test after pulling in changes from Crystal's TOC pr
  //   it('should update page content after clicking on TOC link', () => {
  //   });

  it('should navigate forward and backwards with page buttons', () => {
    cy.findByText('Assessing climate change').should('be.visible');

    // The second page of the PDF is blank
    cy.findByRole('button', { name: 'Next Page' }).click();
    cy.findByText('Assessing climate change').should('not.exist');

    cy.findByRole('button', { name: 'Previous Page' }).click();
    cy.findByText('Assessing climate change').should('be.visible');
  });

  it('should switch to scrolling mode', () => {
    cy.findByText('Assessing climate change').should('be.visible');
    cy.findByRole('button', { name: 'Settings' }).click();
    cy.findByText('Scrolling').click();
    cy.wait(5000);
    cy.get('div[data-page-number="4"]')
      .findByText(
        'Matteo Ferrazzi, Fotios Kalantzis and Sanne Zwart (European Investment Bank)'
      )
      .should('exist');
  });
});
