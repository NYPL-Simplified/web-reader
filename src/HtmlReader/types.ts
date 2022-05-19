import { Locator } from '../Readium/Locator';
import {
  ColorMode,
  FontFamily,
  ReaderArguments,
  ReaderSettings,
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
  viewport?: ViewPort;
};

export type FetchingResourceState = ReaderState & {
  state: 'FETCHING_RESOURCE';
  location: Locator;
  iframe: null;
  resource: undefined;
  resourceFetchError: undefined;
  settings: ReaderSettings;
  viewport?: ViewPort;
};

export type ResourceFetchErrorState = ReaderState & {
  state: 'RESOURCE_FETCH_ERROR';
  location: Locator;
  iframe: null;
  resource: undefined;
  resourceFetchError: Error;
  settings: ReaderSettings;
};

export type RenderingIframeState = ReaderState & {
  state: 'RENDERING_IFRAME';
  location: Locator;
  iframe: null;
  resource: string;
  resourceFetchError: undefined;
  settings: ReaderSettings;
  viewport?: ViewPort;
};

export type LoadingIframeState = ReaderState & {
  state: 'LOADING_IFRAME';
  location: Locator;
  iframe: HTMLIFrameElement;
  resource: string;
  resourceFetchError: undefined;
  settings: ReaderSettings;
  viewport?: ViewPort;
};

export type NavigatingState = ReaderState & {
  state: 'NAVIGATING';
  location: Locator;
  iframe: HTMLIFrameElement;
  resource: string;
  resourceFetchError: undefined;
  settings: ReaderSettings;
  viewport?: ViewPort;
};

export type ReadyState = ReaderState & {
  state: 'READY';
  location: Locator;
  iframe: HTMLIFrameElement;
  resource: string;
  resourceFetchError: undefined;
  settings: ReaderSettings;
  viewport?: ViewPort;
};

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
  | { type: 'RESOURCE_FETCH_SUCCESS'; resource: string; viewport?: ViewPort }
  | { type: 'RESOURCE_FETCH_ERROR'; error: Error };

export type ViewPort = {
  width: number;
  height: number;
};
