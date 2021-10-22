import { WebpubManifest } from '../../src/types';

type DecryptChapter = (resourceUrl: string) => Promise<string>;

type DecryptorParams = {
  isbn: string;
  book_vault_uuid: string;
};

type IDecryptorInstance = {
  decrypt(val: Uint8Array): Promise<Uint8Array>;
  decryptUrl(resourceUrl: string): Promise<Uint8Array>;
  decryptToString(resourceUrl: string): Promise<string>;
};

type IDecryptor = {
  createDecryptor(params: any): Promise<IDecryptorInstance>;
};

export default async function createChapterDecryptor(
  params: DecryptorParams,
  webpubManifest: WebpubManifest,
  webpubManifestUrl: string
): Promise<DecryptChapter> {
  try {
    // we have to type cast this because it is a dynamic, optional import.
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const Decryptor = require('@nypl-simplified-packages/axisnow-access-control-web')
      .default as IDecryptor;
    const decryptor = await Decryptor.createDecryptor(params);
    return decryptChapter(decryptor, webpubManifest, webpubManifestUrl);
  } catch (e) {
    console.error(e);
    throw new Error(
      'Could not import or create an AxisNow Decryptor. You may not have access to the private package, or the loan may have expired.'
    );
  }
}

function absoluteHref(href: string, base: string): string {
  const url = new URL(href, base);
  return url.toString();
}

function getLinkFromManifest(
  manifest: WebpubManifest,
  href: string,
  webpubManifestUrl: string
) {
  const fullHref = absoluteHref(href, webpubManifestUrl);
  return (
    manifest.resources?.find(
      (link) => absoluteHref(link.href, webpubManifestUrl) === fullHref
    ) ??
    manifest.readingOrder.find(
      (link) => absoluteHref(link.href, webpubManifestUrl) === fullHref
    )
  );
}

async function fetchResource(url: string) {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(
      `Received code ${response.status} ${response.statusText} for ${url}`
    );
  }
  return await response.text();
}

const decryptChapter = (
  decryptor: IDecryptorInstance,
  webpubManifest: WebpubManifest,
  webpubManifestUrl: string
) => async (url: string): Promise<string> => {
  // check that this link is actually encrypted in the manifest
  const link = getLinkFromManifest(webpubManifest, url, webpubManifestUrl);

  console.log('DECRYPT', link, webpubManifest, url);
  const encryptionScheme = link?.properties?.encrypted?.scheme;

  // if there is no encryption, just fetch it and return it
  if (!encryptionScheme) {
    return fetchResource(url);
  }

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
  decryptor: IDecryptorInstance
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
async function getDecryptedUrl(
  arrayBuffer: Uint8Array,
  decryptor: IDecryptorInstance
) {
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
  decryptor: IDecryptorInstance
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
