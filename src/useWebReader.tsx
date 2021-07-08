/**
 * The React hook that exposes the main API into the reader.
 */

import React from 'react';
import { fetchJson } from './utils/fetch';
import HtmlNavigator from './HtmlNavigator';
import Navigator from './Navigator';
import {
  AxisNowEpubConformsTo,
  GetContent,
  WebpubManifest,
  WebpubPdfConformsTo,
} from './types';
import { ColorMode } from '@chakra-ui/react';
import useHtmlNavigator, {
  UseHtmlNavigatorReturn,
} from './HtmlNavigator/useHtmlNavigator';

type LoadedWebReader = {
  isLoading: false;
  // we return fully formed JSX elements so the consumer doesn't need to know
  // how to instantiate them or what to pass to them, that's the responsibility
  // of this hook. The consumer just places it within their UI.
  content: JSX.Element;
  // we will replace this with a full Publication instance once we
  // can install it from readium/web. For now we will read things
  // directly from the manifest
  // manifest: WebpubManifest;
  navigator: UseHtmlNavigatorReturn;
};

type LoadingWebReader = {
  isLoading: true;
  content: JSX.Element;
  navigator: null;
};

export type UseWebReaderReturn = LoadedWebReader | LoadingWebReader;

type UseWebReaderOptions = {
  // a function to fetch / decrypt content
  getContent?: GetContent;
};
export default function useWebReader(
  webpubManifestUrl: string,
  options: UseWebReaderOptions = {}
): UseWebReaderReturn {
  const navigator = useHtmlNavigator(webpubManifestUrl);
  const { content, isLoading } = navigator;

  if (navigator.isLoading) {
    return {
      isLoading: true,
      content,
      navigator: null,
    };
  }
  return {
    isLoading: false,
    content,
    navigator,
  };
}
