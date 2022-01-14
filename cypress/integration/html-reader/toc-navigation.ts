describe('navigating an EPUB page', () => {
  beforeEach(() => {
    cy.loadPage('/html/streamed-alice-epub');
  });

  it('Paginated mode & TOC: should update page content after clicking on TOC link', () => {
    cy.intercept('GET', 'https://alice.dita.digital/text/chapter-1.xhtml').as(
      'chapterOne'
    );

    cy.getIframeBody()
      .find('img', { timeout: 10000 })
      .should(
        'have.attr',
        'alt',
        "Alice's Adventures in Wonderland, by Lewis Carroll"
      );

    cy.findByRole('button', { name: 'Settings' }).click();
    cy.findByText('Scrolling').click();
    cy.findByRole('radio', { name: 'Paginated' }).should('not.be.checked');
    cy.findByRole('radio', { name: 'Scrolling' }).should('be.checked');

    cy.log('open TOC menu');
    cy.findByRole('button', { name: 'Table of Contents' }).click();

    cy.log('open chapter 1');
    cy.findByRole('menuitem', { name: 'I: Down the Rab­bit-Hole' }).click();

    cy.wait('@chapterOne', { timeout: 10000 }).then((interception) => {
      assert.isNotNull(
        interception?.response?.body,
        'chapter one API call has data'
      );
    });

    cy.wait(3000);

    cy.getIframeHead().contains('title', 'Chapter 1: Down the Rabbit-Hole');
  });

  it('Scrolling mode & TOC: should update page content after clicking on TOC link', () => {
    cy.intercept('GET', 'https://alice.dita.digital/text/chapter-1.xhtml').as(
      'chapterOne'
    );

    cy.getIframeBody()
      .find('img', { timeout: 10000 })
      .should(
        'have.attr',
        'alt',
        "Alice's Adventures in Wonderland, by Lewis Carroll"
      );

    cy.findByRole('button', { name: 'Settings' }).click();
    cy.findByText('Paginated').click();
    cy.findByRole('radio', { name: 'Paginated' }).should('be.checked');
    cy.findByRole('radio', { name: 'Scrolling' }).should('not.be.checked');

    cy.log('open TOC menu');
    cy.findByRole('button', { name: 'Table of Contents' }).click();

    cy.log('open chapter 1');
    cy.findByRole('menuitem', { name: 'I: Down the Rab­bit-Hole' }).click();

    cy.wait('@chapterOne', { timeout: 10000 }).then((interception) => {
      assert.isNotNull(
        interception?.response?.body,
        'chapter one API call has data'
      );
    });

    cy.wait(3000);

    cy.getIframeHead().contains('title', 'Chapter 1: Down the Rabbit-Hole');
  });
});
