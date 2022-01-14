describe('navigating an EPUB page', () => {
  beforeEach(() => {
    cy.loadPage('/html/streamed-alice-epub');
  });

  it('should contain a link to return to the homepage', () => {
    cy.findByRole('link', { name: 'Return to Homepage' }).should(
      'have.prop',
      'href',
      `${Cypress.config().baseUrl?.replace('/v1', '').replace('/v2', '')}/`
    );
  });

  it('Should navigate forward and backwards with page buttons', () => {
    cy.log('make sure we are on the homepage');
    cy.getIframeBody()
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

    // make sure correct content exists now
    cy.getIframeBody()
      .findByRole('heading', { name: 'Im­print' })
      .should('exist');

    cy.getIframeBody();

    // go back
    cy.findByRole('button', { name: 'Previous Page' }).click();

    cy.getIframeBody()
      .find('img')
      .should(
        'have.attr',
        'alt',
        "Alice's Adventures in Wonderland, by Lewis Carroll"
      );
  });
});

describe('hash navigation', () => {
  beforeEach(() => {
    cy.loadPage('/html/moby-epub3');
  });
});
