describe('Single PDF navigation', () => {
  beforeEach(() => {
    cy.loadPdf('/pdf/single-resource-short');
  });

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
    cy.get('div[data-page-number="4"]').scrollIntoView();
    cy.findByText(
      'Matteo Ferrazzi, Fotios Kalantzis and Sanne Zwart (European Investment Bank)'
    ).should('exist');
  });

  it('Paginated mode & TOC: should update page content after clicking on TOC link', () => {
    cy.findByRole('button', { name: 'Settings' }).click();
    cy.findByRole('radio', { name: 'Paginated' }).should('be.checked');
    cy.findByRole('radio', { name: 'Scrolling' }).should('not.be.checked');

    cy.log('open TOC menu');
    cy.wait(3000);
    cy.findByRole('button', { name: 'Table of Contents' }).click();

    cy.log('open chapter 2');
    cy.findByRole('menuitem', {
      name: '2 Climate risk at the country level',
    }).click();

    cy.findByText(
      'Figure 1: Overview of risks stemming from climate change'
    ).should('exist');
  });

  it('Scrolling mode & TOC: should update page content after clicking on TOC link', () => {
    cy.findByRole('button', { name: 'Settings' }).click();
    cy.findByText('Scrolling').click();
    cy.findByRole('radio', { name: 'Paginated' }).should('not.be.checked');
    cy.findByRole('radio', { name: 'Scrolling' }).should('be.checked');

    cy.log('open TOC menu');
    cy.wait(3000);
    cy.findByRole('button', { name: 'Table of Contents' }).click();

    cy.log('open chapter 2');
    cy.findByRole('menuitem', {
      name: '2 Climate risk at the country level',
    }).click();

    cy.findByText(
      'Figure 1: Overview of risks stemming from climate change'
    ).should('exist');
  });
});
