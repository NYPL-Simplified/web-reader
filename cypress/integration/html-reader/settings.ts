describe('display settings', () => {
  beforeEach(() => {
    cy.loadPage('/html/streamed-alice-epub');
  });

  it('should have the default settings', () => {
    cy.getIframeBody()
      .findByRole('img', {
        name: "Alice's Adventures in Wonderland, by Lewis Carroll",
      })
      .should('exist');

    cy.getIframeHtml()
      .should('have.css', '--USER__appearance', 'readium-default-on')
      .should('have.css', '--USER__fontFamily', 'sans-serif')
      .should('have.css', '--USER__scroll', 'readium-scroll-off');
  });

  it('should update the font family to serif, scroll mode, and on sepia theme', () => {
    cy.log('open the settings menu');
    cy.findByRole('button', { name: 'Settings' }).click();

    cy.findByText('Serif').click();
    cy.getIframeHtml().should('have.css', '--USER__fontFamily', 'serif');

    cy.findByText('Scrolling').click();
    cy.getIframeHtml().should(
      'have.css',
      '--USER__scroll',
      'readium-scroll-on'
    );

    cy.findByText('Sepia').click();
    cy.getIframeHtml().should(
      'have.css',
      '--USER__appearance',
      'readium-sepia-on'
    );
  });

  it('should trigger font size setting', () => {
    cy.getIframeHtml().should('have.css', '--USER__fontSize', '100%');

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
