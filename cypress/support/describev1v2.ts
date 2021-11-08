/**
 * A describe function that runs the tests for both the v1 and v2 HTML Reader.
 */
export default function describev1v2(desc: string, tests: () => void): void {
  // set the cypress base url to include either v1 or v2.
  const baseUrl = Cypress.config('baseUrl');

  // run tests for v1
  const v1BaseUrl = `${baseUrl}/v1`;
  Cypress.config('baseUrl', v1BaseUrl);
  describe(`R2D2BC - ${desc}`, tests);

  // run tests for v2
  const v2BaseUrl = `${baseUrl}/v2`;
  Cypress.config('baseUrl', v1BaseUrl);
  describe(`New HTML Renderer - ${desc}`, tests);
}
