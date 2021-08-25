import { IFRAME_SELECTOR } from '../../support/constants';

describe('navigating an EPUB page', () => {
  beforeEach(() => {
    cy.loadPage('/streamed-epub');
  });

  it('should update page content after clicking on TOC link', () => {
    cy.iframe(IFRAME_SELECTOR)
      .findByRole('img', {
        name: "Alice's Adventures in Wonderland, by Lewis Carroll",
      })
      .should('exist');

    cy.iframe(IFRAME_SELECTOR).find('.subtitle').should('not.exist');

    // Open TOC menu
    cy.findByRole('button', { name: 'Table of Contents' }).click();

    // Open chapter 1
    cy.findByRole('menuitem', { name: 'I: Down the Rab­bit-Hole' }).click();
    cy.wait(100); // wait for the nested iframe to render

    cy.iframe(IFRAME_SELECTOR)
      .find('.subtitle')
      .contains('Down the Rab­bit-Hole');
  });

  it('should navigate forward and backwards with page buttons', () => {
    // load iframe
    cy.iframe(IFRAME_SELECTOR);

    cy.findByRole('button', { name: '>' }).click();

    cy.wait(100);
    cy.iframe(IFRAME_SELECTOR)
      .findByRole('img', {
        name: 'The Standard Ebooks logo',
      })
      .should('exist');

    cy.iframe(IFRAME_SELECTOR)
      .findByRole('img', {
        name: "Alice's Adventures in Wonderland, by Lewis Carroll",
      })
      .should('not.exist');

    cy.wait(100);

    cy.findByRole('button', { name: '<' }).click();

    cy.wait(100);
    cy.iframe(IFRAME_SELECTOR)
      .findByRole('img', {
        name: "Alice's Adventures in Wonderland, by Lewis Carroll",
      })
      .should('exist');

    // TODO: Test whether the next or the previous button is visible when
    // we are on the first page or last page, respectively.
  });
});
