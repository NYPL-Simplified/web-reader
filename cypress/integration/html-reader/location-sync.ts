it('should remember location between page visits', () => {
  cy.visit('/html/moby-epub3', {
    onBeforeLoad: (win) => {
      win.localStorage.clear();
    },
  });

  // navigate to some page
  cy.findByRole('button', { name: 'Table of Contents' }).click();
  cy.wait(1000);
  cy.findByRole('menuitem', { name: 'Chapter 10. A Bosom Friend.' }).click();
  cy.wait(1000);

  cy.getIframeBody()
    .find('h1')
    .contains('Chapter 10. A Bosom Friend.')
    .should('be.visible');

  cy.log('Go to to another book');
  cy.visit('/html/moby-epub2');
  cy.wait(1000);
  cy.findByRole('button', { name: 'Table of Contents' }).click();
  cy.wait(1000);
  cy.findByRole('menuitem', { name: 'CHAPTER 5. Breakfast.' }).click();
  cy.getIframeBody()
    .find('h2')
    .contains('CHAPTER 5. Breakfast.')
    .should('be.visible');

  cy.log('Go back to original Moby Epub 3 book');
  cy.visit('/html/moby-epub3');
  cy.wait(1000);
  cy.log('Should be on Chapter 10');
  cy.getIframeBody()
    .find('h1')
    .contains('Chapter 10. A Bosom Friend.')
    .should('be.visible');

  cy.log('Go back to Moby Dick EPUB 2');
  cy.visit('/html/moby-epub2');
  cy.wait(1000);

  cy.log('Should be on Chapter 5');
  cy.getIframeBody()
    .find('h2')
    .contains('CHAPTER 5. Breakfast.')
    .should('be.visible');
});

it('should not remember location if `persistLastLocation` is disabled', () => {
  cy.visit('/html/moby-epub3', {
    onBeforeLoad: (win) => {
      win.localStorage.clear();
    },
  });

  cy.log('should remember by default');
  // navigate to some page
  cy.findByRole('button', { name: 'Table of Contents' }).click();
  cy.wait(1000);
  cy.findByRole('menuitem', { name: 'Chapter 10. A Bosom Friend.' }).click();
  cy.wait(1000);

  cy.getIframeBody()
    .find('h1')
    .contains('Chapter 10. A Bosom Friend.')
    .should('be.visible');

  cy.visit('/html/moby-epub3-no-local-storage');
  // navigate to some page
  cy.findByRole('button', { name: 'Table of Contents' }).click();
  cy.wait(1000);
  cy.findByRole('menuitem', { name: 'Chapter 2. The Carpet-Bag.' }).click();
  cy.wait(1000);

  cy.getIframeBody()
    .find('h1')
    .contains('Chapter 2. The Carpet-Bag.')
    .should('be.visible');

  cy.log('Now return to normal epub 3');
  cy.visit('/html/moby-epub3');
  cy.wait(1000);
  cy.log('Should be on Chapter 10');
  cy.getIframeBody()
    .find('h1')
    .contains('Chapter 10. A Bosom Friend.')
    .should('be.visible');

  // now check the non-remembering link
  cy.visit('/html/moby-epub3-no-local-storage');
  cy.wait(1000);
  cy.getIframeBody().find('img[alt="title page"]').should('be.visible');
});
