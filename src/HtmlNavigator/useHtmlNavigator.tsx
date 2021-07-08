import D2Reader from '@d-i-t-a/reader';
import React from 'react';
import HtmlNavigatorContent from './HtmlNavigatorContent';
import injectables from './injectables';
import { ColorMode } from '../types';

export type HtmlNavigatorState = {
  type: 'HTML';
  colorMode: ColorMode;
  isScrolling: boolean;
  fontSize: number;
  fontFamily: string; //'serif' | 'sans-serif';
  reader: D2Reader | undefined;
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
  state: HtmlNavigatorState,
  action: HtmlNavigatorAction
): HtmlNavigatorState {
  switch (action.type) {
    case 'SET_READER':
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

export type UseHtmlNavigatorReturn = HtmlNavigatorState & {
  isLoading: boolean;
  goForward: () => void;
  goBackward: () => void;
  setColorMode: (mode: ColorMode) => Promise<void>;
  setScroll: (val: 'scrolling' | 'paginated') => Promise<void>;
  content: JSX.Element;
};

export default function useHtmlNavigator(
  webpubManifestUrl: string
): UseHtmlNavigatorReturn {
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
  return {
    content: <HtmlNavigatorContent />,
    ...state,
    isLoading,
    goForward,
    goBackward,
    setColorMode,
    setScroll,
  };
}
