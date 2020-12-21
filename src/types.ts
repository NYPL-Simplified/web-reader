export type ManifestMetadata = {
  title: string;
  author: string;
};

export type WebpubManifest = {
  metadata: ManifestMetadata;
  spine: { href: string; type: 'text/html'; title: string }[];
};

// we will change these to actual media types in the future.
export type Format = 'webpub' | 'pdf';
