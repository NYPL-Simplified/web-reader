import React from 'react';
import {
  ColorMode,
  HtmlReaderState,
  ReaderReturn,
  ReaderArguments,
  FontFamily,
} from '../types';
import { HEADER_HEIGHT } from '../ui/constants';
import { Injectable } from '../Readium/Injectable';
import useSWR from 'swr';
import LoadingSkeleton from '../ui/LoadingSkeleton';

type HtmlState = HtmlReaderState & {
  currentResourceIndex: number;
  page: number | null;
  totalPages: number | null;
};

/**
 * @TODO :
 *  - Don't use ReadiumCSS for fixed layout
 *  - Make fixed layout work
 *  - Set user settings using css vars on iframe HTML
 *  - Maybe use Readium-CSS source files instead of dist files
 *  - Look up how to make reducers have effects (like setting css vars)
 *  - Maybe don't use srcDoc, or if using it, set all settings in srcDoc.
 */

/**
 * If we provide injectables that are not found, the app won't load at all.
 * Therefore we will not provide any default injectables.
 */
const defaultInjectables: Injectable[] = [];
const defaultInjectablesFixed: Injectable[] = [];

export type HtmlAction =
  | { type: 'SET_CURRENT_RESOURCE'; index: number }
  | { type: 'SET_COLOR_MODE'; mode: ColorMode }
  | { type: 'SET_SCROLL'; isScrolling: boolean }
  | { type: 'SET_FONT_SIZE'; size: number }
  | { type: 'SET_FONT_FAMILY'; family: FontFamily };

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
  }
}

const FONT_SIZE_STEP = 4;

async function fetcher(url: string) {
  const res = await fetch(url);
  const txt = await res.text();
  return txt;
}

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

function useResource(
  url: string | null,
  getContent: (url: string) => Promise<string>,
  injectables: Injectable[],
  state: HtmlState
) {
  const { data, isValidating, error } = useSWR(url, getContent, {
    revalidateOnFocus: false,
  });
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

    // set the initial state
    setCss(document.documentElement, state);
  }

  const str = document?.documentElement.outerHTML;
  return { resource: str, isValidating };
}

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

export default function useHtmlReader(args: ReaderArguments): ReaderReturn {
  const {
    webpubManifestUrl,
    manifest,
    getContent = fetcher,
    injectables = defaultInjectables,
    injectablesFixed = defaultInjectablesFixed,
  } = args ?? {};

  const [state, dispatch] = React.useReducer(htmlReducer, {
    colorMode: 'day',
    isScrolling: false,
    fontSize: 100,
    fontFamily: 'sans-serif',
    currentTocUrl: null,
    currentResourceIndex: 2,
    page: null,
    totalPages: null,
  });

  const [iframe, setIframe] = React.useState<HTMLIFrameElement | null>(null);

  const { currentResourceIndex, fontSize } = state;
  const currentResourceUrl = manifest
    ? new URL(
        manifest.readingOrder[currentResourceIndex].href,
        webpubManifestUrl
      ).toString()
    : null;

  const { resource, isValidating } = useResource(
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
    setCss(html, state);
  }, [state, iframe, manifest, resource]);

  /**
   * In scroll mode:
   *    navigates one resource
   * In page mode:
   *    Navigates one page unless at end of resource
   */
  const goForward = React.useCallback(async () => {
    if (!manifest) return;
    if (isAtLastResource) return;
    dispatch({
      type: 'SET_CURRENT_RESOURCE',
      index: currentResourceIndex + 1,
    });
  }, [isAtLastResource, currentResourceIndex, manifest]);

  const goBackward = React.useCallback(async () => {
    if (!manifest) return;
    if (isAtFirstResource) return;
    dispatch({
      type: 'SET_CURRENT_RESOURCE',
      index: currentResourceIndex - 1,
    });
  }, [manifest, isAtFirstResource, currentResourceIndex]);

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
    // if (!reader) return;
    // // Adding try/catch here because goTo throws a TypeError
    // // if the TOC link you clicked on was the current page..
    // try {
    //   reader.goTo({ href } as Locator); // This needs to be fixed, locations should be optional.
    //   dispatch({ type: 'SET_CURRENT_TOC_URL', currentTocUrl: href });
    // } catch (error) {
    //   console.error(error);
    // }
  }, []);

  const isLoading = isValidating;

  // this format is inactive, return null
  if (!webpubManifestUrl || !manifest) return null;

  // we are initializing the reader
  if (isLoading) {
    return {
      type: null,
      isLoading: true,
      content: <LoadingSkeleton />,
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
        ref={(el) => setIframe(el)}
        // as="iframe"
        style={{ height: `calc(100vh - ${HEADER_HEIGHT}px)` }}
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

function getPagination(isPaginated: boolean) {
  switch (isPaginated) {
    case true:
      return 'readium-scroll-on';
    case false:
      return 'readium-scroll-off';
  }
}

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

function getFontOverride(fontFamily: FontFamily) {
  switch (fontFamily) {
    case 'publisher':
      return 'readium-font-off';
    default:
      return 'readium-font-on';
  }
}

/**
 * We need to map from our family values to R2D2BC's family values.
 */
const familyToReadiumFamily: Record<FontFamily, string> = {
  publisher: 'Original',
  serif: 'serif',
  'sans-serif': 'sans-serif',
  'open-dyslexic': 'opendyslexic',
};
/**
 * And vice-versa
 */
const r2FamilyToFamily: Record<string, FontFamily | undefined> = {
  Original: 'publisher',
  serif: 'serif',
  'sans-serif': 'sans-serif',
  opendyslexic: 'open-dyslexic',
};
