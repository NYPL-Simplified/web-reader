import React from 'react';
import {
  ColorMode,
  ReaderReturn,
  ReaderArguments,
  FontFamily,
  HtmlNavigator,
} from '../types';
import LoadingSkeleton from '../ui/LoadingSkeleton';
import { DEFAULT_HEIGHT, DEFAULT_SHOULD_GROW_WHEN_SCROLLING } from '..';
import {
  fetchAsTxt,
  calcPosition,
  defaultInjectables,
  defaultInjectablesFixed,
} from './lib';
import makeHtmlReducer, { inactiveState } from './reducer';
import { navigateToHash, navigateToProgression, setCss } from './effects';
import useResource from './useResource';
import useLocationQuery from './useLocationQuery';
import useWindowResize from './useWindowResize';
import { useUpdateScroll } from './useUpdateScroll';
import useUpdateCSS from './useUpdateCSS';
import useIframeLinkClick from './useIframeLinkClick';

/**
 * DECISIONS:
 *  - We use webpubManifestUrl as the baseUrl when constructing URLs. This allows us to compare urls effectively.
 *  - location.locations.position is 1 indexed page
 *  - We keep all state in the reducer and try not to put logic into handlers. They should
 *    just dispatch actions.
 */

/**
 * @TODO :
 *
 * - WORKING ON
 *  - provide default injectables (Readium CSS)
 *
 * Future:
 *  - Don't use ReadiumCSS for fixed layout
 *  - Make fixed layout work
 *  - Update to latest Readium CSS
 *  - Find some way to organize effects and actions together so you can navigate, wait for iframe to load,
 *    then run some other effect.
 *  - goForward and goBackward should return a promise that resolves once isNavigated flips to true.
 *  - Sync settings to localStorage or something similar.
 *  - Add a way to call a callback when current reading position changes (so OE web can save current position).
 *  - Maybe use history.pushState when navigating via nextPage or previousPage or toc.
 */

export default function useHtmlReader(args: ReaderArguments): ReaderReturn {
  const {
    webpubManifestUrl,
    manifest,
    getContent = fetchAsTxt,
    injectables = defaultInjectables,
    injectablesFixed = defaultInjectablesFixed,
    height = DEFAULT_HEIGHT,
    growWhenScrolling = DEFAULT_SHOULD_GROW_WHEN_SCROLLING,
  } = args ?? {};

  const [state, dispatch] = React.useReducer(
    makeHtmlReducer(args),
    inactiveState
  );

  /**
   * Fetches the resource and keeps it in the reducer state.
   */
  const currentResourceUrl = state.location?.href ?? null;
  useResource(state, getContent, injectables, dispatch);

  /**
   * Dispatches an action to update scroll position when the user *stops* scrolling.
   */
  useUpdateScroll(state, dispatch);

  /**
   * Update url query param when location changes.
   */
  useLocationQuery(state);

  // dispatch action when window is resized
  useWindowResize(dispatch);

  // update iframe css variables when css state changes
  useUpdateCSS(state, manifest);

  // listen for internal link clicks
  useIframeLinkClick(dispatch);

  // dispatch action when arguments change
  React.useEffect(() => {
    if (!webpubManifestUrl || !manifest) {
      return dispatch({ type: 'ARGS_CHANGED', args: undefined });
    }
    dispatch({
      type: 'ARGS_CHANGED',
      args: {
        webpubManifestUrl,
        manifest,
        getContent,
        injectables,
        injectablesFixed,
        height,
        growWhenScrolling,
      },
    });
  }, [
    webpubManifestUrl,
    manifest,
    getContent,
    injectables,
    injectablesFixed,
    height,
    growWhenScrolling,
  ]);

  /**
   * Navigate after location change
   * After loads, make sure we fire off effects to navigate the user if necessary.
   */
  React.useEffect(() => {
    // we do this on the next tick in case we are still calculating things.
    process.nextTick(() => {
      if (state.state === 'NAVIGATING') {
        const { fragment, progression, position } = state.location.locations;
        /**
         * We first try a fragment, then a progression, then a position value.
         */
        if (typeof fragment === 'string') {
          navigateToHash(fragment, state.iframe);
        } else if (typeof progression === 'number') {
          navigateToProgression(state.iframe, progression, state.isScrolling);
        } else if (typeof position === 'number') {
          // get the progression value for that page
          const { totalPages } = calcPosition(state.iframe, state.isScrolling);
          const calculatedProgression = (position - 1) / totalPages;
          navigateToProgression(
            state.iframe,
            calculatedProgression,
            state.isScrolling
          );
        }
        // tell the reducer that we have now completed the navigation.
        dispatch({ type: 'NAV_COMPLETE' });
      }
    });
  }, [state.state, state.iframe, state.isScrolling, state.location?.locations]);

  const navigator = React.useRef<HtmlNavigator>({
    goToPage(href) {
      dispatch({ type: 'GO_TO_HREF', href });
    },
    async goForward() {
      dispatch({ type: 'GO_FORWARD' });
    },
    async goBackward() {
      dispatch({ type: 'GO_BACKWARD' });
    },
    async setColorMode(mode: ColorMode) {
      dispatch({ type: 'SET_COLOR_MODE', mode });
    },
    async setScroll(val) {
      const isScrolling = val === 'scrolling';
      dispatch({ type: 'SET_SCROLL', isScrolling });
    },
    async increaseFontSize() {
      dispatch({ type: 'INCREASE_FONT_SIZE' });
    },
    async decreaseFontSize() {
      dispatch({ type: 'DECREASE_FONT_SIZE' });
    },
    async setFontFamily(family: FontFamily) {
      dispatch({ type: 'SET_FONT_FAMILY', family });
    },
  }).current;

  // doesn't belong in navigator as it's internal, but if this
  // is recreated every time, we end up in an infinite loop.
  const setIframe = React.useRef((el: HTMLIFrameElement) => {
    dispatch({ type: 'SET_IFRAME', iframe: el });
  }).current;

  // this format is inactive, return null
  if (!webpubManifestUrl || !manifest) return null;

  /**
   * Note: It is possible we are still in an "Inactive" state while there
   * are arguments to the hook, for exactly one render cycle. Thus if that's the
   * case, we also render the loading screen.
   */
  if (state.state === 'FETCHING_RESOURCE' || state.state === 'INACTIVE') {
    return {
      type: null,
      isLoading: true,
      content: <LoadingSkeleton height={height} />,
      navigator: null,
      manifest: null,
      state: null,
    };
  }

  // determines if the reader should grow to fit content or stay the
  // pre-determined height passed in
  const shouldGrow = state.isScrolling && growWhenScrolling;

  const englishTitle =
    typeof manifest.metadata.title === 'string'
      ? manifest.metadata.title
      : manifest.metadata.title.en ?? 'Unknown Title';

  // the reader is active
  return {
    type: 'HTML',
    isLoading: false,
    content: (
      <>
        <iframe
          onLoad={() => dispatch({ type: 'IFRAME_LOADED' })}
          ref={setIframe}
          // as="iframe"
          style={{
            /**
             * This determines the height of the iframe.
             *
             * If we remove this, then in scrolling mode it simply grows to fit
             * content. In paginated mode, however, we must have this set because
             * we have to decide how big the content should be.
             */
            height: shouldGrow ? 'initial' : height,
            /**
             * We always want the height to be at least the defined height
             */
            minHeight: height,
            overflow: 'hidden',
          }}
          title={englishTitle}
          srcDoc={state.resource}
          src={currentResourceUrl ?? undefined}
        />
      </>
    ),
    state,
    manifest,
    navigator,
  };
}
