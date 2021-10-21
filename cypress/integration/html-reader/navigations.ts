import { IFRAME_SELECTOR } from '../../support/constants';

describe('navigating an EPUB page', () => {
  beforeEach(() => {
    cy.loadPage('/moby-epub2');
  });

  it('should contain a link to return to the homepage', () => {
    cy.findByRole('link', { name: 'Return to Homepage' }).should(
      'have.prop',
      'href',
      `${Cypress.config().baseUrl}/`
    );
  });

  it('Should navigate forward and backwards with page buttons', () => {
    cy.intercept('GET', '/samples/moby-epub2-exploded/OEBPS/**').as('imprint');
    cy.intercept('GET', '/samples/moby-epub2-exploded/OEBPS/wrap0000.html').as(
      'cover'
    );

    cy.log('make sure we are on the homepage');
    cy.getIframeBody(IFRAME_SELECTOR)
      .find('img')
      .should('have.attr', 'alt', 'Cover');

    cy.findByRole('button', { name: 'Settings' }).click();
    cy.log('make sure we are on paginated mode');
    cy.findByText('Paginated').click();

    cy.findByRole('button', { name: 'Next Page' }).click();

    // FIXME: Uncomment the following once https://jira.nypl.org/browse/SFR-1332 is resolved
    //   cy.wait('@imprint', { timeout: 10000 }).then((interception) => {
    //     assert.isNotNull(
    //       interception?.response?.body,
    //       'imprint API call has data'
    //     );
    //   });

    //   cy.wait(3000);

    //   cy.log('then we see the imprint page');
    //   cy.getIframeBody(IFRAME_SELECTOR).contains(
    //     'div',
    //     '*** START OF THE PROJECT GUTENBERG EBOOK MOBY-DICK; OR THE WHALE ***'
    //   );

    //   cy.findByRole('button', { name: 'Previous Page' }).click();

    //   cy.wait('@cover', { timeout: 10000 }).then((interception) => {
    //     assert.isNotNull(interception?.response?.body, 'cover API call has data');
    //   });

    //   cy.wait(3000);

    //   cy.log('make sure we are back on the homepage');
    //   cy.getIframeBody(IFRAME_SELECTOR)
    //     .find('img')
    //     .should('have.attr', 'alt', 'Cover');
  });
});
