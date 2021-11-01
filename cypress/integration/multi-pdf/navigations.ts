describe('Multi PDF navigation', () => {
  beforeEach(() => {
    cy.loadPdf('/pdf-collection');
  });

  it('Paginated mode & TOC: should update page content after clicking on TOC link', () => {
    cy.findByRole('button', { name: 'Settings' }).click();
    cy.findByRole('radio', { name: 'Paginated' }).should('be.checked');
    cy.findByRole('button', { name: 'Table of Contents' }).click();
    cy.findByRole('menuitem', { name: 'Foreword' }).click();
    cy.wait(5000);
    cy.findByText('Anthropology without Informants', { timeout: 10000 }).should(
      'be.visible'
    );
    cy.findByRole('button', { name: 'Next Page' }).click();
    cy.findByText('Foreword', { timeout: 10000 }).should('exist');
  });

  it('Scrolling mode & TOC: should update page content after clicking on TOC link', () => {
    cy.findByRole('button', { name: 'Settings' }).click();
    cy.findByText('Scrolling').click();
    cy.findByRole('radio', { name: 'Paginated' }).should('not.be.checked');
    cy.findByRole('radio', { name: 'Scrolling' }).should('be.checked');
    cy.findByRole('button', { name: 'Table of Contents' }).click();
    cy.findByRole('menuitem', { name: 'Foreword' }).click();
    cy.wait(5000);
    cy.findByText('Anthropology without Informants', { timeout: 10000 }).should(
      'be.visible'
    );
    cy.get('div[data-page-number="2"]').should('exist');
  });

  it('should navigate forward and backwards with page buttons', () => {
    cy.findByText('Anthropology without Informants').should('be.visible');
    cy.findByRole('button', { name: 'Next Page' }).click();
    cy.get('#iframe-wrapper')
      .find('div[class="react-pdf__Page__textContent"]')
      .children()
      .should('have.length', 0);
    cy.findByText('Anthropology without Informants').should('not.exist');
    cy.findByRole('button', { name: 'Previous Page' }).click();
    cy.findByText('Anthropology without Informants').should('be.visible');
  });

  it('should switch to scrolling mode', () => {
    cy.findByText('Anthropology without Informants').should('be.visible');
    cy.findByRole('button', { name: 'Settings' }).click();
    cy.findByText('Scrolling').click();
    cy.findByRole('button', { name: 'Next Page' }).click();
    cy.wait('@pdf');
    cy.get('div[data-page-number="5"]', { timeout: 6000 }).scrollIntoView();
    cy.wait(5000);
    cy.get('div[data-page-number="5"]').find('canvas').should('exist');
  });
});
