import React from 'react';
import EpubNavigator from './EpubNavigator';
import { AnyFormat, AxisNowEpubMimeType, GetContent } from './types';

export type UseWebReaderReturn = {
  isLoading: boolean;
  // we return fully formed JSX elements so the consumer doesn't need to know
  // how to instantiate them or what to pass to them, that's the responsibility
  // of this hook. The consumer just places it within their UI.
  content: JSX.Element;
};

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

  // Computed values
  const isLoading = !navigator;

  /**
   * Initialize the client, which has to be asynchronously initialized
   * because it might need to fetch the manifest or otherwise.
   */
  React.useEffect(() => {
    console.log('running', format);
    switch (format) {
      case AxisNowEpubMimeType:
        // When we initialize this, the content of the EpubNavigator needs to have already been rendered,
        // otherwise the navigator will fail to initialize and we will get an error.
        EpubNavigator.init(webpubManifestUrl, getContent).then(setNavigator);
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

  const content =
    format === 'application/webpub+axisnow+epub' ? (
      <EpubNavigator.content />
    ) : (
      'Not supported'
    );

  return {
    isLoading,
    content,
  };
}
