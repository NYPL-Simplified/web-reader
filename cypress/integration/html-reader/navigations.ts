import { IFRAME_SELECTOR } from '../../support/constants';

describe('navigating an EPUB page', () => {
  beforeEach(() => {
    cy.loadPage('/streamed-alice-epub');
  });

  it('should contain a link to return to the homepage', () => {
    cy.findByRole('link', { name: 'Return to Homepage' }).should(
      'have.prop',
      'href',
      `${Cypress.config().baseUrl}/`
    );
  });

  // FIXME: Finish writing this test once https://jira.nypl.org/browse/SFR-1332 is resolved
  it('Should navigate forward and backwards with page buttons', () => {
    cy.log('make sure we are on the homepage');
    cy.getIframeBody(IFRAME_SELECTOR)
      .find('img')
      .should(
        'have.attr',
        'alt',
        "Alice's Adventures in Wonderland, by Lewis Carroll"
      );

    cy.findByRole('button', { name: 'Settings' }).click();
    cy.log('make sure we are on paginated mode');
    cy.findByText('Paginated').click();

    cy.findByRole('button', { name: 'Next Page' }).click();
  });
});

describe('navigating an EPUB page using internal link', () => {
  beforeEach(() => {
    cy.loadPage('/moby-epub2');
  });

  it('navigates user using the internal TOC link on the page', () => {
    cy.log('Use scrolling');
    cy.findByRole('button', { name: 'Settings' }).click();
    cy.findByText('Scrolling').click();

    cy.log('Go to a page with TOC');

    cy.findByRole('button', { name: 'Table of Contents' }).click();
    cy.findByLabelText('MOBY-DICK; or, THE WHALE.').click();

    cy.log('Go to chapter 2');
    cy.getIframeBody(IFRAME_SELECTOR)
      .findByText(/The Carpet-Bag/, { timeout: 3000 })
      .click();

    cy.getIframeBody(IFRAME_SELECTOR)
      .get('h2', { timeout: 3000 })
      .should('contain', /CHAPTER 2. The Carpet-Bag./);
  });
});
