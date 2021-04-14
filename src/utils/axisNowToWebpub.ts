/**
 * This file will convert the AxisNow encrypted ePub in
 * ../axisnow to a webpub manifest pointing to the same
 * encrypted resources.
 */

/**
 *
 * Normal Process
 *  - Use fulfillment link to get url pieces
 *  - Use a secret url template to fetch a license file
 *  - Use another secret url template to get the container.xml file
 *  - Convert that to webpub
 *
 * - Fetch the fulfillment link, giving you the keys you need to get the license file
 * - Get the keys for the license file.
 * - Source the content.opf file
 * - Either build a publication or just directly build a webpub manifest
 */
const f = require('node-fetch');

if (!globalThis.fetch) {
  globalThis.fetch = f;
}

const CONTAINER_URL_TEMPLATE =
  'https://node.axisnow.com/content/stream/{isbn}/META-INF/container.xml';

const ISBN = 9781467784870;

const containerUrl = CONTAINER_URL_TEMPLATE.replace('{isbn}', `${ISBN}`);
const fullContentOpfUrl =
  'https://node.axisnow.com/content/stream/9781467784870/OEBPS/content.opf';

console.log(`Container Url: ${containerUrl}`);
console.log(`Content.opf url: ${fullContentOpfUrl}`);

fetch(containerUrl).then(async (response) => {
  const text = await response.text();
  console.log('Container File: ');
  console.log(text);

  const res = await fetch(fullContentOpfUrl);
  const opf = await res.text();
  console.log('OPF:');
  console.log(opf);
});
