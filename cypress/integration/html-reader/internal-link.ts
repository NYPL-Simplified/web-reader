import { IFRAME_SELECTOR } from '../../support/constants';

describe('navigating an EPUB page using internal link', () => {
  beforeEach(() => {
    // FIXME: Ignore random reader bug for now, remove this after [OE-300]
    cy.on('uncaught:exception', (err, runnable) => {
      return false;
    });

    cy.visit('moby-epub2', {
      onBeforeLoad: (win) => {
        win.sessionStorage.clear(); // clear storage so that we are always on page one
      },
    });
  });

  it('navigates user using the internal TOC link on the page', () => {
    cy.log('Go to a page with TOC');

    cy.getIframeBody(IFRAME_SELECTOR)
      .find('img', { timeout: 5000 })
      .should('have.attr', 'alt', 'Cover');

    cy.findByRole('button', { name: 'Table of Contents' }).should('exist');

    cy.findByRole('button', { name: 'Table of Contents' }).click();
    cy.findByLabelText('MOBY-DICK; or, THE WHALE.').click();

    cy.wait(3000);

    cy.findByRole('button', { name: 'Next Page' }).should('exist');
    cy.findByRole('button', { name: 'Next Page' }).click();

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
