export const ReadiumWebpubContext = 'http://readium.org/webpub/default.jsonld';

export const IS_DEV = process.env.NODE_ENV === 'development';

// we have to set a constant height to make this work with R2D2BC
export const HEADER_HEIGHT = 48;
export const FOOTER_HEIGHT = 48;
export const CHROME_HEIGHT = HEADER_HEIGHT + FOOTER_HEIGHT;

export const DEFAULT_HEIGHT = `calc(100vh - ${CHROME_HEIGHT}px)`;
export const DEFAULT_SHOULD_GROW_WHEN_SCROLLING = true;
