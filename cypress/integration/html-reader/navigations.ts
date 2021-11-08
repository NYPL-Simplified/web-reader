import { IFRAME_SELECTOR } from '../../support/constants';
import describev1v2 from '../../support/describev1v2';

describev1v2('navigating an EPUB page', () => {
  beforeEach(() => {
    cy.loadPage('/streamed-alice-epub');
  });

  it('should contain a link to return to the homepage', () => {
    cy.findByRole('link', { name: 'Return to Homepage' }).should(
      'have.prop',
      'href',
      `${Cypress.config().baseUrl?.replace('/v1', '').replace('/v2', '')}/`
    );
  });

  // FIXME: Finish writing this test once https://jira.nypl.org/browse/SFR-1332 is resolved
  it('Should navigate forward and backwards with page buttons', () => {
    cy.log('make sure we are on the homepage');
    cy.getIframeBody(IFRAME_SELECTOR)
      .find('img')
      .should(
        'have.attr',
        'alt',
        "Alice's Adventures in Wonderland, by Lewis Carroll"
      );

    cy.findByRole('button', { name: 'Settings' }).click();
    cy.log('make sure we are on paginated mode');
    cy.findByText('Paginated').click();

    cy.findByRole('button', { name: 'Next Page' }).click();
  });
});
