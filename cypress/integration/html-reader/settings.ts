// import { IFRAME_SELECTOR } from '../../support/constants';

// describe('display dettings', () => {
//   beforeEach(() => {
//     cy.loadPage('/streamed-alice-epub');
//   });

//   it('should have the default settings', () => {
//     cy.log('briefly see the loading indicator');
//     cy.get('#reader-loading').should('be.visible');
//     cy.get('#reader-loading').should('not.be.visible');

//     cy.iframe(IFRAME_SELECTOR).within(() => {
//       // We need to wrap it with within to get the proper context
//       cy.get('html')
//         .should('have.attr', 'data-viewer-font', 'publisher')
//         .should('have.css', '--USER__appearance', 'readium-default-on')
//         .should('have.css', '--USER__fontFamily', 'Original')
//         .should('have.css', '--USER__scroll', 'readium-scroll-on');
//     });
//   });

//   it('should update the font family to serif, paginated mode, and on sepia theme', () => {
//     // Open the settings
//     cy.findByRole('button', { name: 'Settings' }).click();

//     cy.findByText('Serif').click();
//     cy.findByText('Paginated').click();
//     cy.findByText('Sepia').click();

//     cy.iframe(IFRAME_SELECTOR).within(() => {
//       cy.get('html')
//         .should('have.attr', 'data-viewer-font', 'serif')
//         .should('have.css', '--USER__appearance', 'readium-sepia-on')
//         .should('have.css', '--USER__scroll', 'readium-scroll-off');
//     });
//   });

//   it('should trigger font size setting', () => {
//     cy.iframe(IFRAME_SELECTOR).within(() => {
//       cy.get('html').should('not.have.css', '--USER__fontSize'); // by default, there's no font size set on the page
//     });

//     cy.findByRole('button', { name: 'Settings' }).click();
//     cy.findByRole('button', { name: 'Decrease font size' }).click();

//     cy.iframe(IFRAME_SELECTOR).within(() => {
//       cy.get('html').should('have.css', '--USER__fontSize', '96%'); // 4% per step?
//     });
//   });
// });
