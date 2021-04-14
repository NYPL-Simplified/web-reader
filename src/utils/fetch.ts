/**
 * Utilities for fetching specific types
 */

export async function fetchJson<ExpectedResponse extends any = any>(
  url: string
) {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error('Response not Ok for URL: ' + url);
  }
  return (await response.json()) as ExpectedResponse;
}
