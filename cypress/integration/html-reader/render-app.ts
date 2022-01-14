describe('render page content', () => {
  it('Renders content on the epub2 based webpub page', () => {
    cy.loadPage('/html/streamed-alice-epub');
    cy.log('check that all the essential buttons are on the page');
    cy.findByRole('link', { name: 'Return to Homepage' }).should('exist');
    cy.findByRole('button', { name: 'Table of Contents' }).should('exist');
    cy.findByRole('button', { name: 'Settings' }).should('exist');
    cy.findByRole('button', { name: 'Toggle Fullscreen' }).should('exist');
    cy.findByRole('button', { name: 'Next Page' }).should('not.be.disabled');
    // On initial load, previous button is hidden
    cy.findByRole('button', { name: 'Previous Page' }).should('be.disabled');

    cy.log('page one contains an image');
    cy.getIframeBody()
      .find('img')
      .should(
        'have.attr',
        'alt',
        "Alice's Adventures in Wonderland, by Lewis Carroll"
      );
  });
});
