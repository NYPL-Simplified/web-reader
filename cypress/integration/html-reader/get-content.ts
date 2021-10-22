import { IFRAME_SELECTOR } from '../../support/constants';

describe('getContent', () => {
  it('getContent returns HTML', () => {
    cy.loadPage('/test/get-content');
    cy.getIframeBody(IFRAME_SELECTOR)
      .find('p')
      .should('include.text', '/samples/moby-epub2-exploded/OEBPS/');
  });
});
