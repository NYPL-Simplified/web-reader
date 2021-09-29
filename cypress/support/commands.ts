/// <reference types="cypress" />
import '@testing-library/cypress/add-commands';

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Cypress {
    interface Chainable<Subject = any> {
      loadPage(pageName: string): void;
      getIframeHtml(selector: string): Chainable<Subject>;
      getIframeHead(selector: string): Chainable<Subject>;
      getIframeBody(selector: string): Chainable<Subject>;
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

Cypress.Commands.add('getIframeHtml', (selector: string) => {
  return cy
    .get(selector, { timeout: 15000 })
    .its('0.contentDocument.documentElement')
    .should('not.be.empty')
    .then(cy.wrap);
});

Cypress.Commands.add('getIframeHead', (selector: string) => {
  return cy
    .get(selector, { timeout: 15000 })
    .its(`0.contentDocument.head`)
    .should('not.be.empty')
    .then(cy.wrap);
});

Cypress.Commands.add('getIframeBody', (selector: string) => {
  return cy
    .get(selector, { timeout: 15000 })
    .its(`0.contentDocument.body`)
    .should('not.be.empty')
    .then(cy.wrap);
});
