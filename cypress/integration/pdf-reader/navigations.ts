import { IFRAME_SELECTOR } from '../../support/constants';

describe('navigating an EPUB page', () => {
  beforeEach(() => {
    cy.loadPage('/pdf');
  });

  it('should contain a link to return to the homepage', () => {
    cy.findByRole('link', { name: 'Return to Homepage' }).should(
      'have.prop',
      'href',
      `${Cypress.config().baseUrl}/`
    );
  });

  it('should update page content after clicking on TOC link', () => {
    cy.intercept('GET', 'https://alice.dita.digital/text/chapter-1.xhtml').as(
      'chapterOne'
    );

    cy.getIframeBody(IFRAME_SELECTOR)
      .find('text', { timeout: 10000 })
      .should('have.text', 'Pioneers of Zionism: Hess, Pinsker, Rülf');

    cy.log('open TOC menu');
    cy.findByRole('button', { name: 'Table of Contents' }).click();

    cy.log('open chapter 1');
    cy.findByRole('menuitem', { name: 'Rejection of “Russification"' }).click();

    cy.wait('@chapterOne', { timeout: 10000 }).then((interception) => {
      assert.isNotNull(
        interception?.response?.body,
        'chapter one API call has data'
      );
    });

    cy.wait(3000);

    cy.getIframeHead(IFRAME_SELECTOR).contains(
      'title',
      'Rejection of “Russification"'
    );
  });

  it('should navigate forward and backwards with page buttons', () => {
    cy.intercept('GET', 'https://alice.dita.digital/text/imprint.xhtml').as(
      'imprint'
    );
    cy.intercept('GET', 'https://alice.dita.digital/text/titlepage.xhtml').as(
      'titlePage'
    );

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

    cy.wait('@imprint', { timeout: 10000 }).then((interception) => {
      assert.isNotNull(
        interception?.response?.body,
        'imprint API call has data'
      );
    });

    cy.wait(3000);

    cy.log('then we see the imprint page');
    cy.getIframeHead(IFRAME_SELECTOR).contains('title', 'Imprint');

    cy.findByRole('button', { name: 'Previous Page' }).click();

    cy.wait('@titlePage', { timeout: 10000 }).then((interception) => {
      assert.isNotNull(
        interception?.response?.body,
        'imprint API call has data'
      );
    });

    cy.wait(3000);

    cy.getIframeHead(IFRAME_SELECTOR).contains('title', 'Title Page');

    // TODO: Test whether the next or the previous button is visible when
    // we are on the first page or last page, respectively.
  });
});
