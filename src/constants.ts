import { ReaderSettings } from './types';

export const ReadiumWebpubContext = 'http://readium.org/webpub/default.jsonld';

export const IS_DEV = process.env.NODE_ENV === 'development';

// we have to set a constant height to make this work with R2D2BC
export const HEADER_HEIGHT = 48;
export const FOOTER_HEIGHT = 48;
export const CHROME_HEIGHT = HEADER_HEIGHT + FOOTER_HEIGHT;

export const DEFAULT_HEIGHT = `calc(100vh - ${CHROME_HEIGHT}px)`;
export const DEFAULT_SHOULD_GROW_WHEN_SCROLLING = true;

export const DEFAULT_SETTINGS: ReaderSettings = {
  colorMode: 'day',
  isScrolling: false,
  fontSize: 100,
  fontFamily: 'publisher',
};

export const FONT_DETAILS = {
  publisher: {
    heading: "Publisher's default font",
    body:
      "Show the publisher's-specified fonts and layout choices in this ebook",
    token: 'body',
    fontWeight: 'light',
  },
  serif: {
    heading: 'Serif font',
    body: 'Georgia',
    token: 'serif',
    fontWeight: 'regular',
  },
  'sans-serif': {
    heading: 'Sans-serif font',
    body: 'Helvetica',
    token: 'sansSerif',
    fontWeight: 'regular',
  },
  'open-dyslexic': {
    heading: 'Dyslexic friendly font',
    body: 'OpenDyslexic',
    token: 'opendyslexic',
    fontWeight: 'regular',
  },
};

// local storage keys
export const LOCAL_STORAGE_SETTINGS_KEY = 'web-reader-settings';
export const LOCAL_STORAGE_LOCATIONS_KEY = 'web-reader-locations';
