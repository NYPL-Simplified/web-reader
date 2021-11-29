import React from 'react';
import {
  ColorMode,
  HtmlReaderState,
  ReaderReturn,
  ReaderArguments,
  FontFamily,
  WebpubManifest,
} from '../types';
import { Injectable } from '../Readium/Injectable';
import useSWRImmutable from 'swr/immutable';
import LoadingSkeleton from '../ui/LoadingSkeleton';
import useResizeObserver from 'use-resize-observer';
import { DEFAULT_HEIGHT, DEFAULT_SHOULD_GROW_WHEN_SCROLLING } from '..';
import { Locator } from '../Readium/Locator';
import { ReadiumLink } from '../WebpubManifestTypes/ReadiumLink';

type HtmlState = HtmlReaderState & {
  pageIndex: number;
  totalPages: number;
  resourceSize: {
    height: number;
    width: number;
  };
  isIframeLoaded: boolean;
  // tracks whether the inter-resource navigation effect has run.
  isNavigated: boolean;
  location: Locator;
};

/**
 * @TODO :
 *
 *  - store location in locator object
 *    - on TOC click, set it to the href and fragment
 *    - on internal link click, use the href and fragment
 *    - on first load, set it to start of the initial resource
 *    - on next page click, set it to a CFI or progression or position
 *
 *  - location change effect that responds to
 *    - hash link
 *    - page number ?
 *    - cfi
 *  - calculate current page, total pages
 *  - switching from scrolling to paginated should maintain position
 *  - keep location in url bar
 *  - calculate atstart atend properly
 *  - Go to last page of last resource when navigating backwards
 *  - Anchor links within a resource
 *  - show loading indicator while iframe is loading
 *  - render iframe when in loading state
 *
 * Future:
 *  - Don't use ReadiumCSS for fixed layout
 *  - Make fixed layout work
 *  - Update to latest Readium CSS
 *
 * FOR PAGINATION:
 *  - maybe store location as page index in paginated mode, and handle resizes?
 *  - maybe store location as CFI in paginated mode?
 */

/**
 * If we provide injectables that are not found, the app won't load at all.
 * Therefore we will not provide any default injectables.
 * @todo - this is not true in our custom rendered. We should provide default injectables.
 */
const defaultInjectables: Injectable[] = [];
const defaultInjectablesFixed: Injectable[] = [];

export type HtmlAction =
  | { type: 'MANIFEST_LOADED' }
  | { type: 'IFRAME_LOADED' }
  | { type: 'NAV_PREVIOUS_RESOURCE' }
  | { type: 'NAV_NEXT_RESOURCE' }
  | { type: 'TOC_LINK_CLICK'; link: ReadiumLink }
  | { type: 'GO_FORWARD' }
  | { type: 'GO_BACKWARD' }
  // indicates completion of an inter-resource nav after iframe loads
  | { type: 'NAV_COMPLETE' }
  | { type: 'SET_COLOR_MODE'; mode: ColorMode }
  | { type: 'SET_SCROLL'; isScrolling: boolean }
  | { type: 'SET_FONT_SIZE'; size: number }
  | { type: 'SET_FONT_FAMILY'; family: FontFamily };

/**
 * A higher order function that makes it easy to access arguments in the reducer
 * without passing them in to every `dispatch` call.
 */
