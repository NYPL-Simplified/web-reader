/// <reference types="cypress" />
import '@testing-library/cypress/add-commands';

type IframeOptions = {
  getDocument?: boolean;
};

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Cypress {
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
  const DEFAULT_OPTIONS = { getDocument: false }; // By default, it returns the iframe 'body' content instead of the iframe document object

  const ops = { ...DEFAULT_OPTIONS, ...options };

  return cy
    .get(selector)
    .its(`0.contentDocument${ops.getDocument ? '' : '.body'}`)
    .should('not.be.empty')
    .then(cy.wrap);
});
