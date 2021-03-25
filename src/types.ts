export const EpubMimeType = 'application/epub';
export const PdfMimeType = 'application/pdf+json';
export const WebpubMimeType = 'application/webpub';
export const AxisNowEpubMimeType = 'application/webpub+axisnow+epub';

export type AnyFormat =
  | typeof EpubMimeType
  | typeof PdfMimeType
  | typeof AxisNowEpubMimeType;

export type ManifestMetadata = {
  title: string;
  author: string;
  '@type'?: string;
  identifier?: string;
  language?: string;
  modified?: string;
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
