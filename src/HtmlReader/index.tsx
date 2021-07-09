import D2Reader from '@d-i-t-a/reader';
import React from 'react';
import injectables from './injectables';
import {
  ColorMode,
  ReaderState,
  ReaderReturn,
  WebpubManifest,
  InactiveReaderArguments,
  InactiveReader,
  ActiveReaderArguments,
  LoadingReader,
  ActiveReader,
  ReaderArguments,
} from '../types';
import HtmlReaderContent from './HtmlReaderContent';

type HtmlState = ReaderState & {
  reader: D2Reader | undefined;
  type: 'HTML';
};

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

export type HtmlNavigatorAction =
  | { type: 'SET_READER'; reader: D2Reader }
  | { type: 'SET_COLOR_MODE'; mode: ColorMode }
  | { type: 'SET_SCROLL'; isScrolling: boolean };

function hmtlNavigatorReducer(
  state: HtmlState,
  action: HtmlNavigatorAction
): HtmlState {
  switch (action.type) {
    case 'SET_READER':
      // set all the initial settings taken from the reader
      const settings = action.reader.currentSettings;
      return {
        type: 'HTML',
        reader: action.reader,
        isScrolling: settings.verticalScroll,
        colorMode: getColorMode(settings.appearance),
        fontSize: settings.fontSize,
        fontFamily: settings.fontFamily,
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
  }
}

export default function useHtmlReader(args: ReaderArguments): ReaderReturn {
  const { webpubManifestUrl, manifest } = args ?? {};
  const [state, dispatch] = React.useReducer(hmtlNavigatorReducer, {
    type: 'HTML',
    colorMode: 'day',
    isScrolling: false,
    fontSize: 16,
    fontFamily: 'sans-serif',
    reader: undefined,
  });

  const { reader } = state;

  // initialize the reader
  React.useEffect(() => {
    // bail out if there is no webpubManifestUrl. It indicates this format is not being used.
    if (!webpubManifestUrl) return;
    const url = new URL(webpubManifestUrl);

    D2Reader.build({
      url,
      injectables: injectables,
      injectablesFixed: [],
    }).then((reader) => {
      dispatch({ type: 'SET_READER', reader });
    });
  }, [webpubManifestUrl]);

  // prev and next page functions
  const goForward = React.useCallback(() => {
    console.log('Go forward', reader);
    if (!reader) return;
    reader.nextPage();
  }, [reader]);

  const goBackward = React.useCallback(() => {
    if (!reader) return;
    reader.previousPage();
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

  const isLoading = !reader;

  // this format is inactive, return null
  if (!webpubManifestUrl || !manifest) return null;

  // we are initializing the reader
  if (isLoading) {
    return {
      isLoading: true,
      content: <HtmlReaderContent />,
      navigator: null,
      manifest: null,
      state: null,
    };
  }

  // the reader is active
  return {
    isLoading: false,
    content: <HtmlReaderContent />,
    state,
    manifest,
    navigator: {
      goForward,
      goBackward,
      setColorMode,
      setScroll,
    },
  };
}
