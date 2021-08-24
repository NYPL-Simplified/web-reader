/// <reference types="cypress" />
import '@testing-library/cypress/add-commands';
import 'cypress-iframe';

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Cypress {
    interface Chainable<Subject = any> {
      loadPage(pageName: string): void;
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
