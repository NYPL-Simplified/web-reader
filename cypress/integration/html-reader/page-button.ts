import { IFRAME_SELECTOR } from '../../support/constants';

describe('PageButton visibility on useHtmlReader', () => {
  beforeEach(() => {
    cy.loadPage('/streamed-alice-epub');
  });

  it('Should disable previous page button at the start of the book', () => {
    cy.findByRole('button', { name: 'Next Page' }).should('not.be.disabled');
    cy.findByRole('button', { name: 'Previous Page' }).should('be.disabled');

    cy.log('On Paginated Mode');

    cy.findByRole('button', { name: 'Settings' }).click();
    cy.findByText('Paginated').click();

    cy.findByRole('button', { name: 'Next Page' }).should('not.be.disabled');
    cy.findByRole('button', { name: 'Previous Page' }).should('be.disabled');

    //TODO: find a single resource webpub to test the scrolling mode
  });

  it('Should enable previous page button after moving to the next page', () => {
    cy.findByRole('button', { name: 'Settings' }).click();
    cy.findByText('Paginated').click();

    cy.findByRole('button', { name: 'Next Page' }).click();

    cy.findByRole('button', { name: 'Next Page' }).should('not.be.disabled');
    cy.findByRole('button', { name: 'Previous Page' }).should(
      'not.be.disabled'
    );

    cy.findByRole('button', { name: 'Settings' }).click();
    cy.findByText('Scrolling').click();

    cy.findByRole('button', { name: 'Next Page' }).should('not.be.disabled');
    cy.findByRole('button', { name: 'Previous Page' }).should(
      'not.be.disabled'
    );
  });

  it('Should disable next page button at the end of the book', () => {
    cy.intercept('GET', 'https://alice.dita.digital/text/uncopyright.xhtml').as(
      'uncopyright'
    );

    // The load time for Scrolling mode is extreamly unpredictable, better to use paginated
    cy.findByRole('button', { name: 'Settings' }).click();
    cy.findByText('Paginated').click();

    cy.findByRole('button', { name: 'Table of Contents' }).click();
    cy.log('move to last chapter');
    cy.findByRole('menuitem', { name: /(.*copy.*right$)/ }).click();

    cy.wait('@uncopyright', { timeout: 10000 });

    cy.wait(1000);

    cy.getIframeBody(IFRAME_SELECTOR).find('.copyright-page').should('exist');

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

  it('Should toggle the page buttons when the screen is resized', () => {
    cy.intercept('GET', 'https://alice.dita.digital/text/uncopyright.xhtml').as(
      'uncopyright'
    );

    // The load time for Scrolling mode is extreamly unpredictable, better to use paginated
    cy.findByRole('button', { name: 'Settings' }).click();
    cy.findByText('Paginated').click();

    cy.findByRole('button', { name: 'Table of Contents' }).click();
    cy.log('move to last chapter');
    cy.findByRole('menuitem', { name: /(.*copy.*right$)/ }).click();

    cy.wait('@uncopyright', { timeout: 10000 });

    cy.wait(1000);

    cy.getIframeBody(IFRAME_SELECTOR).find('.copyright-page').should('exist');

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
});
