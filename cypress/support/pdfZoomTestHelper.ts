export const pdfZoomTestHelper = (
  $elm: JQuery<HTMLElement>,
  expectedValueX: string,
  expectedValueY: string
): void => {
  cy.window().then((win) => {
    const styles = win.getComputedStyle($elm[0]);
    const scaleX = styles.getPropertyValue('--chakra-scale-x');
    const scaleY = styles.getPropertyValue('--chakra-scale-y');
    expect(scaleX).to.eq(expectedValueX);
    expect(scaleY).to.eq(expectedValueY);
  });
};
