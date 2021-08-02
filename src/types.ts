import { Locator } from '@d-i-t-a/reader/dist/model/Locator';

// the MimeType for a packaged epub
export const EpubMimeType = 'application/epub';
// the Mimetype for a generic webpub
export const WebpubMimeType = 'application/webpub';

/**
 * WebPubs can indicate that they conform to a specific
 * structure, like a collection of PDFs of an AxisNow encrypted
 * ePub.
 *
 * THE FOLLOWING TWO TYPES ARE MADE UP STUBS
 */
// a webpub pdf collection
export const WebpubPdfConformsTo = 'stub/webpub+pdf';
// a webpub of axisnow content
export const AxisNowEpubConformsTo = 'stub/webpub+axisnow';

export type AnyConformsTo =
  | typeof WebpubPdfConformsTo
  | typeof AxisNowEpubConformsTo;

export type ManifestMetadata = {
  title: string;
  author: string;
  '@type'?: string;
  identifier?: string;
  language?: string;
  modified?: string;
  conformsTo?: AnyConformsTo;
};

export type WebpubManifest = {
  '@context': 'http://readium.org/webpub/default.jsonld';
  metadata: ManifestMetadata;
  spine: Spine<'text/html'>;
  links: any[];
  resources: any[];
  toc: any[]; // TODO: get the type once we import the webpubmanifest
};

export type Spine<TFormat> = { href: string; type: TFormat; title: string }[];

export type GetContent = (readingOrderHref: string) => Promise<string>;

export type ColorMode = 'night' | 'sepia' | 'day';

export type FontFamily = 'publisher' | 'serif' | 'sans-serif' | 'open-dyslexic';

export type Navigator = {
  goForward: () => void;
  goBackward: () => void;
  setColorMode: (mode: ColorMode) => Promise<void>;
  setScroll: (val: 'scrolling' | 'paginated') => Promise<void>;
  increaseFontSize: () => Promise<void>;
  decreaseFontSize: () => Promise<void>;
  setFontFamily: (family: FontFamily) => Promise<void>;
  goToPage: (href: Locator) => void; // TODO: should extract Locator type too
};

export type ReaderType = 'HTML' | 'PDF';

export type ReaderState = {
  type: ReaderType;
  colorMode: ColorMode;
  isScrolling: boolean;
  fontSize: number;
  fontFamily: FontFamily;
};

export type InactiveReader = null;

export type LoadingReader = {
  isLoading: true;
  content: JSX.Element;
  navigator: null;
  state: null;
  manifest: null;
};

export type ActiveReader = {
  isLoading: false;
  state: ReaderState;
  navigator: Navigator;
  content: JSX.Element;
  manifest: WebpubManifest;
};

export type ReaderReturn = InactiveReader | LoadingReader | ActiveReader;

export type ActiveReaderArguments = {
  webpubManifestUrl: string;
  manifest: WebpubManifest;
};
export type InactiveReaderArguments = undefined;

export type ReaderArguments = ActiveReaderArguments | InactiveReaderArguments;
