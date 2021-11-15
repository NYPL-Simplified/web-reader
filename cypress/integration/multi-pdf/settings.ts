import { SCALE_STEP } from '../../support/constants';
import { pdfZoomTestHelper } from '../../support/pdfZoomTestHelper';

describe('Multi PDF display settings', () => {
  beforeEach(() => {
    cy.loadPdf('/pdf-collection');
    cy.log('open the settings menu');
    cy.findByRole('button', { name: 'Settings' }).click();
  });

  it('should have the default settings', () => {
    cy.findByRole('radio', { name: 'Paginated' }).should('be.checked');
    cy.findByRole('radio', { name: 'Scrolling' }).should('not.be.checked');
  });

  it('should not have font or theme display settings', () => {
    cy.findByRole('radiogroup', { name: 'text font options' }).should(
      'not.exist'
    );
    cy.findByRole('radiogroup', { name: 'reading theme options' }).should(
      'not.exist'
    );
    cy.findByRole('button', { name: 'Decrease font size' }).should('not.exist');
    cy.findByRole('button', { name: 'Increase font size' }).should('not.exist');
  });

  it('should zoom in and out', () => {
    cy.get('.react-pdf__Page').then(($elm) => {
      pdfZoomTestHelper($elm, '1', '1');
    });

    cy.findByRole('button', { name: 'Zoom In' }).click();
    cy.get('.react-pdf__Page').then(($elm) => {
      pdfZoomTestHelper($elm, `${1 + SCALE_STEP}`, `${1 + SCALE_STEP}`);
    });

    cy.findByRole('button', { name: 'Zoom Out' }).click();
    cy.get('.react-pdf__Page').then(($elm) => {
      pdfZoomTestHelper($elm, '1', '1');
    });
  });
});
