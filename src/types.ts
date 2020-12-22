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
};

export type Spine<TFormat> = { href: string; type: TFormat; title: string }[];

export type PdfManifest = {
  '@context': 'pdf';
  metadata: ManifestMetadata;
  spine: Spine<'application/pdf'>;
};

export type AnyManifest = PdfManifest | WebpubManifest;

// we will change these to actual media types in the future.
export type Format = 'webpub' | 'pdf';
