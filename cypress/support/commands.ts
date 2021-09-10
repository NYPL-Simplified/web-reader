/// <reference types="cypress" />
import '@testing-library/cypress/add-commands';

type IframeOptions = {
  timeout?: number;
};

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Cypress {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    interface Chainable<Subject = any> {
      loadPage(pageName: string): void;
      iframe(selector: string, options?: IframeOptions): Chainable<Subject>;
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
    timeout: 4000,
  };

  const ops = { ...DEFAULT_OPTIONS, ...options };

  return cy
    .get(selector, { timeout: ops.timeout })
    .its(`0.contentDocument`)
    .should('not.be.empty')
    .then(cy.wrap);
});
