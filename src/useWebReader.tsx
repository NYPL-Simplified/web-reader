import {
  ActiveReader,
  AnyConformsTo,
  AxisNowEpubConformsTo,
  LoadingReader,
  WebpubManifest,
  WebpubPdfConformsTo,
} from './types';
import React from 'react';
import { fetchJson } from './utils/fetch';
import HtmlReaderContent from './HtmlReader/HtmlReaderContent';
import usePdfReader from './PdfReader';
import useHtmlReader from './HtmlReader';

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
 * The React hook that exposes the main API into the reader. It
 * will determine the type of the webpub, and then use the correct reader
 * for that type.
 */
export default function useWebReader(
  webpubManifestUrl: string,
  options: UseWebReaderOptions = {}
): ActiveReader | LoadingReader {
  const [manifest, setManifest] = React.useState<WebpubManifest | null>(null);
  const readerType = getReaderType(
    manifest ? manifest.metadata.conformsTo : null
  );
  /**
   * Our HTML reader and PDf Reader. Note that we cannot conditionally
   * call a React hook, so we must _always_ call the hook, but allow for the
   * case where we call the hook with `undefined`, which tells the hook that
   * that format is inactive, and it will in turn return the InactiveState.
   */
  const htmlReader = useHtmlReader(
    readerType === 'HTML' && manifest
      ? {
          webpubManifestUrl,
          manifest,
        }
      : undefined
  );
  const proxyUrl = 'http://localhost:5000/utils/proxy?proxy_url=';
  // const proxyUrl = 'https://cors-anywhere.herokuapp.com/';
  const pdfReader = usePdfReader(
    readerType === 'PDF' && manifest
      ? {
          webpubManifestUrl,
          manifest,
          proxyUrl,
        }
      : undefined
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

  /**
   * Return whichever reader is not Inactive (not `null`)
   */
  if (htmlReader) {
    return htmlReader;
  }
  if (pdfReader) {
    return pdfReader;
  }

  throw new Error(
    `No reader was initialized for the webpub with url: ${webpubManifestUrl} and type: ${readerType}.`
  );
}
