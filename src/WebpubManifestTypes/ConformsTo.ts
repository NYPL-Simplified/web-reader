// a webpub pdf collection
export const WebpubPdfConformsTo =
  'http://librarysimplified.org/terms/profiles/pdf';
// a webpub of axisnow content
export const AxisNowEpubConformsTo = 'stub/webpub+axisnow';

export type ConformsTo =
  | typeof WebpubPdfConformsTo
  | typeof AxisNowEpubConformsTo;
