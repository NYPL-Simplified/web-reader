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

/**
 * @todo - split this into multiple states (inactive, loading resource, iframe loaded)
 */
type HtmlState = HtmlReaderState & {
  isIframeLoaded: boolean;
  // tracks whether the inter-resource navigation effect has run.
  isNavigated: boolean;
  // location.locations.position is 1 indexed page
  location: Locator;
};

/**
 * DECISIONS:
 *  - We use webpubManifestUrl as the baseUrl when constructing URLs. This allows us to compare urls effectively.
 *  - location.locations.position is 1 indexed page
 */

/**
 * @TODO :
 *
 * - WORKING ON paginated mode
 *    - make it stay in same place when switching scrolled to paginated
 *
 *  - store location in locator object
 *    - on TOC click, set it to the href and fragment
 *    - on internal link click, use the href and fragment
 *    - on first load, set it to start of the initial resource
 *    - on next page click, set it to a CFI or progression or position
 *
 *  - location change effect that responds to
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
 *  - reorganize link comparison utils so that you compare only _absolute_ URLs, not
 *    relative URLs. Always use the correct baseUrl for making absolute URLs.
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
  | { type: 'GO_TO_LINK'; link: ReadiumLink }
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
function htmlReducer(args: ReaderArguments, iframe: HTMLIFrameElement | null) {
  /**
   * If there are no args, it's an inactive hook, just use a function that returns the state.
   * This way you don't have to keep checking if args is defined.
   */
  if (!args) return (state: HtmlState, _action: HtmlAction) => state;

  const { manifest, webpubManifestUrl } = args;

  // our actual reducer
  return function reducer(state: HtmlState, action: HtmlAction): HtmlState {
    function goToNextResource() {
      const currentIndex = getCurrentIndex(manifest, state, webpubManifestUrl);
      const nextIndex = currentIndex + 1;
      // if we are at the end, do nothing
      if (nextIndex >= manifest.readingOrder.length) return state;
      const nextResource = manifest.readingOrder[nextIndex];
      const locator = linkToLocator(nextResource, webpubManifestUrl);
      return {
        ...state,
        location: locator,
        isNavigated: false,
        isIframeLoaded: false,
      };
    }

    function goToPrevResource() {
      const currentIndex = getCurrentIndex(manifest, state, webpubManifestUrl);
      const prevIndex = currentIndex - 1;
      // if we are at the beginning, do nothing
      if (currentIndex === 0) {
        console.warn('At the beginning');
        return state;
      }
      const prevResource = manifest.readingOrder[prevIndex];
      // send them to the end of the next resource
      const locator = linkToLocator(prevResource, webpubManifestUrl, {
        progression: 1,
      });
      return {
        ...state,
        location: locator,
        // we need to re-perform inter-resource nav
        isNavigated: false,
        isIframeLoaded: false,
      };
    }

    switch (action.type) {
      case 'MANIFEST_LOADED': {
        /**
         * Start at the beginning of first resource.
         * @todo - use the value from URL query param if any
         */
        const locator = linkToLocator(
          manifest.readingOrder[2],
          webpubManifestUrl,
          { progression: 0, position: 1 }
        );

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
        return goToNextResource();
      }

      case 'NAV_PREVIOUS_RESOURCE': {
        return goToPrevResource();
      }

      case 'GO_TO_LINK': {
        const isInReadingOrder = !!getFromReadingOrder(
          action.link.href,
          manifest,
          webpubManifestUrl
        );
        if (!isInReadingOrder) {
          console.error(
            `Cannot navigate to a link not in the reading order`,
            action.link
          );
          return state;
        }

        // tells us whether we are staying on the same resource or going
        // to load a new one
        const isIframeLoaded = isSameResource(
          action.link.href,
          state.location.href,
          webpubManifestUrl
        );

        const locator = linkToLocator(action.link, webpubManifestUrl);
        return {
          ...state,
          location: locator,
          isNavigated: false,
          isIframeLoaded,
        };
      }

      case 'GO_FORWARD': {
        /**
         * We are going to scroll the user forward by one page unit,
         * unless we are at the end of the resource, in which case we
         * need to go to the next resource
         */

        // if the iframe isn't loaded and present, we can't do anything yet
        if (!state.isIframeLoaded || !iframe) {
          console.warn("Can't go forward before iframe is loaded");
          return state;
        }

        const { progression, totalPages, currentPage } = calcPosition(
          iframe,
          state.isScrolling
        );

        // if we are at the last page, go to next resource
        if (currentPage === totalPages) {
          return goToNextResource();
        }

        /**
         * Set the progression so that we scroll the user by
         * one page, but also set the 'position' value
         */
        const percentToScroll = 1 / totalPages;
        const newProgression = progression + percentToScroll;

        return {
          ...state,
          location: {
            ...state.location,
            locations: {
              progression: newProgression,
              position: currentPage + 1,
            },
          },
          isNavigated: false,
        };
      }

      case 'GO_BACKWARD': {
        // if the iframe isn't loaded and present, we can't do anything yet
        if (!state.isIframeLoaded || !iframe) {
          console.warn("Can't go forward before iframe is loaded");
          return state;
        }
        const { progression, totalPages, currentPage } = calcPosition(
          iframe,
          state.isScrolling
        );

        // if we are at the last page, go to next resource
        if (currentPage === 1) {
          return goToPrevResource();
        }

        /**
         * Set the progression so that we scroll the user back
         * one page, but also set the 'position' value
         */
        const percentToScroll = 1 / totalPages;
        const newProgression = Math.max(progression - percentToScroll, 0);
        const newPosition = Math.max(currentPage - 1, 1);

        return {
          ...state,
          location: {
            ...state.location,
            locations: {
              progression: newProgression,
              position: newPosition,
            },
          },
          isNavigated: false,
        };
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

  const [iframe, setIframe] = React.useState<HTMLIFrameElement | null>(null);

  const [state, dispatch] = React.useReducer(htmlReducer(args, iframe), {
    colorMode: 'day',
    isScrolling: false,
    fontSize: 100,
    fontFamily: 'sans-serif',
    currentTocUrl: null,
    atStart: false,
    atEnd: false,
    isIframeLoaded: false,
    isNavigated: false,
    // start with dummy location
    location: { href: '', locations: {} },
  });

  const { fontSize, location } = state;
  const currentResourceUrl = location.href ?? null;
  const currentResourceIndex = manifest?.readingOrder.findIndex(
    (link) => link.href === location.href
  );
  const isAtLastResource =
    currentResourceIndex === manifest?.readingOrder.length;
  const isAtFirstResource = currentResourceIndex === 0;

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
      const locations = state.location.locations;
      const { fragment, progression } = locations;
      /**
       * First check for a fragment that we need to navigate to
       */
      if (typeof fragment === 'string') {
        const isHash = fragment.indexOf('#') === 0;
        if (isHash) {
          // we get the element by the hash, and scroll it into view
          const el = iframe.contentDocument?.querySelector(fragment);
          if (el) {
            el.scrollIntoView();
          } else {
            console.error('Could not find an element with id', fragment);
          }
        }
      } else if (typeof progression === 'number') {
        navigateToProgression(iframe, progression, state.isScrolling);
      }
      // tell the reducer that we have now completed the navigation.
      dispatch({ type: 'NAV_COMPLETE' });
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
        <iframe
          onLoad={onLoad}
          ref={(el) => {
            setIframe(el);
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
 * Scroll the HTML element to a given progression by
 * setting the scrollTop or the scrollLeft.
 */
function navigateToProgression(
  iframe: HTMLIFrameElement,
  progression: number,
  isScrolling: boolean
) {
  /**
   * Check for progression info. This is used
   *  - in paginated mode for changing pages
   *  - navigating backward
   *  - switching between scrolling and paginated mode (to keep location)
   */
  const { isHorizontalPaginated, resourceSize } = calcPosition(
    iframe,
    isScrolling
  );
  const html = getIframeHTML(iframe);

  const newScrollPosition = progression * resourceSize;

  /**
   * @todo - snap that progression to the nearest page.
   */

  if (isHorizontalPaginated) {
    html.scrollLeft = newScrollPosition;
  } else {
    html.scrollTop = newScrollPosition;
  }
}

/**
 * gets the index of the current location href
 */
function getCurrentIndex(
  manifest: WebpubManifest,
  state: HtmlState,
  baseUrl: string
): number {
  const i = manifest.readingOrder.findIndex((link) =>
    isSameResource(link.href, state.location.href, baseUrl)
  );
  if (i === -1) {
    console.warn("Couldn't find current location in manifest. Returning 0.");
  }
  return i === -1 ? 0 : i;
}

/**
 * Find a link in the reading order from a passed in href.
 */
function getFromReadingOrder(
  href: string,
  manifest: WebpubManifest,
  baseUrl: string
): { link: ReadiumLink; index: number } | undefined {
  const i = manifest.readingOrder.findIndex((link) => {
    return isSameResource(link.href, href, baseUrl);
  });

  return i !== -1
    ? {
        link: manifest.readingOrder[i],
        index: i,
      }
    : undefined;
}

/**
 * Check if two hrefs share the same pathname. They can be absolute
 * or relative, and this will ignore the host/origin (maybe not right decision)
 * This will also ignore hash links.
 */
function isSameResource(
  href1: string,
  href2: string,
  baseUrl: string
): boolean {
  const url1 = new URL(href1, baseUrl);
  const url2 = new URL(href2, baseUrl);
  const doMatch =
    url1.origin === url2.origin && url1.pathname === url2.pathname;
  return doMatch;
}

/**
 * Converts a ReadiumLink to a Locator
 */
function linkToLocator(
  link: ReadiumLink,
  baseUrl: string,
  locations: Locator['locations'] = {}
): Locator {
  const url = new URL(link.href, baseUrl);
  const hash = url.hash;
  const hrefWithoutHash = url.origin + url.pathname;
  // add the hash if we don't already have a fragment
  if (hash && !locations?.fragment) locations.fragment = hash;
  // const hrefWithoutHash =
  return {
    href: hrefWithoutHash,
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
  const pageSize = containerSize;
  const html = getIframeHTML(iframe);
  const resourceHeight = html.scrollHeight;
  const resourceWidth = html.scrollWidth;
  const resourceSize = isHorizontalPaginated ? resourceWidth : resourceHeight;
  const scrollYPosition = html.scrollTop;
  const scrollXPosition = html.scrollLeft;
  const scrollPosition = isHorizontalPaginated
    ? scrollXPosition
    : scrollYPosition;
  const totalPages =
    Math.ceil((resourceSize - containerSize) / containerSize) + 1;
  const progression = scrollPosition / resourceSize;

  // we use round to get the closest page to the scrollTop
  const currentPage = Math.ceil(progression * totalPages) + 1;

  // you're at the end if the scroll position + containerSize === resourceSize
  const isAtEnd = currentPage === totalPages;
  const isAtStart = currentPage === 1;

  return {
    isHorizontalPaginated,
    containerSize,
    containerWidth,
    containerHeight,
    pageSize,
    resourceSize,
    scrollPosition,
    totalPages,
    progression,
    currentPage,
    isAtEnd,
    isAtStart,
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
