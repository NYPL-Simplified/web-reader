describe('PageButton visibility on useHtmlReader', () => {
  beforeEach(() => {
    cy.loadPage('/streamed-alice-epub');
  });

  it('Paginated mode & at the start of the book previous page button should be disabled', () => {
    cy.findByRole('button', { name: 'Next Page' }).should('not.be.disabled');
    cy.findByRole('button', { name: 'Previous Page' }).should('be.disabled');

    cy.findByRole('button', { name: 'Settings' }).click();
    cy.findByText('Paginated').click();

    cy.findByRole('button', { name: 'Next Page' }).should('not.be.disabled');
    cy.findByRole('button', { name: 'Previous Page' }).should('be.disabled');
  });

  it('Scrolling mode & at the start of the book previous page button should be disabled', () => {
    cy.findByRole('button', { name: 'Next Page' }).should('not.be.disabled');
    cy.findByRole('button', { name: 'Previous Page' }).should('be.disabled');

    cy.findByRole('button', { name: 'Settings' }).click();
    cy.findByText('Scrolling').click();

    cy.findByRole('button', { name: 'Next Page' }).should('not.be.disabled');
    cy.findByRole('button', { name: 'Previous Page' }).should('be.disabled');
  });

  it('Paginated mode & at the end of the book the next page button should be disabled', () => {
    cy.intercept('GET', 'https://alice.dita.digital/text/uncopyright.xhtml').as(
      'uncopyright'
    );

    cy.findByRole('button', { name: 'Settings' }).click();
    cy.findByText('Paginated').click();

    cy.findByRole('button', { name: 'Table of Contents' }).click();
    cy.log('move to last chapter');
    cy.findByRole('menuitem', { name: /(.*copy.*right$)/ }).click();

    cy.wait('@uncopyright', { timeout: 10000 });

    cy.wait(1000);

    cy.getIframeBody().find('.copyright-page').should('exist');

    cy.wait(1000);

    cy.findByRole('button', { name: 'Next Page' }).should('be.disabled');
    cy.findByRole('button', { name: 'Previous Page' }).should(
      'not.be.disabled'
    );

    cy.log('Press the Previous page button to reveal the next page button');
    cy.findByRole('button', { name: 'Previous Page' }).click();

    cy.wait(1000);

    cy.findByRole('button', { name: 'Next Page' }).should('not.be.disabled');
    cy.findByRole('button', { name: 'Previous Page' }).should(
      'not.be.disabled'
    );
  });

  it('Scrolling mode & at the end of the book the next page button should be disabled', () => {
    cy.intercept('GET', 'https://alice.dita.digital/text/uncopyright.xhtml').as(
      'uncopyright'
    );

    cy.findByRole('button', { name: 'Settings' }).click();
    cy.findByText('Scrolling').click();

    cy.findByRole('button', { name: 'Table of Contents' }).click();
    cy.log('move to last chapter');
    cy.findByRole('menuitem', { name: /(.*copy.*right$)/ }).click();

    cy.wait('@uncopyright', { timeout: 10000 });

    cy.wait(1000);

    cy.getIframeBody().find('.copyright-page').should('exist');

    cy.wait(1000);

    cy.findByRole('button', { name: 'Next Page' }).should('be.disabled');
    cy.findByRole('button', { name: 'Previous Page' }).should(
      'not.be.disabled'
    );

    cy.log('Press the Previous page button to reveal the next page button');
    cy.findByRole('button', { name: 'Previous Page' }).click();

    cy.wait(1000);

    cy.findByRole('button', { name: 'Next Page' }).should('not.be.disabled');
    cy.findByRole('button', { name: 'Previous Page' }).should(
      'not.be.disabled'
    );
  });

  it('Paginated mode & screen resize should show/hide the page buttons', () => {
    cy.intercept('GET', 'https://alice.dita.digital/text/uncopyright.xhtml').as(
      'uncopyright'
    );

    cy.findByRole('button', { name: 'Settings' }).click();
    cy.findByText('Paginated').click();

    cy.findByRole('button', { name: 'Table of Contents' }).click();
    cy.log('move to last chapter');
    cy.findByRole('menuitem', { name: /(.*copy.*right$)/ }).click();

    cy.wait('@uncopyright', { timeout: 10000 });

    cy.wait(1000);

    cy.getIframeBody().find('.copyright-page').should('exist');

    cy.wait(1000);

    cy.findByRole('button', { name: 'Next Page' }).should('be.disabled');
    cy.findByRole('button', { name: 'Previous Page' }).should(
      'not.be.disabled'
    );

    cy.log('Small screen should reveal next button');
    cy.viewport(100, 100);

    cy.findByRole('button', { name: 'Next Page' }).should('not.be.disabled');
    cy.findByRole('button', { name: 'Previous Page' }).should(
      'not.be.disabled'
    );

    cy.log('switch back to default viewport');
    cy.viewport(1000, 600);

    cy.findByRole('button', { name: 'Next Page' }).should('be.disabled');
    cy.findByRole('button', { name: 'Previous Page' }).should(
      'not.be.disabled'
    );
  });

  it('Scrolling mode & screen resize should show/hide the page buttons', () => {
    cy.intercept('GET', 'https://alice.dita.digital/text/uncopyright.xhtml').as(
      'uncopyright'
    );

    cy.findByRole('button', { name: 'Settings' }).click();
    cy.findByText('Scrolling').click();

    cy.findByRole('button', { name: 'Table of Contents' }).click();
    cy.log('move to last chapter');
    cy.findByRole('menuitem', { name: /(.*copy.*right$)/ }).click();

    cy.wait('@uncopyright', { timeout: 10000 });

    cy.wait(1000);

    cy.getIframeBody().find('.copyright-page').should('exist');

    cy.wait(1000);

    cy.log('scroll to the bottom of the page');
    cy.window().scrollTo('bottom');
    cy.wait(1000);

    cy.findByRole('button', { name: 'Next Page' }).should('be.disabled');
    cy.findByRole('button', { name: 'Previous Page' }).should(
      'not.be.disabled'
    );

    cy.log('Small screen should disable next button');
    cy.viewport(100, 100);

    cy.findByRole('button', { name: 'Next Page' }).should('be.disabled');
    cy.findByRole('button', { name: 'Previous Page' }).should(
      'not.be.disabled'
    );
  });
});
