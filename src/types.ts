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
  spine: { href: string; type: 'text/html'; title: string }[];
};

export type PdfManifest = {
  '@context': 'pdf';
  metadata: ManifestMetadata;
  spine: { href: string; type: 'application/pdf'; title: string }[];
};

export type AnyManifest = PdfManifest | WebpubManifest;

// we will change these to actual media types in the future.
export type Format = 'webpub' | 'pdf';
