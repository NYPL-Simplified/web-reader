import { IFRAME_SELECTOR } from '../../support/constants';

describe('render page content', () => {
  it('Renders content on the streamed epub page', () => {
    cy.loadPage('/streamed-alice-epub');

    cy.log('check that all the essential buttons are on the page');
    cy.findByRole('link', { name: 'Return to Homepage' }).should('exist');
    cy.findByRole('button', { name: 'Table of Contents' }).should('exist');
    cy.findByRole('button', { name: 'Settings' }).should('exist');
    cy.findByRole('button', { name: 'Toggle Fullscreen' }).should('exist');
    cy.findByRole('button', { name: 'Next Page' }).should('exist');
    // On initial load, previous button is hidden
    cy.findByRole('button', { name: 'Previous Page' }).should('not.exist');

    cy.log('page one contains an image');
    cy.getIframeBody(IFRAME_SELECTOR)
      .find('img')
      .should(
        'have.attr',
        'alt',
        "Alice's Adventures in Wonderland, by Lewis Carroll"
      );
  });
});