function htmlReducer(args: ReaderArguments) {
  /**
   * If there are no args, it's an inactive hook, just use a function that returns the state.
   * This way you don't have to keep checking if args is defined.
   */
  if (!args) return (state: HtmlState, _action: HtmlAction) => state;

  // our actual reducer
  return function reducer(state: HtmlState, action: HtmlAction): HtmlState {
    const { manifest, webpubManifestUrl } = args;

    switch (action.type) {
      case 'MANIFEST_LOADED': {
        /**
         * Start at the beginning of first resource
         * @todo - use the value from URL query param if any
         */
        const locator = linkToLocator(manifest.readingOrder[0]);

        return {
          ...state,
          location: locator,
        };
      }

      case 'IFRAME_LOADED':
        return {
          ...state,
          isIframeLoaded: true,
        };

      case 'NAV_NEXT_RESOURCE': {
        const currentIndex = getCurrentIndex(manifest, state);
        const nextIndex = currentIndex + 1;
        // if we are at the end, do nothing
        if (nextIndex >= manifest.readingOrder.length) return state;
        const nextResource = manifest.readingOrder[nextIndex];
        const locator = linkToLocator(nextResource);
        return {
          ...state,
          location: locator,
          isNavigated: false,
          isIframeLoaded: false,
        };
      }

      case 'NAV_PREVIOUS_RESOURCE': {
        const currentIndex = getCurrentIndex(manifest, state);
        const prevIndex = currentIndex - 1;
        // if we are at the beginning, do nothing
        if (prevIndex === 0) return state;
        const prevResource = manifest.readingOrder[prevIndex];
        // send them to the end of the next resource
        const locator = linkToLocator(prevResource, { progression: 1 });
        return {
          ...state,
          location: locator,
          // we need to re-perform inter-resource nav
          isNavigated: false,
          isIframeLoaded: false,
        };
      }

      case 'GO_FORWARD': {
        console.warn('unimplemented');
        return {
          ...state,
        };
      }

      case 'GO_BACKWARD': {
        console.warn('unimplemented');
        return { ...state };
      }

      case 'NAV_COMPLETE': {
        return {
          ...state,
          isNavigated: true,
        };
      }

      case 'SET_COLOR_MODE':
        return {
          ...state,
          colorMode: action.mode,
        };

      case 'SET_SCROLL':
        return {
          ...state,
          isScrolling: action.isScrolling,
        };

      case 'SET_FONT_SIZE':
        return {
          ...state,
          fontSize: action.size,
        };

      case 'SET_FONT_FAMILY':
        return {
          ...state,
          fontFamily: action.family,
        };
    }
  };
}

const FONT_SIZE_STEP = 4;

function getInjectableElement(
  document: Document,
  injectable: Injectable
): HTMLElement | undefined {
  switch (injectable.type) {
    case 'style': {
      const el = document.createElement('link');
      el.setAttribute('rel', 'stylesheet');
      if (injectable.url) {
        el.setAttribute('href', injectable.url);
      } else {
        console.warn('Injectable missing url', injectable);
      }
      return el;
    }

    default:
      return;
  }
}

/**
 * Fetches an HTML resource and prepares it by injecting:
 *  - Readium CSS
 *  - A `<base>` element with the resource url
 *  - Any other injectables passed in
 */
