describe('Multi PDF navigation', () => {
  beforeEach(() => {
    cy.loadPdf('/pdf/collection');
  });

  it('Paginated mode & TOC: should update page content after clicking on TOC link', () => {
    cy.findByRole('button', { name: 'Settings' }).click();
    cy.findByRole('radio', { name: 'Paginated' }).should('be.checked');
    cy.findByRole('button', { name: 'Table of Contents' }).click();
    cy.findByRole('menuitem', { name: 'Foreword' }).click();
    cy.wait(5000);
    cy.findByText(
      /This volume encapsulates some of the most significant published work of Leslie/,
      { timeout: 10000 }
    ).should('be.visible');
    cy.findByRole('button', { name: 'Next Page' }).click();
    cy.findByText(
      /All subfields of anthropology had contributions to make to this endeavor/,
      { timeout: 10000 }
    ).should('be.visible');
  });

  it('Scrolling mode & TOC: should update page content after clicking on TOC link', () => {
    cy.findByRole('button', { name: 'Settings' }).click();
    cy.findByText('Scrolling').click();
    cy.findByRole('radio', { name: 'Paginated' }).should('not.be.checked');
    cy.findByRole('radio', { name: 'Scrolling' }).should('be.checked');
    cy.findByRole('button', { name: 'Table of Contents' }).click();
    cy.findByRole('menuitem', { name: 'Foreword' }).click();
    cy.wait('@pdf');
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

  it('should navigate between resources with page buttons on scrolling mode', () => {
    cy.findByText('Anthropology without Informants').should('be.visible');
    cy.findByText('Settings').click();
    cy.findByText('Scrolling').click();
    cy.findByRole('button', { name: 'Next Page' }).click();
    cy.findByText('Anthropology without Informants').should('not.exist');

    cy.log('switch from paginated to scrolling');
    cy.findByText('Settings').click();
    cy.findByText('Paginated').click();
    cy.findByRole('button', { name: 'Next Page' }).click();

    cy.findByText('Anthropology without Informants').should('not.exist');

    cy.findByText('Settings').click();
    cy.findByText('Scrolling').click();
    cy.findByRole('button', { name: 'Previous Page' }).click();

    cy.wait('@pdf');

    cy.findByText('Anthropology without Informants', { timeout: 10000 }).should(
      'be.visible'
    );
  });
});
