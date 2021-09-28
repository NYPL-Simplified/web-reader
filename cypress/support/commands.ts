/// <reference types="cypress" />
import '@testing-library/cypress/add-commands';

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Cypress {
    interface Chainable<Subject = any> {
      loadPage(pageName: string): void;
      iframe(selector: string): Chainable<Subject>;
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

Cypress.Commands.add('iframe', (selector: string, options?: IframeOptions) => {
  const DEFAULT_OPTIONS = {
    // Cypress default timeout
    timeout: 15000,
  };

  const ops = { ...DEFAULT_OPTIONS, ...options };

  return cy
    .get(selector ?? DEFAULT_SELECTOR)
    .its('0.contentDocument.body')
    .should('not.be.empty')
    .then(cy.wrap);
});
