export type ManifestMetadata = {
  title: string;
  author: string;
};

export type WebpubManifest = {
  metadata: ManifestMetadata;
  spine: { href: string; type: 'text/html'; title: string }[];
};
