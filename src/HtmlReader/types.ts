import { Locator } from '../Readium/Locator';
import {
  ColorMode,
  FontFamily,
  HtmlReaderState,
  ReaderArguments,
  ReaderState,
} from '../types';

/**
 * Html Reader States
 *  - Can be broken into distinct states that we create a union from.
 *    This helps us avoid invalid states.
 *  - We include a `state` property so that it is easy to narrow the type
 *    of a given HtmlState to a specific state in the union.
 */
export type HtmlState = InactiveState | ActiveState;

export type ActiveState =
  | FetchingResourceState
  | ResourceFetchErrorState
  | RenderingIframeState
  | LoadingIframeState
  | NavigatingState
  | ReadyState;

export type InactiveState = ReaderState & {
  state: 'INACTIVE';
  location: undefined;
  iframe: null;
  resource: undefined;
  resourceFetchError: undefined;
};

export type FetchingResourceState = HtmlReaderState & {
  state: 'FETCHING_RESOURCE';
  location: Locator;
  iframe: null;
  resource: undefined;
  resourceFetchError: undefined;
};

export type ResourceFetchErrorState = HtmlReaderState & {
  state: 'RESOURCE_FETCH_ERROR';
  location: Locator;
  iframe: null;
  resource: undefined;
  resourceFetchError: Error;
};

export type RenderingIframeState = HtmlReaderState & {
  state: 'RENDERING_IFRAME';
  location: Locator;
  iframe: null;
  resource: string;
  resourceFetchError: undefined;
};

export type LoadingIframeState = HtmlReaderState & {
  state: 'LOADING_IFRAME';
  location: Locator;
  iframe: HTMLIFrameElement;
  resource: string;
  resourceFetchError: undefined;
};

export type NavigatingState = HtmlReaderState & {
  state: 'NAVIGATING';
  location: Locator;
  iframe: HTMLIFrameElement;
  resource: string;
  resourceFetchError: undefined;
};

export type ReadyState = HtmlReaderState & {
  state: 'READY';
  location: Locator;
  iframe: HTMLIFrameElement;
  resource: string;
  resourceFetchError: undefined;
};

// state that affects the css variables
export type CSSState = Pick<
  HtmlState,
  'isScrolling' | 'colorMode' | 'fontFamily' | 'fontSize'
>;

export type HtmlAction =
  | { type: 'ARGS_CHANGED'; args: ReaderArguments }
  | { type: 'IFRAME_LOADED' }
  | { type: 'NAV_PREVIOUS_RESOURCE' }
  | { type: 'NAV_NEXT_RESOURCE' }
  | { type: 'GO_TO_HREF'; href: string }
  | { type: 'GO_TO_LOCATION'; location: Locator }
  | { type: 'GO_FORWARD' }
  | { type: 'GO_BACKWARD' }
  | { type: 'WINDOW_RESIZED' }
  // indicates completion of an inter-resource nav after iframe loads
  | { type: 'NAV_COMPLETE' }
  | { type: 'SET_COLOR_MODE'; mode: ColorMode }
  | { type: 'SET_SCROLL'; isScrolling: boolean }
  | { type: 'INCREASE_FONT_SIZE' }
  | { type: 'DECREASE_FONT_SIZE' }
  | { type: 'SET_FONT_FAMILY'; family: FontFamily }
  | { type: 'USER_SCROLLED' }
  | { type: 'SET_IFRAME'; iframe: HTMLIFrameElement | null }
  | { type: 'RESOURCE_FETCH_SUCCESS'; resource: string }
  | { type: 'RESOURCE_FETCH_ERROR'; error: Error };
