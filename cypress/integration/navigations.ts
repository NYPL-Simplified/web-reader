describe('navigations', () => {
  beforeEach(() => {
    cy.loadPage('/streamed-epub');
  });

  it('table of content link should update the page content', () => {
    cy.iframe({ url: '/streamed-epub' })
      .findByRole('img', {
        name: "Alice's Adventures in Wonderland, by Lewis Carroll",
      })
      .should('exist');

    // Open TOC menu
    cy.findByRole('button', { name: 'Table of Contents' }).click();

    // Open chapter 1
    cy.findByRole('menuitem', { name: 'I: Down the Rab­bit-Hole' }).click();
    cy.wait(100); // wait for the nested iframe to render

    cy.iframe({ url: '/streamed-epub' })
      .find('.subtitle')
      .contains('Down the Rab­bit-Hole');
  });

  it('next and previous button', () => {
    cy.iframe({ url: '/streamed-epub' });

    cy.findByRole('button', { name: '>' }).click();

    cy.wait(100);
    cy.iframe({ url: '/streamed-epub' })
      .findByRole('img', {
        name: 'The Standard Ebooks logo',
      })
      .should('exist');

    cy.wait(100);
    cy.iframe({ url: '/streamed-epub' })
      .findByRole('img', {
        name: "Alice's Adventures in Wonderland, by Lewis Carroll",
      })
      .should('not.exist');

    cy.findByRole('button', { name: '<' }).click();

    cy.wait(100);
    cy.iframe({ url: '/streamed-epub' })
      .findByRole('img', {
        name: "Alice's Adventures in Wonderland, by Lewis Carroll",
      })
      .should('exist');
  });
});
