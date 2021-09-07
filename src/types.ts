import { Locator } from '@d-i-t-a/reader/dist/model/Locator';
import { WebpubManifest } from './WebpubManifestTypes/WebpubManifest';

export { WebpubManifest };

// the MimeType for a packaged epub
export const EpubMimeType = 'application/epub';
// the Mimetype for a generic webpub
export const WebpubMimeType = 'application/webpub';

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
  goToPage: (href: string) => void;
};

//  PDF specific navigator here
export type PdfNavigator = Navigator;

export type HtmlNavigator = Navigator;

export type ReaderState = {
  colorMode: ColorMode;
  isScrolling: boolean;
  fontSize: number;
  fontFamily: FontFamily;
  currentTocUrl: string | null;
};

// PDF specific reader state
export type PdfReaderState = ReaderState;

// HTML specific reader state
export type HtmlReaderState = ReaderState;

export type InactiveReader = null;

export type LoadingReader = {
  isLoading: true;
  content: JSX.Element;
  navigator: null;
  state: null;
  manifest: null;
  type: null;
};

type CommonReader = {
  isLoading: false;
  content: JSX.Element;
  manifest: WebpubManifest;
};

export type PDFActiveReader = CommonReader & {
  state: PdfReaderState;
  navigator: PdfNavigator;
  type: 'PDF';
};

export type HTMLActiveReader = CommonReader & {
  state: HtmlReaderState;
  navigator: HtmlNavigator;
  type: 'HTML';
};

export type ActiveReader = PDFActiveReader | HTMLActiveReader;

export type ReaderReturn = InactiveReader | LoadingReader | ActiveReader;

// should fetch and decrypt a resource
export type GetContent = (href: string) => Promise<string>;

export type UseWebReaderArguments = {
  webpubManifestUrl: string;
  proxyUrl?: string;
  getContent?: GetContent;
};

export type ActiveReaderArguments = UseWebReaderArguments & {
  manifest: WebpubManifest;
};

export type InactiveReaderArguments = undefined;

export type ReaderArguments = ActiveReaderArguments | InactiveReaderArguments;

export type GetColor = (light: string, dark: string, sepia: string) => string;
