import { IFRAME_SELECTOR } from '../../support/constants';

describe('navigating an EPUB page using internal link', () => {
  beforeEach(() => {
    cy.loadPage('/moby-epub2');

    // Use a consistent viewport
    cy.viewport(1024, 768);
  });

  it('navigates user using the internal TOC link on the page', () => {
    cy.log('Go to a page with TOC');

    cy.findByRole('button', { name: 'Table of Contents' }).click();
    cy.findByLabelText('MOBY-DICK; or, THE WHALE.').click();

    cy.wait(3000);

    cy.log('Go to ETYMOLOGY');
    cy.getIframeBody(IFRAME_SELECTOR)
      .find('.toc a', { timeout: 3000 })
      .contains(/^ETYMOLOGY\.$/)
      .click();

    cy.getIframeBody(IFRAME_SELECTOR)
      .find('h4', { timeout: 3000 })
      .contains('Original Transcriber’s Notes:');
  });
});
