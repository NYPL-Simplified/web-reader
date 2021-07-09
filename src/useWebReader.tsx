import {
  AnyConformsTo,
  AxisNowEpubConformsTo,
  ReaderReturn,
  WebpubManifest,
  WebpubPdfConformsTo,
} from './types';
import useHtmlNavigator from './HtmlReader';
import React from 'react';
import { fetchJson } from './utils/fetch';
import HtmlReaderContent from './HtmlReader/HtmlReaderContent';

type UseWebReaderOptions = {
  // TBD
};

function getReaderType(conformsTo: AnyConformsTo | null | undefined) {
  switch (conformsTo) {
    case AxisNowEpubConformsTo:
      return 'HTML';
    case WebpubPdfConformsTo:
      return 'PDF';
    case undefined:
      // the manifest didn't indicate any conformsTo,
      // so return our default
      return 'HTML';
    case null:
      // the manifest is still loading, return undefined
      return undefined;
  }
}

/**
 * The React hook that exposes the main API into the reader.
 */
export default function useWebReader(
  webpubManifestUrl: string,
  options: UseWebReaderOptions = {}
): ReaderReturn {
  const [manifest, setManifest] = React.useState<WebpubManifest | null>(null);
  const readerType = getReaderType(
    manifest ? manifest.metadata.conformsTo : null
  );

  const htmlReader = useHtmlNavigator(
    readerType === 'HTML' ? webpubManifestUrl : undefined,
    manifest
  );

  // fetch the manifest and set it in state
  React.useEffect(() => {
    fetchJson<WebpubManifest>(webpubManifestUrl).then(setManifest);
  }, [webpubManifestUrl]);

  // first if we are still fetching the manifest, return loading
  if (manifest === null) {
    return {
      isLoading: true,
      content: <HtmlReaderContent />,
      manifest: null,
      navigator: null,
      state: null,
    };
  }

  // first handle the case of the html reader
  if (htmlReader) {
    return htmlReader;
  }

  console.log(readerType, manifest.metadata.conformsTo);
  throw new Error('No reader was initialized for the webpub');
}
