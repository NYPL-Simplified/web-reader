/**
 * Utilities for fetching specific types
 */

export async function fetchJson<ExpectedResponse extends unknown = unknown>(
  url: string
): Promise<ExpectedResponse> {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error('Response not Ok for URL: ' + url);
  }
  try {
    return (await response.json()) as ExpectedResponse;
  } catch (e) {
    throw new Error(`Network Error: Unparsable JSON file found at ${url}.`);
  }
}
