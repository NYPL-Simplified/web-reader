import D2Reader from '@d-i-t-a/reader';
import React from 'react';
import {
  ColorMode,
  HtmlReaderState,
  ReaderReturn,
  ReaderArguments,
  FontFamily,
  ReaderSettings,
  ReaderState,
} from '../types';
import HtmlReaderContent from './HtmlReaderContent';
import { Locator } from '@d-i-t-a/reader';
import { HEADER_HEIGHT } from '../ui/constants';
import '../../node_modules/@d-i-t-a/reader/dist/reader.css';
import { Injectable } from '@d-i-t-a/reader/dist/types/navigator/IFrameNavigator';
import { UserSettings } from '@d-i-t-a/reader/dist/types/model/user-settings/UserSettings';

type HtmlState = HtmlReaderState & {
  reader: D2Reader | undefined;
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
  | { type: 'SET_CURRENT_TOC_URL'; currentTocUrl: string };

function htmlReducer(state: HtmlState, action: HtmlAction): HtmlState {
  switch (action.type) {
    case 'SET_READER': {
      // set all the initial settings taken from the reader
      const settings = action.reader.currentSettings();
      console.log('state', settings);
      return {
        reader: action.reader,
        isScrolling: settings.verticalScroll,
        colorMode: getColorMode(settings.appearance),
        fontSize: settings.fontSize,
        fontFamily: r2FamilyToFamily[settings.fontFamily] ?? 'publisher',
        currentTocUrl: action.reader.mostRecentNavigatedTocItem(), // This returns a relative href
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
  }
}

const FONT_SIZE_STEP = 4;
// Using ReaderState here as type because ReaderSettings seems to run into
// Type Errors with the Reducer
const defaultReaderSettings: ReaderState = {
  colorMode: 'day',
  isScrolling: false,
  fontSize: 16,
  fontFamily: 'sans-serif',
  currentTocUrl: null,
};

export default function useHtmlReader(args: ReaderArguments): ReaderReturn {
  const {
    webpubManifestUrl,
    manifest,
    getContent,
    injectables = defaultInjectables,
    injectablesFixed = defaultInjectablesFixed,
    readerSettings,
  } = args ?? {};

  const [state, dispatch] = React.useReducer(htmlReducer, {
    ...defaultReaderSettings,
    reader: undefined,
  });

  // used to handle async errors thrown in useEffect
  const [error, setError] = React.useState<Error | undefined>(undefined);
  if (error) {
    throw error;
  }

  const { reader, fontSize } = state;

  // initialize the reader
  React.useEffect(() => {
    // bail out if there is no webpubManifestUrl. It indicates this format is not being used.
    if (!webpubManifestUrl) return;
    const url = new URL(webpubManifestUrl);

    const initialReaderSettings: ReaderState = {
      colorMode: readerSettings?.colorMode ?? defaultReaderSettings.colorMode,
      isScrolling:
        readerSettings?.isScrolling ?? defaultReaderSettings.isScrolling,
      fontSize: readerSettings?.fontSize ?? defaultReaderSettings.fontSize,
      fontFamily:
        readerSettings?.fontFamily ?? defaultReaderSettings.fontFamily,
      currentTocUrl: null,
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
      userSettings: {
        appearance: getD2Appearance(initialReaderSettings.colorMode),
        fontSize: initialReaderSettings.fontSize,
        fontFamily: initialReaderSettings.fontFamily,
        verticalScroll: initialReaderSettings.isScrolling,
      },
      api: {
        getContent: getContent as any, //TODO: fix this casting,
        onError: function (e: Error) {
          setError(e);
        },
      } as any, //TODO: fix this casting,,
    }).then((reader) => {
      dispatch({ type: 'SET_READER', reader });
    });
  }, [
    webpubManifestUrl,
    getContent,
    injectables,
    injectablesFixed,
    readerSettings,
  ]);

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
      console.log('isScrolling', isScrolling);
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

function getD2Appearance(colorMode: string): string {
  switch (colorMode) {
    case 'day':
      return 'readium-default-on';
    case 'nightn':
      return 'readium-night-on';
    case 'sepia':
      return 'readium-sepia-on';
    default:
      console.error('COLOR MODE SLIPPED THROUG', colorMode);
      return 'readium-default-on';
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
