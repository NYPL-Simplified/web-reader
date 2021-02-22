import { SetStateAction } from 'react';
import EpubClient from './epub/EpubClient';
import PdfClient from './pdf/PdfClient';

export const EpubMimeType = 'application/epub';
export const PdfMimeType = 'application/pdf+json';
export const WebpubMimeType = 'application/webpub';

export type AnyFormat = typeof EpubMimeType | typeof PdfMimeType;

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

export type PdfManifest = {
  '@context': 'pdf';
  metadata: ManifestMetadata;
  spine: Spine<typeof PdfMimeType>;
};

export type AnyManifest = PdfManifest | WebpubManifest;

// we use a CFI for the epub location
export type EpubLocation = string | undefined;
export type PdfLocation = number | undefined;
export type WebpubLocation = number | undefined;

export type AnyLocation = EpubLocation | PdfLocation | WebpubLocation;
export type AnyClient = EpubClient | PdfClient;

export type SetLocation<T> = React.Dispatch<SetStateAction<T>>;

export type TocItem = {
  href: string;
  title: string;
  children?: TocItem[];
};
