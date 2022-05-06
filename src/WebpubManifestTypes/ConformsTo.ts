// a webpub pdf collection
export const WebpubPdfConformsTo =
  'http://librarysimplified.org/terms/profiles/pdf';
// Epub profiles
export const EpubConformsTo =
  'https://readium.org/webpub-manifest/profiles/epub';

export type ConformsTo = typeof WebpubPdfConformsTo | typeof EpubConformsTo;
