export const EpubMimeType = 'application/epub';
export const PdfMimeType = 'application/pdf';

export type AnyFormat = typeof EpubMimeType | typeof PdfMimeType;

export type ManifestMetadata = {
  title: string;
  author: string;
  '@type'?: string;
  identifier?: string;
  language?: string;
  modified?: string;
};

export type EpubManifest = {
  '@context': 'http://readium.org/webpub/default.jsonld';
  metadata: ManifestMetadata;
  spine: Spine<'text/html'>;
  links: any[];
  resources: any[];
};

export type Spine<TFormat> = { href: string; type: TFormat; title: string }[];

export type PdfManifest = {
  '@context': 'pdf';
  metadata: ManifestMetadata;
  spine: Spine<typeof PdfMimeType>;
};

export type AnyManifest = PdfManifest | EpubManifest;
