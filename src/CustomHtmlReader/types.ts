import { Locator } from '../Readium/Locator';
import { ColorMode, FontFamily, HtmlReaderState } from '../types';

/**
 * @todo - split this into multiple states (inactive, loading resource, iframe loaded)
 *  and states for resource fetching.
 *
 * States:
 *  - Inactive
 *  - loading manifest
 *  - fetching resource
 *  - fetched resource, loading iframe
 *  - iframe loaded
 *  - navigated
 *  - resource fetch error
 */
export type HtmlState = HtmlReaderState & {
  isIframeLoaded: boolean;
  // tracks whether the inter-resource navigation effect has run.
  isNavigated: boolean;
  // location.locations.position is 1 indexed page
  location: Locator;
  iframe: HTMLIFrameElement | null;
  resource: string | undefined;
  isFetchingResource: boolean;
  resourceFetchError: Error | undefined;
};

export type LocalState =
  | FetchingResource
  | LoadingIframe
  | IframeLoaded
  | Navigated
  | ResourceFetchError;

export type FetchingResource = {
  isIframeLoaded: false;
  isNavigated: false;
  location: Locator;
  iframe: null;
  resource: undefined;
  isFetchingResource: true;
  resourceFetchError: null;
};

export type LoadingIframe = {
  isIframeLoaded: false;
  isNavigated: false;
  location: Locator;
  iframe: HTMLIFrameElement;
  resource: string;
  isFetchingResource: false;
  resourceFetchError: null;
};

export type IframeLoaded = {
  isIframeLoaded: true;
  isNavigated: false;
  location: Locator;
  iframe: HTMLIFrameElement;
  resource: string;
  isFetchingResource: false;
  resourceFetchError: null;
};

export type Navigated = {
  isIframeLoaded: true;
  isNavigated: true;
  location: Locator;
  iframe: HTMLIFrameElement;
  resource: string;
  isFetchingResource: false;
  resourceFetchError: null;
};

export type ResourceFetchError = {
  isIframeLoaded: false;
  isNavigated: false;
  location: Locator;
  iframe: null;
  resource: undefined;
  isFetchingResource: false;
  resourceFetchError: Error;
};

// state that affects the css variables
export type CSSState = Pick<
  HtmlState,
  'isScrolling' | 'colorMode' | 'fontFamily' | 'fontSize'
>;

export type HtmlAction =
  | { type: 'MANIFEST_LOADED' }
  | { type: 'IFRAME_LOADED' }
  | { type: 'NAV_PREVIOUS_RESOURCE' }
  | { type: 'NAV_NEXT_RESOURCE' }
  | { type: 'GO_TO_HREF'; href: string }
  | { type: 'GO_FORWARD' }
  | { type: 'GO_BACKWARD' }
  // indicates completion of an inter-resource nav after iframe loads
  | { type: 'NAV_COMPLETE' }
  | { type: 'SET_COLOR_MODE'; mode: ColorMode }
  | { type: 'SET_SCROLL'; isScrolling: boolean }
  | { type: 'INCREASE_FONT_SIZE' }
  | { type: 'DECREASE_FONT_SIZE' }
  | { type: 'SET_FONT_FAMILY'; family: FontFamily }
  | { type: 'USER_SCROLLED' }
  | { type: 'SET_IFRAME'; iframe: HTMLIFrameElement | null }
  | { type: 'RESOURCE_CHANGED' }
  | { type: 'RESOURCE_FETCH_REQUEST' }
  | { type: 'RESOURCE_FETCH_SUCCESS'; resource: string }
  | { type: 'RESOURCE_FETCH_ERROR'; error: Error };
