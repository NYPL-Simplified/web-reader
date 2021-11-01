import D2Reader from '@d-i-t-a/reader';
import React from 'react';
import {
  ColorMode,
  HtmlReaderState,
  ReaderReturn,
  ReaderArguments,
  FontFamily,
} from '../types';
import HtmlReaderContent from './HtmlReaderContent';
import { Locator } from '@d-i-t-a/reader';
import { HEADER_HEIGHT } from '../ui/constants';
import '../../node_modules/@d-i-t-a/reader/dist/reader.css';
import {
  GetContent,
  Injectable,
  NavigatorAPI,
} from '@d-i-t-a/reader/dist/types/navigator/IFrameNavigator';
import debounce from 'debounce';

type HtmlState = HtmlReaderState & {
  reader: D2Reader | undefined;
  location: undefined | Locator;
};

/**
 * If we provide injectables that are not found, the app won't load at all.
 * Therefore we will not provide any default injectables.
 */
const defaultInjectables: Injectable[] = [];
const defaultInjectablesFixed: Injectable[] = [];

export type HtmlAction =
  | { type: 'SET_READER'; reader: D2Reader }
  | { type: 'SET_COLOR_MODE'; mode: ColorMode }
  | { type: 'SET_SCROLL'; isScrolling: boolean }
  | { type: 'SET_FONT_SIZE'; size: number }
  | { type: 'SET_FONT_FAMILY'; family: FontFamily }
  | { type: 'SET_CURRENT_TOC_URL'; currentTocUrl: string }
  | { type: 'LOCATION_CHANGED'; location: Locator }
  | { type: 'BOOK_BOUNDARY_CHANGED'; atStart: boolean; atEnd: boolean };

