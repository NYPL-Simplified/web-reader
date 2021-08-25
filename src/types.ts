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
  goToPage: (href: Locator) => void;
};

export type ReaderState = {
  colorMode: ColorMode;
  isScrolling: boolean;
  fontSize: number;
  fontFamily: FontFamily;
};

export type PDFReaderState = ReaderState & {
  type: 'PDF'
}

export type HTMLReaderState = ReaderState & {
  type: 'HTML'
  currentTocUrl: string | null;
}

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
  navigator: Navigator;
  content: JSX.Element;
  manifest: WebpubManifest;
};

export type PDFActiveReader =  ActiveReader & {
  state: PDFReaderState;
};

export type HTMLActiveReader = ActiveReader & {
  state: HTMLReaderState;
};

export type ReaderReturn = InactiveReader | LoadingReader | PDFActiveReader | HTMLActiveReader;

export type ActiveReaderArguments = {
  webpubManifestUrl: string;
  manifest: WebpubManifest;
  proxyUrl?: string;
};
export type InactiveReaderArguments = undefined;

export type ReaderArguments = ActiveReaderArguments | InactiveReaderArguments;

export type GetColor = (light: string, dark: string, sepia: string) => string;
