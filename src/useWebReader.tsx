import React from 'react';
import { fetchJson } from './utils/fetch';
import HtmlReaderContent from './HtmlReader/HtmlReaderContent';
import usePdfReader from './PdfReader';
import useHtmlReader from './HtmlReader';
import {
  UseWebReaderArguments,
  HTMLActiveReader,
  LoadingReader,
  PDFActiveReader,
  WebpubManifest,
} from './types';
import {
  AxisNowEpubConformsTo,
  WebpubPdfConformsTo,
  ConformsTo,
} from './WebpubManifestTypes/ConformsTo';

function getReaderType(conformsTo: ConformsTo | null | undefined) {
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
  args: UseWebReaderArguments
): HTMLActiveReader | PDFActiveReader | LoadingReader {
  const {
    webpubManifestUrl,
    getContent,
    proxyUrl,
    pdfWorkerSrc,
    injectables,
    injectablesFixed,
  } = args;
  const [manifest, setManifest] = React.useState<WebpubManifest | null>(null);
  const [error, setError] = React.useState<Error | null>(null);
  // if there is an error that occurred, we want to throw it so that
  // consumers can catch it in an ErrorBoundary
  if (error) {
    throw error;
  }

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
          getContent,
          injectables,
          injectablesFixed,
        }
      : undefined
  );

  const pdfReader = usePdfReader(
    readerType === 'PDF' && manifest
      ? {
          webpubManifestUrl,
          manifest,
          proxyUrl,
          pdfWorkerSrc,
        }
      : undefined
  );

  // fetch the manifest and set it in state
  React.useEffect(() => {
    fetchJson<WebpubManifest>(webpubManifestUrl)
      .then(setManifest)
      .catch(setError);
  }, [webpubManifestUrl]);

  // first if we are still fetching the manifest, return loading
  if (manifest === null) {
    return {
      isLoading: true,
      content: <HtmlReaderContent />,
      manifest: null,
      navigator: null,
      state: null,
      type: null,
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
