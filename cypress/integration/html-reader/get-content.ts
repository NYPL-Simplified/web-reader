describe('getContent', () => {
  it('getContent returns HTML', () => {
    cy.visit('/test/get-content');
    cy.getIframeBody()
      .find('p')
      .should('include.text', '/samples/moby-epub2-exploded/OEBPS/');
  });
});