function htmlReducer(state: HtmlState, action: HtmlAction): HtmlState {
  switch (action.type) {
    case 'SET_READER': {
      // set all the initial settings taken from the reader
      const settings = action.reader.currentSettings();
      return {
        reader: action.reader,
        isScrolling: settings.verticalScroll,
        colorMode: getColorMode(settings.appearance),
        fontSize: settings.fontSize,
        fontFamily: r2FamilyToFamily[settings.fontFamily] ?? 'publisher',
        currentTocUrl: action.reader.mostRecentNavigatedTocItem(),
        location: undefined,
        atStart: true,
        atEnd: false,
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

    case 'SET_CURRENT_TOC_URL':
      return {
        ...state,
        currentTocUrl: action.currentTocUrl,
      };

    case 'LOCATION_CHANGED':
      return {
        ...state,
        location: action.location,
      };

    case 'BOOK_BOUNDARY_CHANGED':
      return {
        ...state,
        atStart: action.atStart,
        atEnd: action.atEnd,
      };
  }
}

const FONT_SIZE_STEP = 4;

export default function useHtmlReader(args: ReaderArguments): ReaderReturn {
  const {
    webpubManifestUrl,
    manifest,
    getContent,
    injectables = defaultInjectables,
    injectablesFixed = defaultInjectablesFixed,
    readerSettings,
  } = args ?? {};

  const defaultIsScrolling = readerSettings?.isScrolling ?? false;

  const [state, dispatch] = React.useReducer(htmlReducer, {
    colorMode: 'day',
    isScrolling: defaultIsScrolling,
    fontSize: 16,
    fontFamily: 'sans-serif',
    currentTocUrl: null,
    reader: undefined,
    location: undefined,
    atStart: true,
    atEnd: false,
  });

  // used to handle async errors thrown in useEffect
  const [error, setError] = React.useState<Error | undefined>(undefined);
  if (error) {
    throw error;
  }

  const { reader, fontSize, location } = state;

  // initialize the reader
  React.useEffect(() => {
    // bail out if there is no webpubManifestUrl. It indicates this format is not being used.
    if (!webpubManifestUrl) return;
    const url = new URL(webpubManifestUrl);

    const userSettings = {
      verticalScroll: defaultIsScrolling,
    };

    D2Reader.build({
      url,
      injectables: injectables,
      injectablesFixed: injectablesFixed,
      attributes: {
        navHeight: HEADER_HEIGHT,
        margin: 0,
      },
      rights: {
        /**
         * Makes the reader fetch every resource before rendering, which
         * takes forever.
         */
        autoGeneratePositions: false,
      },
      userSettings: userSettings,
      api: {
        getContent: getContent as GetContent,
        updateCurrentLocation: async (location: Locator) => {
          // This is needed so that setBookBoundary has the updated "reader" value.
          dispatch({ type: 'LOCATION_CHANGED', location: location });
          return await location;
        },
        onError: function (e: Error) {
          setError(e);
        },
      } as NavigatorAPI,
    }).then((reader) => {
      dispatch({ type: 'SET_READER', reader });
      enableResizeEvent(reader, dispatch);
    });
  }, [
    webpubManifestUrl,
    getContent,
    injectables,
    injectablesFixed,
    defaultIsScrolling,
  ]);

  // Re-calculate page location on scroll/TOC navigation/page button press
  React.useEffect(() => {
    if (!location || !reader) return;
    setBookBoundary(reader, dispatch);
  }, [location, reader, state.isScrolling]);

  // prev and next page functions
  const goForward = React.useCallback(async () => {
    if (!reader) return;
    const isLastPage = await reader.atEnd();
    reader.nextPage();
    if (isLastPage) {
      // FIXME: This will not work for links containing sub-links
      // b/c reader.nextPage saves the raw toc link without the elementID
      dispatch({
        type: 'SET_CURRENT_TOC_URL',
        currentTocUrl: reader.mostRecentNavigatedTocItem(),
      });
    }
  }, [reader]);

  const goBackward = React.useCallback(async () => {
    if (!reader) return;
    const isFirstPage = await reader.atStart();
    reader.previousPage();
    if (isFirstPage) {
      dispatch({
        type: 'SET_CURRENT_TOC_URL',
        currentTocUrl: reader.mostRecentNavigatedTocItem(),
      });
    }
  }, [reader]);

  const setColorMode = React.useCallback(
    async (mode: ColorMode) => {
      if (!reader) return;
      dispatch({ type: 'SET_COLOR_MODE', mode });
      await reader.applyUserSettings({ appearance: mode });
    },
    [reader]
  );

  const setScroll = React.useCallback(
    async (val: 'scrolling' | 'paginated') => {
      const isScrolling = val === 'scrolling';
      await reader?.scroll(isScrolling);
      dispatch({ type: 'SET_SCROLL', isScrolling });
    },
    [reader]
  );

  const increaseFontSize = React.useCallback(async () => {
    if (!reader) return;
    const newSize = fontSize + FONT_SIZE_STEP;
    await reader.applyUserSettings({ fontSize: newSize });
    dispatch({ type: 'SET_FONT_SIZE', size: newSize });
  }, [reader, fontSize]);

  const decreaseFontSize = React.useCallback(async () => {
    if (!reader) return;
    const newSize = fontSize - FONT_SIZE_STEP;
    await reader.applyUserSettings({ fontSize: newSize });
    dispatch({ type: 'SET_FONT_SIZE', size: newSize });
  }, [reader, fontSize]);

  const setFontFamily = React.useCallback(
    async (family: FontFamily) => {
      if (!reader) return;
      const r2Family = familyToR2Family[family];
      // the applyUserSettings type is incorrect. We are supposed to pass in a string.
      await reader.applyUserSettings({ fontFamily: r2Family as any });
      dispatch({ type: 'SET_FONT_FAMILY', family });
    },
    [reader]
  );

  const goToPage = React.useCallback(
    (href) => {
      if (!reader) return;
      // Adding try/catch here because goTo throws a TypeError
      // if the TOC link you clicked on was the current page..
      try {
        reader.goTo({ href } as Locator); // This needs to be fixed, locations should be optional.
        dispatch({ type: 'SET_CURRENT_TOC_URL', currentTocUrl: href });
      } catch (error) {
        console.error(error);
      }
    },
    [reader]
  );

  const isLoading = !reader;

  // this format is inactive, return null
  if (!webpubManifestUrl || !manifest) return null;

  // we are initializing the reader
  if (isLoading) {
    return {
      type: null,
      isLoading: true,
      content: <HtmlReaderContent />,
      navigator: null,
      manifest: null,
      state: null,
    };
  }

  // the reader is active
  return {
    type: 'HTML',
    isLoading: false,
    content: <HtmlReaderContent />,
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

async function setBookBoundary(
  reader: D2Reader,
  dispatch: React.Dispatch<HtmlAction>
): Promise<void> {
  const isFirstResource = (await reader.currentResource()) === 0;
  const isResourceStart = (await reader.atStart()) && isFirstResource;

  const isLastResource =
    (await reader.currentResource()) === (await reader.totalResources()) - 1; // resource index starts with 0
  const isResourceEnd = (await reader.atEnd()) && isLastResource;

  dispatch({
    type: 'BOOK_BOUNDARY_CHANGED',
    atStart: isResourceStart,
    atEnd: isResourceEnd,
  });
}

function enableResizeEvent(
  reader: D2Reader,
  dispatch: React.Dispatch<HtmlAction>
) {
  const resizeHandler = () => {
    setBookBoundary(reader, dispatch);
  };

  const debouncedResizeHandler = debounce(resizeHandler, 500);
  window.addEventListener('resize', debouncedResizeHandler, { passive: true });
}