function useResource(
  url: string | null,
  getContent: (url: string) => Promise<string>,
  injectables: Injectable[],
  state: HtmlState
) {
  const { data, isValidating, error } = useSWRImmutable(url, getContent);
  // cast the data to a possibly undefined because, it is?
  const resource = data as string | undefined;
  if (error) throw error;

  const document = resource
    ? new DOMParser().parseFromString(resource, 'text/html')
    : undefined;

  // add base so relative URLs work.
  const base = document?.createElement('base');
  if (base && url) {
    base.setAttribute('href', url);
    document?.head.appendChild(base);
  }

  // add injectables
  if (document) {
    for (const injectable of injectables) {
      const element = getInjectableElement(document, injectable);
      if (element) document?.head.appendChild(element);
    }

    // set the initial CSS state
    setCss(document.documentElement, state);

    // inject js to communicate with iframe
    // injectJS(document);
  }

  const isLoading = isValidating && !data;

  const str = document?.documentElement.outerHTML;
  return { resource: str, isLoading };
}

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

  const [state, dispatch] = React.useReducer(htmlReducer(args), {
    colorMode: 'day',
    isScrolling: true,
    fontSize: 100,
    fontFamily: 'sans-serif',
    currentTocUrl: null,
    pageIndex: 0,
    totalPages: 0,
    atStart: false,
    atEnd: false,
    resourceSize: {
      height: 0,
      width: 0,
    },
    isIframeLoaded: false,
    isNavigated: false,
    // start with dummy location
    location: { href: '', locations: {} },
  });

  const [iframe, setIframe] = React.useState<HTMLIFrameElement | null>(null);
  const {
    ref: containerRef,
    width: containerWidth = 0,
    height: containerHeight = 0,
  } = useResizeObserver<HTMLIFrameElement>();

  const { fontSize, location } = state;
  const currentResourceUrl = manifest
    ? new URL(location.href, webpubManifestUrl).toString()
    : null;
  const currentResourceIndex = manifest?.readingOrder.findIndex(
    (link) => link.href === location.href
  );
  const isAtLastResource =
    currentResourceIndex === manifest?.readingOrder.length;
  const isAtFirstResource = currentResourceIndex === 0;
  const totalPages = 0;

  const { resource, isLoading } = useResource(
    currentResourceUrl,
    getContent,
    injectables,
    state
  );

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
    if (!state.isNavigated && state.isIframeLoaded && iframe) {
      /**
       * Check for progression info. This is used
       *  - in paginated mode for changing pages
       *  - navigating backward
       *  - switching between scrolling and paginated mode (to keep location)
       */
      if (typeof state.location.locations.progression === 'number') {
        const {
          isHorizontalPaginated,
          totalPages,
          containerWidth,
          containerHeight,
          resourceSize,
        } = calcPosition(iframe, state.isScrolling);

        const newProgression = state.location.locations.progression;
        const newPage = Math.floor(totalPages * newProgression);
        const html = getIframeHTML(iframe);

        if (isHorizontalPaginated) {
          const newPage = Math.floor(totalPages * newProgression);
          const newScrollLeft = newPage * containerWidth;
          html.scrollTo({ left: newScrollLeft, top: 0 });
        } else {
          const newScrollTop = newPage * containerHeight;
          console.log('scrolling to', newScrollTop, resourceSize);
          html.scrollTo(0, newScrollTop);
        }
        dispatch({ type: 'NAV_COMPLETE' });
      }
    }
  }, [
    state.isIframeLoaded,
    state.isNavigated,
    state.location,
    state.isScrolling,
    iframe,
  ]);

  /**
   * Set CSS variables when user state changes.
   * @todo - wait for iframe load?
   * @todo - narrow down the dependencies so this doesn't run on _every_ state change.
   */
  React.useEffect(() => {
    if (!iframe || !manifest) return;
    const html = getMaybeIframeHtml(iframe);
    if (!html) return;
    setCss(html, state);
  }, [state, iframe, manifest, resource]);

  /**
   * In scroll mode we:
   *  - set the horizontal offset based on page number and witdh
   *  - set the total pages so we know how far we can scroll
   */
  React.useEffect(() => {
    if (!iframe || !manifest) return;
    if (state.isScrolling) return;
    // set the scroll offset based on page number
    const offset = containerWidth * state.pageIndex;
    const html = getIframeHTML(iframe);
    if (!html) {
      console.warn('Trying to scroll before html is present');
      return;
    }
    html.scrollTo(offset, 0);
  }, [
    containerWidth,
    state.pageIndex,
    iframe,
    manifest,
    state.isScrolling,
    resource,
  ]);

  const goToNextResource = React.useCallback(() => {
    if (isAtLastResource) return;
    dispatch({ type: 'NAV_NEXT_RESOURCE' });
  }, [isAtLastResource]);

  /**
   * Dispatch the prev resource action and let the reducer handle it.
   */
  const goToPrevResource = React.useCallback(() => {
    if (isAtFirstResource) return;
    dispatch({
      type: 'NAV_PREVIOUS_RESOURCE',
    });
  }, [isAtFirstResource]);

  /**
   * In scroll mode:
   *    navigates one resource
   * In page mode:
   *    Navigates one page unless at end of resource
   *
   * @TODO - check that you are not at the last page before going
   * to next page.
   */
  const goForward = React.useCallback(async () => {
    if (!manifest || !iframe) return;
    if (!state.isScrolling) {
      const isScrollEnd = getIsScrollEnd(iframe);
      if (isScrollEnd) {
        goToNextResource();
      } else {
        dispatch({ type: 'SET_PAGE_INDEX', index: state.pageIndex + 1 });
      }
    } else {
      goToNextResource();
    }
  }, [iframe, goToNextResource, manifest, state.isScrolling, state.pageIndex]);

  const goBackward = React.useCallback(async () => {
    if (!manifest || !iframe) return;
    if (!state.isScrolling) {
      const isScrollStart = getIsScrollStart(iframe);
      if (isScrollStart) {
        goToPrevResource();
      } else {
        if (state.pageIndex > 0) {
          dispatch({ type: 'SET_PAGE_INDEX', index: state.pageIndex - 1 });
        }
      }
    } else {
      if (isAtFirstResource) return;
      goToPrevResource();
    }
  }, [iframe, goToPrevResource, manifest, state.isScrolling, state.pageIndex]);

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

  const increaseFontSize = React.useCallback(async () => {
    const newSize = fontSize + FONT_SIZE_STEP;
    dispatch({ type: 'SET_FONT_SIZE', size: newSize });
  }, [fontSize]);

  const decreaseFontSize = React.useCallback(async () => {
    const newSize = fontSize - FONT_SIZE_STEP;
    dispatch({ type: 'SET_FONT_SIZE', size: newSize });
  }, [fontSize]);

  const setFontFamily = React.useCallback(async (family: FontFamily) => {
    dispatch({ type: 'SET_FONT_FAMILY', family });
  }, []);

  const goToPage = React.useCallback((href) => {
    if (!manifest) return;
    // get the resource with that href and set it.
    // may need to handle a page number or other # content.

    // what happens if there is no resource with that href?
  }, []);

  /**
   * Dispatch an action on iframe load
   */
  const onLoad = React.useCallback(() => {
    dispatch({ type: 'IFRAME_LOADED' });
  }, []);

  // this format is inactive, return null
  if (!webpubManifestUrl || !manifest) return null;

  // determines if the reader should grow to fit content or stay the
  // pre-determined height passed in
  const shouldGrow = state.isScrolling && growWhenScrolling;

  // we are initializing the reader
  if (isLoading) {
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
        <div>
          Page: {state.pageIndex} / {totalPages}
        </div>
        <iframe
          onLoad={onLoad}
          ref={(el) => {
            setIframe(el);
            containerRef(el);
          }}
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
          srcDoc={resource}
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

/**
 * gets the index of the current location href
 */
function getCurrentIndex(manifest: WebpubManifest, state: HtmlState): number {
  return manifest.readingOrder.findIndex(
    (link) => link.href === state.location.href
  );
}

/**
 * Converts a ReadiumLink to a Locator
 */
function linkToLocator(
  link: ReadiumLink,
  locations: Locator['locations'] = {}
): Locator {
  // use window.origin here because we are only trying to extract the hash
  const hash = new URL(link.href, window.origin).hash;
  // add the hash if we don't already have a fragment
  if (hash && !locations?.fragment) locations.fragment = `#${hash}`;
  return {
    href: link.href,
    title: link.title,
    type: link.type ?? 'text/html',
    locations,
  };
}

/**
 * Calculate current position information
 */
function calcPosition(iframe: HTMLIFrameElement, isScrolling: boolean) {
  /**
   * Calculate the current scroll position and number of pages,
   * and thus the page index, total pages and progression
   */
  const containerHeight = iframe.offsetHeight;
  const containerWidth = iframe.offsetWidth;
  const isHorizontalPaginated = !isScrolling;
  const containerSize = isHorizontalPaginated
    ? containerWidth
    : containerHeight;
  const html = getIframeHTML(iframe);
  const resourceHeight = html.scrollHeight;
  const resourceWidth = html.scrollWidth;
  const resourceSize = isHorizontalPaginated ? resourceWidth : resourceHeight;
  const scrollYPosition = html.scrollTop;
  const scrollXPosition = html.scrollLeft;
  const scrollPosition = isHorizontalPaginated
    ? scrollXPosition
    : scrollYPosition;
  const totalPages = Math.ceil(resourceSize / containerSize);
  const progression = scrollPosition / resourceSize;
  const currentPage = Math.floor(progression * totalPages);

  return {
    isHorizontalPaginated,
    containerSize,
    containerWidth,
    containerHeight,
    resourceSize,
    scrollPosition,
    totalPages,
    progression,
    currentPage,
  };
}

/**
 * Set scroll position of HTML element in iframe
 */
// function setScrollPosition(iframe: HTMLIFrameElement, progression: number,)

/**
 * Fetches a resource as text
 */
async function fetchAsTxt(url: string) {
  const res = await fetch(url);
  const txt = await res.text();
  return txt;
}

/**
 * Inject some raw JS into the iframe document
 */
function injectJS(document: Document) {
  const script = document.createElement('script');
  script.setAttribute('type', 'text/javascript');
  script.textContent = `
    window.onload = () => {
      window.top.postMessage({source: 'reader-iframe', type: 'IFRAME_LOADED'})
    }
  `;
  document.head.appendChild(script);
}

/**
 * Takes the HTML element and sets CSS variables on it based on the
 * reader's state
 */
function setCss(html: HTMLElement, state: HtmlState) {
  setCSSProperty(html, '--USER__scroll', getPagination(state.isScrolling));
  setCSSProperty(
    html,
    '--USER__appearance',
    getColorModeValue(state.colorMode)
  );
  setCSSProperty(html, '--USER__advancedSettings', 'readium-advanced-on');
  setCSSProperty(
    html,
    '--USER__fontOverride',
    getFontOverride(state.fontFamily)
  );
  setCSSProperty(
    html,
    '--USER__fontFamily',
    familyToReadiumFamily[state.fontFamily]
  );
  setCSSProperty(html, '--USER__fontSize', `${state.fontSize}%`);
  setCSSProperty(html, 'overflow', state.isScrolling ? 'scroll' : 'hidden');
}

/**
 * Determine if you are at the end of a resource
 * NOTE: If this proves flaky we could use IntersectionObserver instead
 */
function getIsScrollEnd(iframe: HTMLIFrameElement) {
  const html = getIframeHTML(iframe);
  if (!html) return false;
  const scrollWidth = html.scrollWidth;
  const currentScroll = html.scrollLeft + html.clientWidth;
  return scrollWidth === currentScroll;
}
/**
 * Determine if you are at the start of a resource
 */
function getIsScrollStart(iframe: HTMLIFrameElement) {
  const html = getIframeHTML(iframe);
  if (!html) return false;
  const currentScroll = html.scrollLeft;
  return currentScroll === 0;
}

function getMaybeIframeHtml(iframe: HTMLIFrameElement) {
  try {
    return getIframeHTML(iframe);
  } catch (e) {
    return undefined;
  }
}

/**
 * Get the HTML element of the iframe
 */
function getIframeHTML(iframe: HTMLIFrameElement) {
  const html = iframe?.contentDocument?.documentElement;
  if (!html) {
    throw new Error('Attempting to access iframe HTML before it exists');
  }
  return html;
}

/**
 * Sets a CSS var on the html element in the iframe. Used to set
 * ReadiumCSS settings like scrolling and color mode and font
 * size.
 */
function setCSSProperty(html: HTMLElement, name: string, val: string) {
  html.style.setProperty(name, val);
}

/**
 * Translates the readium scroll css var into a boolean
 */
function getPagination(isPaginated: boolean) {
  switch (isPaginated) {
    case true:
      return 'readium-scroll-on';
    case false:
      return 'readium-scroll-off';
  }
}

/**
 * Translates the internal color mode value into a Readium
 * color mode value.
 */
function getColorModeValue(mode: ColorMode) {
  switch (mode) {
    case 'day':
      return 'readium-default-on';
    case 'night':
      return 'readium-night-on';
    case 'sepia':
      return 'readium-sepia-on';
  }
}

/**
 * Translates the readium color mode value into an internal
 * color mode value
 */
function getColorMode(d2Mode: string): ColorMode {
  switch (d2Mode) {
    case 'readium-default-on':
      return 'day';
    case 'readium-night-on':
      return 'night';
    case 'readium-sepia-on':
      return 'sepia';
    default:
      console.error('COLOR MODE SLIPPED THROUG', d2Mode);
      return 'day';
  }
}

/**
 * Gets the Readium font-override setting based on the given font family.
 */
function getFontOverride(fontFamily: FontFamily) {
  switch (fontFamily) {
    case 'publisher':
      return 'readium-font-off';
    default:
      return 'readium-font-on';
  }
}

/**
 * Translates the internal font family to a readium css font family value.
 */
const familyToReadiumFamily: Record<FontFamily, string> = {
  publisher: 'Original',
  serif: 'serif',
  'sans-serif': 'sans-serif',
  'open-dyslexic': 'opendyslexic',
};
/**
 * Translates a readium css font family to an internal font family.
 */
const r2FamilyToFamily: Record<string, FontFamily | undefined> = {
  Original: 'publisher',
  serif: 'serif',
  'sans-serif': 'sans-serif',
  opendyslexic: 'open-dyslexic',
};
