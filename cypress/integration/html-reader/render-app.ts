describe('render page content', () => {
  beforeEach(() => {
    cy.loadPage('/html/streamed-alice-epub');
  });

  it('Renders content on the epub2 based webpub page', () => {
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

  it('Paginated mode & vertical and horizontal scroll bars should not exist', () => {
    cy.findByRole('button', { name: 'Settings' }).click();
    cy.findByText('Paginated').click();

    cy.log('attemp to scroll the page');
    cy.window().scrollTo(100, 100, { ensureScrollable: false });

    cy.window().its('scrollY').should('eq', 0);
    cy.window().its('scrollX').should('eq', 0);
  });

  it('Scrolling mode & horizontal scroll bars should not exist but should be able to scroll vertically', () => {
    cy.findByRole('button', { name: 'Settings' }).click();
    cy.wait(100);
    cy.findByText('Scrolling').click();

    cy.findByRole('button', { name: 'Table of Contents' }).click();
    cy.log('open chapter 1');
    cy.findByRole('menuitem', { name: 'I: Down the Rab­bit-Hole' }).click();

    cy.wait(1000);

    cy.log('scrollable vertically but not horizontally');
    cy.window().scrollTo(100, 100, { ensureScrollable: false });

    cy.window().its('scrollY').should('eq', 0);
    cy.window().its('scrollX').should('eq', 0);
  });

  // Scroll to the bottom of the page, but if the screen is resized to be smaller, vertical scroll bar should re-appear to allow user to scroll down
  it('Scrolling mode & resize to smaller screen shows you are not at the end of the chapter', () => {
    cy.findByRole('button', { name: 'Settings' }).click();
    cy.wait(1000);
    cy.findByText('Scrolling').click();

    cy.findByRole('button', { name: 'Table of Contents' }).click();
    cy.log('open chapter 1');
    cy.findByRole('menuitem', { name: 'I: Down the Rab­bit-Hole' }).click();

    cy.wait(1000);

    cy.log('scroll to the bottom of the page');
    cy.get('iframe').then(($iframe) => {
      $iframe.contents().scrollTop(Number.MAX_SAFE_INTEGER);
    });

    cy.get('iframe').then(($iframe) => {
      // https://stackoverflow.com/a/9439807/17573442
      const contentTop = $iframe.contents().scrollTop() ?? 0;
      const iframeHeight = $iframe.height() ?? 0;
      const contentHeight = $iframe.contents().height() ?? 0;
      const atBottom = contentTop + iframeHeight >= contentHeight;

      expect(atBottom).eq(true);
    });

    cy.log(
      'resize the screen to be smaller so the vertical scroll bar appears'
    );
    cy.viewport(500, 500);

    cy.get('iframe').then(($iframe) => {
      const contentTop = $iframe.contents().scrollTop() ?? 0;
      const iframeHeight = $iframe.height() ?? 0;
      const contentHeight = $iframe.contents().height() ?? 0;
      const atBottom = contentTop + iframeHeight >= contentHeight;

      expect(atBottom).eq(false);
    });
  });
});
