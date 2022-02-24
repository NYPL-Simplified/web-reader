describe('display settings', () => {
  beforeEach(() => {
    cy.loadPage('/streamed-alice-epub');
  });

  it('should have the default settings', () => {
    cy.get('#reader-loading').should('not.be.visible');
    // without this wait we are getting "element is detached from dom" errors
    cy.wait(3000);
    cy.getIframeHtml()
      .should('have.attr', 'data-viewer-font', 'publisher')
      .should('have.css', '--USER__appearance', 'readium-default-on')
      .should('have.css', '--USER__fontFamily', 'Original')
      .should('have.css', '--USER__scroll', 'readium-scroll-off');
  });

  it('should update the font family to serif, scroll mode, and on sepia theme', () => {
    cy.log('open the settings menu');
    cy.findByRole('button', { name: 'Settings' }).click();

    cy.findByText('Serif').click();
    cy.findByText('Scrolling').click();
    cy.findByText('Sepia').click();

    cy.getIframeHtml()
      .should('have.attr', 'data-viewer-font', 'serif')
      .should('have.css', '--USER__appearance', 'readium-sepia-on')
      .should('have.css', '--USER__scroll', 'readium-scroll-on');
  });

  it('should trigger font size setting', () => {
    cy.getIframeHtml().should('not.have.css', '--USER__fontSize'); // by default, there's no font size set on the page

    cy.findByRole('button', { name: 'Settings' }).click();
    cy.findByRole('button', { name: 'Decrease font size' }).click();

    cy.getIframeHtml().should('have.css', '--USER__fontSize', '96%'); // 4% per step?
  });

  it('should stay on the same page when switching between reading modes', () => {
    cy.log('Make sure we are on paginated mode');
    cy.findByRole('button', { name: 'Settings' }).click();
    cy.findByText('Paginated').click();

    cy.findByRole('button', { name: 'Table of Contents' }).click();

    cy.log('open chapter 1');
    cy.findByRole('menuitem', { name: 'I: Down the Rab­bit-Hole' }).click();

    cy.wait(1000);

    cy.getIframeHtml()
      .find('h2')
      .contains('I Down the Rab­bit-Hole')
      .should('be.visible');

    cy.log('switch to scrolling mode');
    cy.findByRole('button', { name: 'Settings' }).click();
    cy.findByText('Scrolling').click();

    cy.getIframeHtml()
      .find('h2')
      .contains('I Down the Rab­bit-Hole')
      .should('be.visible');
  });
});
