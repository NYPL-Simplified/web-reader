// a webpub pdf collection
export const WebpubPdfConformsTo = 'stub/webpub+pdf';
// a webpub of axisnow content
export const AxisNowEpubConformsTo = 'stub/webpub+axisnow';

export type ConformsTo =
  | typeof WebpubPdfConformsTo
  | typeof AxisNowEpubConformsTo;
