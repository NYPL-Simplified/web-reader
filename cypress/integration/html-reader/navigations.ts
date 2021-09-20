// import { IFRAME_SELECTOR } from '../../support/constants';

// describe('navigating an EPUB page', () => {
//   beforeEach(() => {
//     cy.loadPage('/streamed-alice-epub');
//   });

//   it('should contain the NYPL homepage url', () => {
//     cy.findByRole('link', { name: 'Return to NYPL' }).should(
//       'have.prop',
//       'href',
//       'https://www.nypl.org/'
//     );
//   });

//   it('should update page content after clicking on TOC link', () => {
//     cy.iframe(IFRAME_SELECTOR)
//       .findByRole('img', {
//         name: "Alice's Adventures in Wonderland, by Lewis Carroll",
//       })
//       .should('exist');

//     cy.iframe(IFRAME_SELECTOR)
//       .findByText('Down the Rab­bit-Hole')
//       .should('not.exist');

//     // Open TOC menu
//     cy.findByRole('button', { name: 'Table of Contents' }).click();

//     // Open chapter 1
//     cy.findByRole('menuitem', { name: 'I: Down the Rab­bit-Hole' }).click();

//     cy.log('briefly see the loading indicator');
//     cy.get('#reader-loading').should('be.visible');
//     cy.get('#reader-loading').should('not.be.visible');

//     cy.iframe(IFRAME_SELECTOR)
//       .findByText('Down the Rab­bit-Hole')
//       .should('exist');
//   });

//   it.only('should navigate forward and backwards with page buttons', () => {
//     cy.log('make sure we are on the homepage');
//     cy.iframe(IFRAME_SELECTOR)
//       .findByRole('img', {
//         name: "Alice's Adventures in Wonderland, by Lewis Carroll",
//       })
//       .should('exist');

//     cy.findByRole('button', { name: 'Settings' }).click();
//     // let's make sure we are on paginated mode
//     cy.findByText('Paginated').click();

//     cy.findByRole('button', { name: 'Next Page' }).click();

//     cy.log('Should briefly see the Loading indicator');
//     cy.get('#reader-loading').should('be.visible');
//     cy.get('#reader-loading').should('not.be.visible');

//     cy.log('Then we see the next page');
//     cy.iframe(IFRAME_SELECTOR, { timeout: 30000 })
//       .findByRole('img', {
//         name: 'The Standard Ebooks logo',
//         timeout: 30000,
//       })
//       .should('exist');

//     cy.iframe(IFRAME_SELECTOR)
//       .findByRole('img', {
//         name: "Alice's Adventures in Wonderland, by Lewis Carroll",
//         timeout: 20000,
//       })
//       .should('not.exist');

//     cy.findByRole('button', { name: 'Previous Page' }).click();

//     cy.log('Should briefly see the Loading indicator');
//     cy.get('#reader-loading').should('be.visible');
//     cy.get('#reader-loading').should('not.be.visible');

//     cy.log('Then we see the next page');
//     cy.iframe(IFRAME_SELECTOR)
//       .findByRole('img', {
//         name: "Alice's Adventures in Wonderland, by Lewis Carroll",
//       })
//       .should('exist');

//     // TODO: Test whether the next or the previous button is visible when
//     // we are on the first page or last page, respectively.
//   });
// });
