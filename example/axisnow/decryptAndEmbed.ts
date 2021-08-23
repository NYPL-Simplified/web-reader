import Decryptor from '@nypl-simplified-packages/axisnow-access-control-web';

type DecryptChapter = (resourceUrl: string) => Promise<string>;

type DecryptorParams = {
  isbn: string;
  book_vault_uuid: string;
};

export default async function createChapterDecryptor(
  params: DecryptorParams
): Promise<DecryptChapter> {
  const decryptor = await Decryptor.createDecryptor(params);
  return decryptChapter(decryptor);
}

/**
 * Decrypts a chapter and all embedded resources
 *
 * TO DO:
 *  - How to release url objects we have created but no
 *    longer need? These should be released when going
 *    to next chapter. We can keep around a list of
 *    object urls for a given chapter and then call something
 *    to release them.
 *
 * ASSETS TO RE-EMBED:
 *  - images (done)
 *  - css (done)
 *  - css urls ?
 *  - js
 */
const decryptChapter = (decryptor: Decryptor) => async (
  url: string
): Promise<string> => {
  // get the chapter and decrypt it
  const chapterStr = await decryptor.decryptToString(url);

  // decrypt and embed image assets
  const withImages = await embedImageAssets(chapterStr, url, decryptor);

  // decrypt and embed css assets
  const withCss = await embedCssAssets(withImages, url, decryptor);

  return withCss;
};

/**
 * Gets the embedded image assets, fetches the blob, decrypts it, and
 * re-embeds it as an objectUrl
 */
async function embedImageAssets(
  unembeddedXml: string,
  resourceUrl: string,
  decryptor: Decryptor
) {
  const images =
    unembeddedXml.match(
      /(src="|href=")(?!https?:\/\/)\/?([^"]+\.(jpe?g|png|gif|bmp)")/g
    ) || [];

  // TODO: do this in parallel?
  for (const image of images) {
    // extract only the path and filename of image
    const srcImg = image.replace(/(src="|href=")/g, '').replace(/['"]+/g, '');
    // resolve to absolute url
    const imgUrl = new URL(srcImg, resourceUrl);

    // fetch the resource
    const resource = await fetchArrayBuffer(imgUrl.href);

    // get a new data url for it
    const decryptedDataUrl = await getDecryptedUrl(resource, decryptor);

    /*replace relative url in XML document with base64 version of image*/
    unembeddedXml = unembeddedXml.replace(image, `src="${decryptedDataUrl}"`);
  }
  return unembeddedXml;
}

/**
 * Decrypts a Uint8Array and returns an objectUrl for the resulting blob
 */
async function getDecryptedUrl(arrayBuffer: Uint8Array, decryptor: Decryptor) {
  const decrypted = await decryptor.decrypt(arrayBuffer);
  const imgBlob = new Blob([decrypted]);
  return URL.createObjectURL(imgBlob);
}

/**
 * Fetches a resources as a Uint8Array
 */
async function fetchArrayBuffer(url: string): Promise<Uint8Array> {
  const response = await fetch(url);
  if (!response.ok) {
    const text = await response.text();
    throw new Error(`Failed to fetch ${url}. Message: ${text}`);
  }
  const ab = await response.arrayBuffer();
  return new Uint8Array(ab);
}

/* Replace css assets in XML document with local or decrypted assets, if applicable*/
async function embedCssAssets(
  unembeddedXml: string,
  resourcePath: string,
  decryptor: Decryptor
) {
  const styles =
    unembeddedXml.match(/(href=")(?!https?:\/\/)\/?([^"]+\.(css))"/g) || [];

  /**
   * TODO: Do this in parallel instead of series
   */
  for (const style of styles) {
    // extract only the path and filename of stylesheet
    const relativeUrl = style.replace('href=', '').replace(/['"]+/g, '');
    // resolve to absolute url
    const styleUrl = new URL(relativeUrl, resourcePath);
    const resource = await fetchArrayBuffer(styleUrl.href);
    const decryptedDataUrl = await getDecryptedUrl(resource, decryptor);

    unembeddedXml = unembeddedXml.replace(style, `href="${decryptedDataUrl}"`);
  }
  return unembeddedXml;
}
