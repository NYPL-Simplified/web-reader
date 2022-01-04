import React from 'react';
import { ColorMode, ReaderReturn, ReaderArguments, FontFamily } from '../types';
import { Injectable } from '../Readium/Injectable';
import useSWRImmutable from 'swr/immutable';
import LoadingSkeleton from '../ui/LoadingSkeleton';
import { DEFAULT_HEIGHT, DEFAULT_SHOULD_GROW_WHEN_SCROLLING } from '..';
import {
  fetchAsTxt,
  useUpdateScroll,
  calcPosition,
  getMaybeIframeHtml,
  getFromReadingOrder,
  makeInjectableElement,
  defaultInjectables,
  defaultInjectablesFixed,
} from './lib';
import makeHtmlReducer from './reducer';
import { navigateToHash, navigateToProgression, setCss } from './effects';
import { HtmlState } from './types';
import useResource from './useResource';

/**
 * DECISIONS:
 *  - We use webpubManifestUrl as the baseUrl when constructing URLs. This allows us to compare urls effectively.
 *  - location.locations.position is 1 indexed page
 */

/**
 * @TODO :
 *
 * - WORKING ON
 *  - remove useSWR
 *  - keep location in url bar
 *  - Anchor links within a resource
 *  - Make CFI's work in the location.locations.cfi
 *  - provide default injectables (Readium CSS)
 *
 * Future:
 *  - Don't use ReadiumCSS for fixed layout
 *  - Make fixed layout work
 *  - Update to latest Readium CSS
 *  - reorganize link comparison utils so that you compare only _absolute_ URLs, not
 *    relative URLs. Always use the correct baseUrl for making absolute URLs.
 */

/**
 * Fetches an HTML resource and prepares it by injecting:
 *  - Readium CSS
 *  - A `<base>` element with the resource url
 *  - Any other injectables passed in
 */
// function useResource(
//   url: string | null,
//   getContent: (url: string) => Promise<string>,
//   injectables: Injectable[],
//   state: HtmlState
// ) {
//   const { data: resource, isValidating, error } = useSWRImmutable(
//     url,
//     async (url: string) => {
//       const content = await getContent(url);
//       const document = new DOMParser().parseFromString(content, 'text/html');
//       // add base so relative URLs work.
//       const base = document?.createElement('base');
//       if (base && url) {
//         base.setAttribute('href', url);
//         document?.head.appendChild(base);
//       }

//       for (const injectable of injectables) {
//         const element = makeInjectableElement(document, injectable);
//         if (element) document?.head.appendChild(element);
//       }

//       // set the initial CSS state
//       setCss(document.documentElement, {
//         colorMode: state.colorMode,
//         fontSize: state.fontSize,
//         fontFamily: state.fontFamily,
//         isScrolling: state.isScrolling,
//       });

//       // inject js to communicate with iframe
//       // injectJS(document);

//       return document.documentElement.outerHTML;
//     }
//   );
//   if (error) throw error;

//   const isLoading = isValidating && !resource;

