describe('PageButton visibility on useHtmlReader', () => {
  describe('Reflowable layout', () => {
    beforeEach(() => {
      cy.loadPage('/html/streamed-alice-epub');
    });

    it('Paginated mode & at the start of the book previous page button should be disabled', () => {
      cy.findByRole('button', { name: 'Next Page' }).should('not.be.disabled');
      cy.findByRole('button', { name: 'Previous Page' }).should('be.disabled');

      cy.findByRole('button', { name: 'Settings' }).click();
      cy.findByText('Paginated').click();

      cy.findByRole('button', { name: 'Next Page' }).should('not.be.disabled');
      cy.findByRole('button', { name: 'Previous Page' }).should('be.disabled');
    });

    it('Scrolling mode & at the start of the book previous page button should be disabled', () => {
      cy.findByRole('button', { name: 'Next Page' }).should('not.be.disabled');
      cy.findByRole('button', { name: 'Previous Page' }).should('be.disabled');

      cy.findByRole('button', { name: 'Settings' }).click();
      cy.findByText('Scrolling').click();

      cy.findByRole('button', { name: 'Next Page' }).should('not.be.disabled');
      cy.findByRole('button', { name: 'Previous Page' }).should('be.disabled');
    });

    it('Paginated mode & at the end of the book the next page button should be disabled', () => {
      cy.intercept(
        'GET',
        'https://alice.dita.digital/text/uncopyright.xhtml'
      ).as('uncopyright');

      cy.findByRole('button', { name: 'Settings' }).click();
      cy.findByText('Paginated').click();
      cy.wait(1000);
      cy.findByRole('button', { name: 'Table of Contents' }).click();
      cy.wait(1000);
      cy.log('move to last chapter');
      cy.findByRole('menuitem', { name: /(.*copy.*right$)/ }).click();

      cy.wait('@uncopyright', { timeout: 10000 });

      cy.wait(1000);

      cy.log('move to last page');
      cy.findByRole('button', { name: 'Next Page' }).click();

      cy.wait(1000);

      cy.findByRole('button', { name: 'Next Page' }).should('be.disabled');
      cy.findByRole('button', { name: 'Previous Page' }).should(
        'not.be.disabled'
      );

      cy.log('Press the Previous page button to reveal the next page button');
      cy.findByRole('button', { name: 'Previous Page' }).click();

      cy.wait(1000);

      cy.findByRole('button', { name: 'Next Page' }).should('not.be.disabled');
      cy.findByRole('button', { name: 'Previous Page' }).should(
        'not.be.disabled'
      );
    });

    it('Scrolling mode & at the end of the book the next page button should be disabled', () => {
      cy.intercept(
        'GET',
        'https://alice.dita.digital/text/uncopyright.xhtml'
      ).as('uncopyright');

      cy.findByRole('button', { name: 'Settings' }).click();
      cy.wait(500);
      cy.findByText('Scrolling').click();

      cy.findByRole('button', { name: 'Table of Contents' }).click();
      cy.log('move to last chapter');
      cy.findByRole('menuitem', { name: /(.*copy.*right$)/ }).click();

      cy.wait('@uncopyright', { timeout: 10000 });

      cy.wait(1000);

      cy.getIframeBody().find('.copyright-page').should('exist');

      cy.wait(1000);

      cy.log('move to last page');
      cy.findByRole('button', { name: 'Next Page' }).click();

      cy.wait(1000);

      cy.findByRole('button', { name: 'Next Page' }).should('be.disabled');
      cy.findByRole('button', { name: 'Previous Page' }).should(
        'not.be.disabled'
      );

      cy.log('Press the Previous page button to reveal the next page button');
      cy.findByRole('button', { name: 'Previous Page' }).click();

      cy.wait(1000);

      cy.findByRole('button', { name: 'Next Page' }).should('not.be.disabled');
      cy.findByRole('button', { name: 'Previous Page' }).should(
        'not.be.disabled'
      );
    });

    it('Scrolling mode & screen resize should show/hide the page buttons', () => {
      cy.intercept(
        'GET',
        'https://alice.dita.digital/text/uncopyright.xhtml'
      ).as('uncopyright');

      cy.findByRole('button', { name: 'Settings' }).click();

      cy.wait(1000);

      cy.findByText('Scrolling').click();

      cy.findByRole('button', { name: 'Table of Contents' }).click();
      cy.log('move to last chapter');
      cy.findByRole('menuitem', { name: /(.*copy.*right$)/ }).click();

      cy.wait('@uncopyright', { timeout: 10000 });

      cy.wait(1000);

      cy.getIframeBody().find('.copyright-page').should('exist');

      cy.wait(1000);

      cy.log('scroll to the bottom of the page');
      cy.get('iframe').then(($iframe) => {
        console.log($iframe.contents().scrollTop(Number.MAX_SAFE_INTEGER));
      });
      cy.wait(1000);

      cy.findByRole('button', { name: 'Next Page' }).should('be.disabled');
      cy.findByRole('button', { name: 'Previous Page' }).should(
        'not.be.disabled'
      );

      cy.log('Small screen should disable next button');
      cy.viewport(300, 300);

      cy.findByRole('button', { name: 'Next Page' }).should('not.be.disabled');
      cy.findByRole('button', { name: 'Previous Page' }).should(
        'not.be.disabled'
      );
    });
  });

  describe('FXL layout', () => {
    beforeEach(() => {
      cy.loadPage('/html/fxl-poems');
    });

    it('Paginated mode & at the start of the book previous page button should be disabled', () => {
      cy.findByRole('button', { name: 'Next Page' }).should('not.be.disabled');
      cy.findByRole('button', { name: 'Previous Page' }).should('be.disabled');

      cy.findByRole('button', { name: 'Settings' }).click();
      cy.findByText('Paginated').click();

      cy.findByRole('button', { name: 'Next Page' }).should('not.be.disabled');
      cy.findByRole('button', { name: 'Previous Page' }).should('be.disabled');
    });

    it.only('Paginated mode & at the end of the book the next page button should be disabled', () => {
      cy.findByRole('button', { name: 'Settings' }).click();
      cy.findByText('Paginated').click();

      cy.findByRole('button', { name: 'Table of Contents' }).click();

      cy.log('move to last chapter and last page');
      cy.findByRole('menuitem', { name: /(Everyone Sang)/ }).click();

      cy.findByRole('button', { name: 'Next Page' }).should('be.disabled');
      cy.findByRole('button', { name: 'Previous Page' }).should(
        'not.be.disabled'
      );

      cy.log('Press the Previous page button to reveal the next page button');
      cy.findByRole('button', { name: 'Previous Page' }).click();

      cy.wait(1000);

      cy.findByRole('button', { name: 'Next Page' }).should('not.be.disabled');
      cy.findByRole('button', { name: 'Previous Page' }).should(
        'not.be.disabled'
      );

      cy.log('Should work for mobile screen');
      cy.viewport(300, 300);

      cy.wait(1000);

      cy.findByRole('button', { name: 'Next Page' }).click();
      cy.findByRole('button', { name: 'Next Page' }).should('be.disabled');
      cy.findByRole('button', { name: 'Previous Page' }).should(
        'not.be.disabled'
      );

      cy.wait(1000);

      cy.log('Should work for tablet screen');
      cy.viewport(630, 300);
      cy.wait(1000);

      cy.findByRole('button', { name: 'Previous Page' }).click();
      cy.findByRole('button', { name: 'Previous Page' }).should(
        'not.be.disabled'
      );
      cy.findByRole('button', { name: 'Next Page' }).should('not.be.disabled');

      cy.wait(1000);
      cy.findByRole('button', { name: 'Next Page' }).click();
      cy.findByRole('button', { name: 'Next Page' }).should('be.disabled');
      cy.findByRole('button', { name: 'Previous Page' }).should(
        'not.be.disabled'
      );
    });
  });
});
