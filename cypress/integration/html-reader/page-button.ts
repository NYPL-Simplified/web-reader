import { IFRAME_SELECTOR } from '../../support/constants';

describe('PageButton visibility on useHtmlReader', () => {
  beforeEach(() => {
    cy.loadPage('/streamed-alice-epub');
  });

  it('Should hide previous page button at the start of the book', () => {
    cy.findByRole('button', { name: 'Next Page' }).should('exist');
    cy.findByRole('button', { name: 'Previous Page' }).should('not.exist');

    cy.log('On Paginated Mode');

    cy.findByRole('button', { name: 'Settings' }).click();
    cy.findByText('Paginated').click();

    cy.findByRole('button', { name: 'Next Page' }).should('exist');
    cy.findByRole('button', { name: 'Previous Page' }).should('not.exist');

    //TODO: find a single resource webpub to test the scrolling mode
  });

  it('Should show previous page button after moving to the next page', () => {
    cy.findByRole('button', { name: 'Settings' }).click();
    cy.findByText('Paginated').click();

    cy.findByRole('button', { name: 'Next Page' }).click();

    cy.findByRole('button', { name: 'Next Page' }).should('exist');
    cy.findByRole('button', { name: 'Previous Page' }).should('exist');

    cy.findByRole('button', { name: 'Settings' }).click();
    cy.findByText('Scrolling').click();

    cy.findByRole('button', { name: 'Next Page' }).should('exist');
    cy.findByRole('button', { name: 'Previous Page' }).should('exist');
  });

  it('Should hide next page button at the end of the book', () => {
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

    cy.findByRole('button', { name: 'Next Page' }).click();
    cy.findByRole('button', { name: 'Next Page' }).should('exist');

    cy.wait(1000);

    cy.findByRole('button', { name: 'Next Page' }).should('not.exist');
    cy.findByRole('button', { name: 'Previous Page' }).should('exist');

    cy.log('Press the Previous page button to reveal the next page button');
    cy.findByRole('button', { name: 'Previous Page' }).click();

    cy.wait(1000);

    cy.findByRole('button', { name: 'Next Page' }).should('exist');
    cy.findByRole('button', { name: 'Previous Page' }).should('exist');
  });
});
