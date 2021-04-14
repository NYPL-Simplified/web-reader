// the MimeType for a packaged epub
export const EpubMimeType = 'application/epub';
// the Mimetype for a generic webpub
export const WebpubMimeType = 'application/webpub';

/**
 * WebPubs can indicate that they conform to a specific
 * structure, like a collection of PDFs of an AxisNow encrypted
 * ePub.
 *
 * THE FOLLOWING TWO TYPES ARE MADE UP STUBS
 */
// a webpub pdf collection
export const WebpubPdfConformsTo = 'stub/webpub+pdf';
// a webpub of axisnow content
export const AxisNowEpubConformsTo = 'stub/webpub+axisnow';

export type AnyConformsTo =
  | typeof WebpubPdfConformsTo
  | typeof AxisNowEpubConformsTo;

export type ManifestMetadata = {
  title: string;
  author: string;
  '@type'?: string;
  identifier?: string;
  language?: string;
  modified?: string;
  conformsTo?: AnyConformsTo;
};

export type WebpubManifest = {
  '@context': 'http://readium.org/webpub/default.jsonld';
  metadata: ManifestMetadata;
  spine: Spine<'text/html'>;
  links: any[];
  resources: any[];
};

export type Spine<TFormat> = { href: string; type: TFormat; title: string }[];

export type GetContent = (readingOrderHref: string) => Promise<string>;
