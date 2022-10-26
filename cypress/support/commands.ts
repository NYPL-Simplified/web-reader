/* eslint-disable @typescript-eslint/no-unused-expressions */
/// <reference types="cypress" />
import '@testing-library/cypress/add-commands';

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Cypress {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    interface Chainable<Subject = any> {
      loadPage(
        pageName:
          | '/html/moby-epub2'
          | '/html/moby-epub3'
          | '/html/axisnow-encrypted'
          | '/html/axisnow-decrypted'
          | '/html/fxl-poems'
          | '/html/test/no-injectables'
          | '/html/test/with-reflowable-layout'
          | '/html/test/with-script-injectable'
          | '/html/test/with-fixed-layout'
          | '/html/test/get-content'
          | '/html/streamed-alice-epub'
          | '/html/test/unparsable-manifest'
          | '/html/test/missing-resource'
          | '/html/test/missing-injectable'
      ): void;
      getIframeHtml(): Chainable<JQuery<HTMLIFrameElement>>;
      getIframeHead(): Chainable<Subject>;
      getIframeBody(): Chainable<JQuery<HTMLBodyElement>>;
      finishNavigation(): void;
      loadPdf(
        path: '/pdf/single-resource-short' | '/pdf/collection'
      ): Chainable<Subject>;
    }
  }
}

const pagesUsingAliceInWonderlandExample: string[] = [
  '/html/streamed-alice-epub',
  '/html/test/with-reflowable-layout',
  '/html/test/with-script-injectable',
  '/html/test/no-injectables',
];

Cypress.Commands.add('loadPage', (pageName) => {
  const resourceInterceptUrl = pagesUsingAliceInWonderlandExample.includes(
    pageName
  )
    ? 'https://alice.dita.digital/**'
    : '/samples/**';

  cy.intercept(resourceInterceptUrl, { middleware: true }, (req) => {
    req.on('before:response', (res) => {
      // force all API responses to not be cached
      res.headers['cache-control'] = 'no-store';
    });
  }).as('sample');
  cy.visit(pageName, {
    // re-enable this once we start storing location and settings in storage.
    // onBeforeLoad: (win) => {
    //   win.sessionStorage.clear(); // clear storage so that we are always on page one
    // },
  });
  cy.findByRole('progressbar', { name: 'Loading book...' }).should('exist');
  cy.wait('@sample', { timeout: 20000 }).then((interception) => {
    assert.isNotNull(interception?.response?.body, 'API call has data');
  });
  cy.findByRole('progressbar', { name: 'Loading book...' }).should('not.exist');
});

/**
 * Ensures the iframe has loaded and is not on about:blank since
 * chrome starts iframes as loaded on about:blank.
 */
const isIframeLoaded = ($iframe: HTMLIFrameElement) => {
  const contentWindow = $iframe.contentWindow;
  const src = $iframe.src;
  const href = contentWindow?.location.href;
  if (contentWindow?.document.readyState === 'complete') {
    return href !== 'about:blank' || src === 'about:blank' || src === '';
  }
  return false;
};

Cypress.Commands.add('getIframeHtml', { prevSubject: false }, () => {
  Cypress.log({
    name: 'Get Iframe HTML',
    // shorter name for the Command Log
    displayName: 'getIframeHtml',
    message: `Get the iframe html, and wait for it to load.`,
  });

  return (
    cy
      .get('iframe', { log: false })
      // .its('0')
      // .should(isIframeLoaded)
      // .its('contentDocument', { log: false })
      // .should('not.be.empty')
      // .then((html) => {
      //   return cy.wrap(html, { log: false });
      // });
      .should(($frame) => {
        const readyState = $frame.prop('contentWindow').document.readyState;
        expect(readyState).to.eq('complete');
        const body = $frame.contents().find('body');
        // eslint-disable-next-line @typescript-eslint/no-unused-expressions
        expect(body).to.not.be.empty;
      })
      .its('0.contentDocument.documentElement', { log: false })
      .then(($el) => cy.wrap($el, { log: false }))
  );
});

Cypress.Commands.add('getIframeHead', { prevSubject: false }, () => {
  Cypress.log({
    name: 'Get Iframe Head',
    // shorter name for the Command Log
    displayName: 'getIframeHead',
    message: `Get the iframe head, and wait for it to load.`,
  });

  return cy
    .get('iframe', { log: false })
    .its('0', { log: false })
    .should(isIframeLoaded)
    .its('contentDocument.head', { log: false })
    .then(($el) => cy.wrap($el, { log: false }));
});

Cypress.Commands.add('getIframeBody', { prevSubject: false }, () => {
  Cypress.log({
    name: 'Get Iframe Body',
    // shorter name for the Command Log
    displayName: 'getIframeBody',
    message: `Get the iframe body, and wait for it to load.`,
  });

  return cy
    .get('iframe', { log: false })
    .its('0', { log: false })
    .should(isIframeLoaded)
    .its('contentDocument.body', { log: false })
    .should('not.be.empty')
    .then(($el) => cy.wrap($el, { log: false }));
});

Cypress.Commands.add('finishNavigation', { prevSubject: false }, () => {
  // we use this to simply wait for the user to be scrolled to wherever they need to be.
  // any other method would be very tough to use.
  cy.wait(100);
});

Cypress.Commands.add(
  'loadPdf',
  (path: '/pdf/single-resource-short' | '/pdf/collection') => {
    const pdfProxyInterceptUrl =
      Cypress.config().baseUrl === 'http://localhost:1234'
        ? 'http://localhost:3001'
        : 'https://drb-api-qa.nypl.org/utils';
    cy.intercept(`${pdfProxyInterceptUrl}/**`, { middleware: true }, (req) => {
      req.on('before:response', (res) => {
        // force all API responses to not be cached
        res.headers['cache-control'] = 'no-store';
      });
    }).as('pdf');
    cy.visit(path, {
      onBeforeLoad: (win) => {
        win.sessionStorage.clear(); // clear storage so that we are always on page one
      },
    });
    cy.wait('@pdf', { timeout: 50000 });
    cy.get('#iframe-wrapper')
      .find('div[class="react-pdf__Page__textContent"]', { timeout: 10000 })
      .should('have.attr', 'style');
  }
);
