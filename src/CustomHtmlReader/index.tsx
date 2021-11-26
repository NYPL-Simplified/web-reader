import React from 'react';
import {
  ColorMode,
  HtmlReaderState,
  ReaderReturn,
  ReaderArguments,
  FontFamily,
} from '../types';
import { Injectable } from '../Readium/Injectable';
import useSWRImmutable from 'swr/immutable';
import LoadingSkeleton from '../ui/LoadingSkeleton';
import useResizeObserver from 'use-resize-observer';
import { DEFAULT_HEIGHT, DEFAULT_SHOULD_GROW_WHEN_SCROLLING } from '..';

type HtmlState = HtmlReaderState & {
  currentResourceIndex: number;
  pageIndex: number;
  totalPages: number | null;
};

/**
 * @TODO :
 *
 *  - Make loading screen show header and take full height
 *  - Keep track of resource size and container size
 *  - Use that to calculate number of pages and current page
 *  - Keep track of current location based on scroll value in current resource
 *      - Switching to paginated from scroll should keep your location
 *  - don't show page buttons when in scroll mode
 *  - Separate out paginated and scrolling state types
 *  - Go to last page of last resource when navigating backwards
 *  - Anchor links within a resource
 *
 * Future:
 *  - Don't use ReadiumCSS for fixed layout
 *  - Make fixed layout work
 *  - Update to latest Readium CSS
 */

/**
 * If we provide injectables that are not found, the app won't load at all.
 * Therefore we will not provide any default injectables.
 * @todo - this is not true in our custom rendered. We should provide default injectables.
 */
const defaultInjectables: Injectable[] = [];
const defaultInjectablesFixed: Injectable[] = [];

export type HtmlAction =
  | { type: 'SET_CURRENT_RESOURCE'; index: number }
  | { type: 'SET_COLOR_MODE'; mode: ColorMode }
  | { type: 'SET_SCROLL'; isScrolling: boolean }
  | { type: 'SET_FONT_SIZE'; size: number }
  | { type: 'SET_FONT_FAMILY'; family: FontFamily }
  | { type: 'SET_PAGE_INDEX'; index: number };

function htmlReducer(state: HtmlState, action: HtmlAction): HtmlState {
  switch (action.type) {
    case 'SET_CURRENT_RESOURCE':
      return {
        ...state,
        currentResourceIndex: action.index,
      };

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

    case 'SET_PAGE_INDEX':
      return {
        ...state,
        pageIndex: action.index,
      };
  }
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

  const [state, dispatch] = React.useReducer(htmlReducer, {
    colorMode: 'day',
    isScrolling: true,
    fontSize: 100,
    fontFamily: 'sans-serif',
    currentTocUrl: null,
    currentResourceIndex: 0,
    pageIndex: 0,
    totalPages: null,
    atStart: true,
    atEnd: false,
  });

  const [iframe, setIframe] = React.useState<HTMLIFrameElement | null>(null);
  const { ref, width = 0 } = useResizeObserver<HTMLIFrameElement>();

  const { currentResourceIndex, fontSize } = state;
  const currentResourceUrl = manifest
    ? new URL(
        manifest.readingOrder[currentResourceIndex].href,
        webpubManifestUrl
      ).toString()
    : null;

  const { resource, isLoading } = useResource(
    currentResourceUrl,
    getContent,
    injectables,
    state
  );

  const isAtFirstResource = currentResourceIndex === 0;
  const isAtLastResource =
    currentResourceIndex === manifest?.readingOrder.length;

  // update the user settings css variables
  // also need to run this when the resource changes, or set them on the srcDoc directly (@TODO look into that)
  // also need to wait for the iframe to be loaded before we do this. Otherwise there wont be html and we will do
  // nothing.
  React.useEffect(() => {
    if (!iframe || !manifest) return;
    const html = getIframeHTML(iframe);
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
    const offset = width * state.pageIndex;
    const html = getIframeHTML(iframe);
    if (!html) {
      console.warn('Trying to scroll before html is present');
      return;
    }
    html.scrollTo(offset, 0);
  }, [width, state.pageIndex, iframe, manifest, state.isScrolling, resource]);

  // go to last page when navigating backwards from one
  // resource to another. You need to know if it has been measured
  // yet though in order to do this.
  // React.useEffect(() => {}, []);

  const goToNextResource = React.useCallback(() => {
    if (isAtLastResource) return;
    dispatch({
      type: 'SET_CURRENT_RESOURCE',
      index: currentResourceIndex + 1,
    });
    dispatch({
      type: 'SET_PAGE_INDEX',
      index: 0,
    });
  }, [isAtLastResource, currentResourceIndex]);

  /**
   * @TODO - you need to know the number of pages in the prev
   * resource to scroll the user to the last one when navigating
   * backwards.
   */
  const goToPrevResource = React.useCallback(() => {
    if (isAtFirstResource) return;
    dispatch({
      type: 'SET_CURRENT_RESOURCE',
      index: currentResourceIndex - 1,
    });
    dispatch({
      type: 'SET_PAGE_INDEX',
      index: 0,
    });
  }, [isAtFirstResource, currentResourceIndex]);

  // on scroll, update the current page
  React.useEffect(() => {
    const document = iframe?.contentDocument;
    if (!document) return;

    console.log('Adding scroll');
    function handleScroll() {
      console.log('scroll');
    }

    document.addEventListener('scroll', handleScroll);
    // return () => document.removeEventListener('scroll', handleScroll);
  }, [iframe]);
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
      dispatch({
        type: 'SET_CURRENT_RESOURCE',
        index: currentResourceIndex - 1,
      });
    }
  }, [
    iframe,
    goToPrevResource,
    manifest,
    isAtFirstResource,
    currentResourceIndex,
    state.isScrolling,
    state.pageIndex,
  ]);

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
      <iframe
        ref={(el) => {
          setIframe(el);
          ref(el);
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
      />
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

/**
 * Get the HTML element of the iframe
 */
function getIframeHTML(iframe: HTMLIFrameElement) {
  const html = iframe?.contentDocument?.documentElement;
  if (!html) {
    console.warn(
      'Attempting to perform action on iframe HTML but the element is not there yet.'
    );
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
