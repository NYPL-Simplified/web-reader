import { IFRAME_SELECTOR } from '../../support/constants';

describe('navigating an EPUB page using internal link', () => {
  beforeEach(() => {
    // FIXME: Ignore random reader bug for now, remove this after [OE-300]
    cy.on('uncaught:exception', (err, runnable) => {
      return false;
    });

    cy.loadPage('/moby-epub2');
  });

  it('Paginated mode & internal links should navigates users', () => {
    cy.log('Go to a page with TOC');

    cy.findByRole('button', { name: 'Table of Contents' }).click();
    cy.findByLabelText('MOBY-DICK; or, THE WHALE.').click();

    cy.wait(3000);

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

  it('Scrolling mode & internal links should navigates users', () => {
    cy.log('Go to a page with TOC');

    cy.findByRole('button', { name: 'Table of Contents' }).click();
    cy.findByLabelText('MOBY-DICK; or, THE WHALE.').click();

    cy.wait(3000);

    cy.findByRole('button', { name: 'Settings' }).click();
    cy.findByText('Scrolling').click();

    cy.wait(1000);

    cy.log('Go to Chapter 133');
    cy.getIframeBody(IFRAME_SELECTOR)
      .find('.toc a', { timeout: 3000 })
      .contains(/^CHAPTER 133. The Chase—First Day\.$/)
      .click();

    cy.wait(1000);

    cy.getIframeBody(IFRAME_SELECTOR)
      .find('h2', { timeout: 3000 })
      .contains('CHAPTER 133. The Chase—First Day');
  });
});
