/**
 * The React hook that exposes the main API into the reader.
 */

import React from 'react';
import { fetchJson } from './utils/fetch';
import HtmlNavigator from './HtmlNavigator';
import { VisualNavigator } from './Navigator';
import {
  AxisNowEpubConformsTo,
  GetContent,
  WebpubManifest,
  WebpubPdfConformsTo,
} from './types';

type LoadedWebReader = {
  isLoading: false;
  // we return fully formed JSX elements so the consumer doesn't need to know
  // how to instantiate them or what to pass to them, that's the responsibility
  // of this hook. The consumer just places it within their UI.
  content: JSX.Element;
  navigator: VisualNavigator;
  // we will replace this with a full Publication instance once we
  // can install it from readium/web. For now we will read things
  // directly from the manifest
  manifest: WebpubManifest;
};
type LoadingWebReader = {
  isLoading: true;
  content: JSX.Element;
  navigator: null;
  manifest: null;
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
  const { getContent } = options;
  const [navigator, setNavigator] = React.useState<null | HtmlNavigator>(null);
  const [manifest, setManifest] = React.useState<WebpubManifest | null>(null);

  // Asynchronously initialize the client
  React.useEffect(() => {
    // fetch the manifest
    fetchJson<WebpubManifest>(webpubManifestUrl).then((manifest) => {
      setManifest(manifest);

      const conformsTo = manifest.metadata?.conformsTo;

      switch (conformsTo) {
        case WebpubPdfConformsTo:
          // initialize a PDF Navigator
          throw new Error('Unimplemented PDF Manifest');
        /**
         * The default navigator is HTML, like we use for ePubs and
         * AxisNow encrypted ePubs
         */
        case undefined:
        case AxisNowEpubConformsTo:
          HtmlNavigator.init({ webpubManifestUrl, getContent }).then(
            setNavigator
          );
      }
    });
  }, [webpubManifestUrl, getContent]);

  // here we will need to switch based on what the manifest conforms to
  const content = <HtmlNavigator.Content />;

  if (!navigator || !manifest) {
    return {
      isLoading: true,
      content,
      navigator: null,
      manifest: null,
    };
  }
  return {
    isLoading: false,
    navigator,
    content,
    manifest,
  };
}
