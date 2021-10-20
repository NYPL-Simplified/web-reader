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
import { Box, Flex, Skeleton, SkeletonText } from '@chakra-ui/react';
import LoadingSkeleton from '../ui/LoadingSkeleton';

type HtmlState = HtmlReaderState & {
  currentResourceIndex: number;
};

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

function useResource(
  url: string | null,
  getContent: (url: string) => Promise<string>
) {
  const { data: resource, isValidating, error } = useSWR(url, getContent);
  if (error) throw error;

  const document = resource
    ? new DOMParser().parseFromString(resource, 'text/html')
    : undefined;

  // add base
  const base = document?.createElement('base');

  if (base && url) {
    base.setAttribute('href', url);
    document?.head.appendChild(base);
  }

  const str = document?.documentElement.outerHTML;
  return { resource: str, isValidating };
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
    fontSize: 16,
    fontFamily: 'sans-serif',
    currentTocUrl: null,
    currentResourceIndex: 0,
  });

  const { currentResourceIndex, fontSize } = state;
  const currentResourceUrl = manifest
    ? new URL(
        manifest.readingOrder[currentResourceIndex].href,
        webpubManifestUrl
      ).toString()
    : null;

  const { resource, isValidating } = useResource(
    currentResourceUrl,
    getContent
  );

  const isAtStart = currentResourceIndex === 0;
  const isAtEnd = currentResourceIndex === manifest?.readingOrder.length;

  // for now just navigates resources
  const goForward = React.useCallback(async () => {
    if (!manifest) return;
    if (isAtEnd) return;
    dispatch({
      type: 'SET_CURRENT_RESOURCE',
      index: currentResourceIndex + 1,
    });
  }, [isAtEnd, currentResourceIndex, manifest]);

  const goBackward = React.useCallback(async () => {
    if (!manifest) return;
    if (isAtStart) return;
    dispatch({
      type: 'SET_CURRENT_RESOURCE',
      index: currentResourceIndex - 1,
    });
  }, [manifest, isAtStart, currentResourceIndex]);

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
      <Box as="iframe" height="100vh" title="CHANGEME" srcDoc={resource} />
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
 * We need to map from our family values to R2D2BC's family values.
 */
const familyToR2Family: Record<FontFamily, string> = {
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
