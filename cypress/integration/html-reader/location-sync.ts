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

  cy.log('Go back home and to another book and then back');
  cy.visit('/');
  cy.findByRole('link', { name: 'Moby Dick' }).click();
  cy.wait(1000);
  cy.findByRole('button', { name: 'Table of Contents' }).click();
  cy.wait(1000);
  cy.findByRole('menuitem', { name: 'CHAPTER 5. Breakfast.' }).click();
  cy.getIframeBody()
    .find('h2')
    .contains('CHAPTER 5. Breakfast.')
    .should('be.visible');

  cy.log('Go back home and to original Moby Epub 3 book');
  cy.visit('/');
  cy.findByRole('link', { name: 'Moby Dick (EPUB 3)' }).click();
  cy.wait(1000);
  cy.log('Should be on Chapter 10');
  cy.getIframeBody()
    .find('h1')
    .contains('Chapter 10. A Bosom Friend.')
    .should('be.visible');

  cy.log('Go back to Moby Dick EPUB 2');
  cy.visit('/html/moby-epub2');

  cy.log('Should be on Chapter 5');
  cy.getIframeBody()
    .find('h2')
    .contains('CHAPTER 5. Breakfast.')
    .should('be.visible');
});
