import React from 'react';
import EpubNavigator from './epub/EpubNavigator';
import { fetchJson } from './fetch';
import { VisualNavigator } from './Navigator';
import {
  AnyFormat,
  AxisNowEpubMimeType,
  GetContent,
  WebpubManifest,
  WebpubMimeType,
} from './types';

// we return fully formed JSX elements so the consumer doesn't need to know
// how to instantiate them or what to pass to them, that's the responsibility
// of this hook. The consumer just places it within their UI.
type LoadedWebReader = {
  isLoading: false;
  content: JSX.Element;
  navigator: VisualNavigator;
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
  getContent?: GetContent;
};
export default function useWebReader(
  format: AnyFormat,
  webpubManifestUrl: string,
  // a function to fetch / decrypt content
  options: UseWebReaderOptions = {}
): UseWebReaderReturn {
  const { getContent } = options;
  const [navigator, setNavigator] = React.useState<null | EpubNavigator>(null);
  // we will replace this with a Publication instance once we
  // can install it from readium/web
  const [manifest, setManifest] = React.useState<WebpubManifest | null>(null);

  /**
   * Initialize the client, which has to be asynchronously initialized
   * because it might need to fetch the manifest or otherwise.
   */
  React.useEffect(() => {
    switch (format) {
      case AxisNowEpubMimeType:
        // When we initialize this, the content of the EpubNavigator needs to have already been rendered,
        // otherwise the navigator will fail to initialize and we will get an error.
        EpubNavigator.init({ webpubManifestUrl, getContent }).then(
          setNavigator
        );
        break;
      case WebpubMimeType:
        EpubNavigator.init({ webpubManifestUrl }).then(setNavigator);
        break;
      // case PdfMimeType:
      //   PdfClient.init(entrypoint, setLocation).then(setClient);
      //   break;
      // case EpubMimeType:
      //   EpubClient.init(entrypoint, setLocation).then(setClient);
      //   break;
      default:
        throw new Error('Unimplemented format: ' + format);
    }
  }, [format, webpubManifestUrl, getContent]);

  // fetch and store the manifest
  React.useEffect(() => {
    fetchJson<WebpubManifest>(webpubManifestUrl).then((manifest) => {
      setManifest(manifest);
    });
  }, [webpubManifestUrl]);

  const content =
    format === 'application/webpub+axisnow+epub' ? (
      <EpubNavigator.Content />
    ) : format === 'application/webpub' ? (
      <EpubNavigator.Content />
    ) : (
      <div>Not Supported</div>
    );

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
