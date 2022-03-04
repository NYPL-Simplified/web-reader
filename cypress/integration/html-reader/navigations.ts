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

  it('Paginated mode & page buttons should navigate users forward and backwards', () => {
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
    cy.wait(1000);

    cy.getIframeBody()
      .find('a')
      .first()
      .should('have.attr', 'href', 'https://standardebooks.org');
    cy.getIframeBody()
      .find('img')
      .should('have.attr', 'alt', 'The Standard Ebooks logo');

    cy.log('return to the homepage');

    cy.findByRole('button', { name: 'Previous Page' }).click();
    cy.wait(1000);

    cy.getIframeBody()
      .find('img')
      .should(
        'have.attr',
        'alt',
        "Alice's Adventures in Wonderland, by Lewis Carroll"
      );
  });

  // FIXME: https://jira.nypl.org/browse/OE-392
  // it('Scrolling mode & page buttons should navigate users forward and backwards', () => {
  //   cy.findByRole('button', { name: 'Settings' }).click();
  //   cy.findByText('Scrolling').click();

  //   cy.findByRole('button', { name: 'Next Page' }).click();
  //   cy.wait(1000);

  //   cy.getIframeBody()
  //     .find('a')
  //     .first()
  //     .should('have.attr', 'href', 'https://standardebooks.org');

  //   cy.getIframeBody()
  //     .find('img')
  //     .should('have.attr', 'alt', 'The Standard Ebooks logo');

  //   cy.log('return to the homepage');

  //   cy.findByRole('button', { name: 'Previous Page' }).click();
  //   cy.wait(1000);

  //   cy.getIframeBody()
  //     .find('img')
  //     .should(
  //       'have.attr',
  //       'alt',
  //       "Alice's Adventures in Wonderland, by Lewis Carroll"
  //     );
  // });

  it('should load the next chapter if user scrolled to the buttom of the page and pressed the next button', () => {
    cy.log('scrolling mode');
    cy.findByRole('button', { name: 'Settings' }).click();
    cy.wait(1000);
    cy.findByText('Scrolling').click();

    cy.findByRole('button', { name: 'Table of Contents' }).click();
    cy.wait(1000);
    cy.log('open chapter 1');
    cy.findByRole('menuitem', { name: 'I: Down the Rab­bit-Hole' }).click();

    cy.wait(1000);

    cy.log('scroll to the bottom of the page');
    cy.get('iframe').then(($iframe) => {
      $iframe.contents().scrollTop(Number.MAX_SAFE_INTEGER);
    });
    cy.wait(1000);

    cy.log('click next button');
    cy.findByRole('button', { name: 'Next Page' }).click();
    cy.wait(1000);

    cy.getIframeBody().find('h2').should('contain.text', 'The Pool of Tears');
  });
});
