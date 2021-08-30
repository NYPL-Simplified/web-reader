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

export type ReaderType = 'HTML' | 'PDF';

export type ReaderState = {
  type: ReaderType;
  colorMode: ColorMode;
  isScrolling: boolean;
  fontSize: number;
  fontFamily: FontFamily;
  currentTocUrl: string | null;
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
