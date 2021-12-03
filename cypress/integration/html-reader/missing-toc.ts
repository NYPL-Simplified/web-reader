import { IFRAME_SELECTOR } from '../../support/constants';

describe('missing-toc', () => {
  it('Shows mssing TOC message', () => {
    cy.visit('/test/missing-toc');
    cy.getIframeBody(IFRAME_SELECTOR)
      .find('h1')
      .should('include.text', 'missing Table of Contents');

    cy.log('open TOC menu');
    cy.findByRole('button', { name: 'Table of Contents' }).click();

    cy.findByRole('menu').should(
      'include.text',
      'This publication does not have a Table of Contents'
    );
  });
});
