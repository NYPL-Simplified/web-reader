export async function fetchJson(url: string) {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error('Response not Ok for URL: ' + url);
  }
  return await response.json();
}
