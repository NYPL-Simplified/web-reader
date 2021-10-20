/// <reference types="cypress" />
import '@testing-library/cypress/add-commands';
import { IFRAME_SELECTOR } from './constants';

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Cypress {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    interface Chainable<Subject = any> {
      loadPage(pageName: string): void;
      getIframeHtml(selector?: string): Chainable<Subject>;
      getIframeHead(selector?: string): Chainable<Subject>;
      getIframeBody(selector?: string): Chainable<Subject>;
      loadPdf(path: '/pdf' | '/pdf-collection'): Chainable<Subject>;
    }
  }
}

Cypress.Commands.add('loadPage', (pageName) => {
  cy.visit(pageName, {
    onBeforeLoad: (win) => {
      win.sessionStorage.clear(); // clear storage so that we are always on page one
    },
  });
});

Cypress.Commands.add('getIframeHtml', (selector: string = IFRAME_SELECTOR) => {
  return cy
    .get(selector, { timeout: 30000 })
    .its('0.contentDocument.documentElement')
    .should('not.be.empty')
    .then(cy.wrap);
});

Cypress.Commands.add('getIframeHead', (selector: string = IFRAME_SELECTOR) => {
  return cy
    .get(selector, { timeout: 15000 })
    .its(`0.contentDocument.head`)
    .should('not.be.empty')
    .then(cy.wrap);
});

Cypress.Commands.add('getIframeBody', (selector: string = IFRAME_SELECTOR) => {
  return cy
    .get(selector, { timeout: 15000 })
    .its(`0.contentDocument.body`)
    .should('not.be.empty')
    .then(cy.wrap);
});

Cypress.Commands.add('loadPdf', (path: '/pdf' | '/pdf-collection') => {
  const pdfProxyInterceptUrl =
    Cypress.config().baseUrl === 'http://localhost:1234'
      ? 'http://localhost:3001'
      : 'https://drb-api-qa.nypl.org/utils';
  cy.intercept('GET', `${pdfProxyInterceptUrl}/**`).as('pdf');
  cy.visit(path, {
    onBeforeLoad: (win) => {
      win.sessionStorage.clear(); // clear storage so that we are always on page one
    },
  });
  cy.wait('@pdf', { timeout: 20000 });
  cy.get('#iframe-wrapper')
    .find('div[class="react-pdf__Page__textContent"]', { timeout: 10000 })
    .should('have.attr', 'style');
});
