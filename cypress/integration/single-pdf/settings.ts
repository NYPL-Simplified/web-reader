describe('Single PDF display settings', () => {
  beforeEach(() => {
    cy.loadPdf('/pdf');
    cy.log('open the settings menu');
    cy.findByRole('button', { name: 'Settings' }).click();
  });

  it('should have the default settings', () => {
    cy.findByRole('radio', { name: 'Paginated' }).should('be.checked');
    cy.findByRole('radio', { name: 'Scrolling' }).should('not.be.checked');
  });

  it('should not have font or theme display settings', () => {
    cy.findByRole('radiogroup', { name: 'text font options' }).should(
      'not.exist'
    );
    cy.findByRole('radiogroup', { name: 'reading theme options' }).should(
      'not.exist'
    );
    cy.findByRole('button', { name: 'Decrease font size' }).should('not.exist');
    cy.findByRole('button', { name: 'Increase font size' }).should('not.exist');
  });

  it.only('should zoom in and out', () => {
    cy.findByText('Assessing climate change')
      .should('be.visible')
      .should('have.css', 'font-size', '25.4428px');

    cy.findByRole('button', { name: 'Zoom In' }).click();
    cy.findByText('Assessing climate change').should(
      'have.css',
      'font-size',
      '27.987px'
    );

    cy.findByRole('button', { name: 'Zoom Out' }).click();
    cy.findByText('Assessing climate change').should(
      'have.css',
      'font-size',
      '8.9176px'
    );
  });
});
