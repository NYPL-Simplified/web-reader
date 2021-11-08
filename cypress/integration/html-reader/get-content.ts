import { IFRAME_SELECTOR } from '../../support/constants';
import describev1v2 from '../../support/describev1v2';

describev1v2('getContent', () => {
  it('getContent returns HTML', () => {
    cy.loadPage('/test/get-content');
    cy.getIframeBody(IFRAME_SELECTOR)
      .find('p')
      .should('include.text', '/samples/moby-epub2-exploded/OEBPS/');
  });
});