//   return { resource, isLoading };
// }

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

  const [state, dispatch] = React.useReducer(makeHtmlReducer(args), {
    colorMode: 'day',
    isScrolling: true,
    fontSize: 100,
    fontFamily: 'sans-serif',
    currentTocUrl: null,
    atStart: false,
    atEnd: false,
    iframe: null,
    isIframeLoaded: false,
    isNavigated: false,
    // start with dummy location
    location: { href: '', locations: {} },
    resource: undefined,
    isFetchingResource: false,
    resourceFetchError: undefined,
  });

  /**
   * Fetches the resource and keeps it in the reducer state.
   */
  const currentResourceUrl = state.location.href ?? null;
  useResource(state, getContent, injectables, dispatch);

  /**
   * Dispatches an action to update scroll position when the user *stops* scrolling.
   */
  useUpdateScroll(state.iframe, state.isIframeLoaded, dispatch);

  // const { resource, isLoading } = useResource(
  //   currentResourceUrl,
  //   getContent,
  //   injectables,
  //   state
  // );

  /**
   * Set the initial location when the manifest changes.
   * @todo - this should use the url query params
   * @todo - do we actually need to do this? Shouldn't prop changes auto change the hook?
   */
  React.useEffect(() => {
    if (!webpubManifestUrl || !manifest) return;
    dispatch({ type: 'MANIFEST_LOADED' });
  }, [manifest, webpubManifestUrl]);

  /**
   * Navigate after location change
   * After loads, make sure we fire off effects to navigate the user if necessary.
   */
  React.useEffect(() => {
    // we do this on the next tick in case we are still calculating things.
    process.nextTick(() => {
      if (!state.isNavigated && state.isIframeLoaded && state.iframe) {
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
  }, [
    state.isIframeLoaded,
    state.isNavigated,
    state.location,
    state.isScrolling,
    state.iframe,
  ]);

  /**
   * Set CSS variables when user state changes.
   * @todo - wait for iframe load?
   * @todo - narrow down the dependencies so this doesn't run on _every_ state change.
   */
  React.useEffect(() => {
    if (!state.iframe || !manifest) return;
    const html = getMaybeIframeHtml(state.iframe);
    if (!html) return;
    setCss(html, state);
  }, [state, manifest]);

  /**
   * Dispatch the go to link and let reducer handle it
   * @todo - rename this goToHref and make a separate goToLink
   */
  const goToPage = React.useCallback(
    (href) => {
      if (!manifest || !webpubManifestUrl) return;
      const { link } =
        getFromReadingOrder(href, manifest, webpubManifestUrl) ?? {};
      if (!link) {
        console.error(`No readingOrder entry found for href: ${href}`);
        return;
      }
      // use the passed in href to preserve hash links
      link.href = href;
      dispatch({ type: 'GO_TO_LINK', link });
    },
    [manifest, webpubManifestUrl]
  );

  const goForward = React.useCallback(async () => {
    dispatch({ type: 'GO_FORWARD' });
  }, []);

  const goBackward = React.useCallback(async () => {
    dispatch({ type: 'GO_BACKWARD' });
  }, []);

  const setColorMode = React.useCallback(async (mode: ColorMode) => {
    dispatch({ type: 'SET_COLOR_MODE', mode });
  }, []);

  const setScroll = React.useCallback(
    async (val: 'scrolling' | 'paginated') => {
      const isScrolling = val === 'scrolling';
      dispatch({ type: 'SET_SCROLL', isScrolling });
    },
    []
  );

  const setIframe = React.useCallback(
    (el: HTMLIFrameElement) => {
      dispatch({ type: 'SET_IFRAME', iframe: el });
    },
    [dispatch]
  );

  const increaseFontSize = React.useCallback(async () => {
    dispatch({ type: 'INCREASE_FONT_SIZE' });
  }, []);

  const decreaseFontSize = React.useCallback(async () => {
    dispatch({ type: 'DECREASE_FONT_SIZE' });
  }, []);

  const setFontFamily = React.useCallback(async (family: FontFamily) => {
    dispatch({ type: 'SET_FONT_FAMILY', family });
  }, []);

  // this format is inactive, return null
  if (!webpubManifestUrl || !manifest) return null;

  // determines if the reader should grow to fit content or stay the
  // pre-determined height passed in
  const shouldGrow = state.isScrolling && growWhenScrolling;

  // we are initializing the reader
  if (state.isFetchingResource) {
    return {
      type: null,
      isLoading: true,
      content: <LoadingSkeleton height={height} />,
      navigator: null,
      manifest: null,
      state: null,
    };
  }

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
          title="CHANGEME"
          srcDoc={state.resource}
          src={currentResourceUrl ?? undefined}
        />
      </>
    ),
    state,
    manifest,
    navigator: {
      goForward,
      goBackward,
      setColorMode,
      setScroll,
      increaseFontSize,
      decreaseFontSize,
      setFontFamily,
      goToPage,
    },
  };
}
