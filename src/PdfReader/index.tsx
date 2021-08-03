import { Document, Page } from 'react-pdf/dist/esm/entry.parcel';

import React from 'react';
import {
  ColorMode,
  ReaderArguments,
  ReaderReturn,
  ReaderState,
  WebpubManifest,
} from '../types';

type PdfState = ReaderState & {
  type: 'PDF';
  // The PDF information has been fetched
  fetchSuccess: boolean;
  // Is the PDF ready for display
  displayReady: boolean;
  resourceIndex: number;
  file: { data: Uint8Array } | null;
  numPages: number;
  pageNumber: number;
};

type PdfReaderAction =
  | { type: 'SET_LOADING' }
  | {
      type: 'PDF_FETCH_SUCCESS';
      file: { data: Uint8Array };
      index: number;
      direction?: 'previous' | 'next';
    }
  | {
      type: 'DOCUMENT_LOAD_SUCCESS';
      numPages: number;
      direction: 'previous' | 'next';
    }
  | { type: 'NAVIGATE_PAGE'; pageNum: number }
  | { type: 'SET_COLOR_MODE'; mode: ColorMode }
  | { type: 'SET_SCROLL'; isScrolling: boolean };

function pdfReducer(state: PdfState, action: PdfReaderAction): PdfState {
  switch (action.type) {
    // Changes reader to be in "loading" state
    case 'SET_LOADING':
      return {
        ...state,
        fetchSuccess: false,
        displayReady: false,
        file: null,
        pageNumber: 1,
      };

    // Changes reader to be in "loaded" state
    case 'PDF_FETCH_SUCCESS':
      return {
        ...state,
        file: action.file,
        fetchSuccess: true,
        resourceIndex: action.index,
        pageNumber: 1,
        displayReady: action.direction !== 'previous',
      };

    // Changes reader to be in success state
    case 'DOCUMENT_LOAD_SUCCESS':
      return {
        ...state,
        numPages: action.numPages,
        pageNumber: action.direction === 'previous' ? action.numPages : 1,
        displayReady: true,
      };

    // Navigates to page in resource
    case 'NAVIGATE_PAGE':
      return {
        ...state,
        pageNumber: action.pageNum,
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

const loadResource = async (
  manifest: WebpubManifest,
  resourceIndex: number,
  proxyUrl?: string
) => {
  async function fetchPdf<ExpectedResponse extends any = any>(url: string) {
    const response = await fetch(url, { mode: 'cors' });
    const array = new Uint8Array(await response.arrayBuffer());

    if (!response.ok) {
      throw new Error('Response not Ok for URL: ' + url);
    }
    return array as ExpectedResponse;
  }

  // Generate the resource URL using the proxy
  const resource: string =
    proxyUrl + encodeURI(manifest.readingOrder![resourceIndex].href);

  return await fetchPdf(resource);
};

/**
 * The PDF reader
 *
 * The PDF reader loads files in two stages:  First, it fetches the PDF file as an Uint8Array
 * Then, it passes this array into the <Document> object, which loads the PDF inside an iframe
 *
 * @param args T
 * @returns
 */
export default function usePdfReader(args: ReaderArguments): ReaderReturn {
  const { webpubManifestUrl, manifest, proxyUrl = '' } = args ?? {};

  const [state, dispatch] = React.useReducer(pdfReducer, {
    type: 'PDF',
    colorMode: 'day',
    fetchSuccess: false,
    displayReady: false,
    isScrolling: false,
    fontSize: 16,
    fontFamily: 'sans-serif',
    resourceIndex: 0,
    file: null,
    pageNumber: 1,
    numPages: 0,
  });

  // initialize the pdf reader
  React.useEffect(() => {
    async function setPdfResource(manifest: WebpubManifest, proxyUrl: string) {
      const data = await loadResource(manifest, 0, proxyUrl);
      dispatch({
        type: 'PDF_FETCH_SUCCESS',
        file: { data: data },
        index: 0,
      });
    }
    // bail out if there is not manifest passed in,
    // that indicates that this format is inactive
    if (!manifest) return;
    // throw an error on a badly formed manifest
    if (!manifest.readingOrder || !manifest.readingOrder.length) {
      throw new Error('Manifest has no Reading Order');
    }

    setPdfResource(manifest, proxyUrl);
  }, [proxyUrl, manifest]);

  // prev and next page functions
  const goForward = React.useCallback(async () => {
    if (state.pageNumber < state.numPages) {
      dispatch({
        type: 'NAVIGATE_PAGE',
        pageNum: state.pageNumber + 1,
      });
    } else if (
      manifest &&
      manifest.readingOrder &&
      state.resourceIndex < manifest?.readingOrder?.length - 1
    ) {
      dispatch({ type: 'SET_LOADING' });

      const data = await loadResource(
        manifest,
        state.resourceIndex + 1,
        proxyUrl
      );
      dispatch({
        type: 'PDF_FETCH_SUCCESS',
        file: { data },
        index: state.resourceIndex + 1,
        direction: 'next',
      });
    }
    // Do nothing if it's at the last page of the last resource
  }, [
    manifest,
    proxyUrl,
    state.numPages,
    state.pageNumber,
    state.resourceIndex,
  ]);

  const goBackward = React.useCallback(async () => {
    if (state.pageNumber > 1) {
      dispatch({
        type: 'NAVIGATE_PAGE',
        pageNum: state.pageNumber - 1,
      });
    } else if (manifest && manifest.readingOrder && state.resourceIndex > 0) {
      dispatch({ type: 'SET_LOADING' });

      const data = await loadResource(
        manifest,
        state.resourceIndex - 1,
        proxyUrl
      );

      dispatch({
        type: 'PDF_FETCH_SUCCESS',
        file: { data },
        index: state.resourceIndex - 1,
        direction: 'previous',
      });
    }
  }, [manifest, proxyUrl, state.pageNumber, state.resourceIndex]);

  /**
   * These ones don't make sense in the PDF case I dont think. I'm still
   * deciding how we will separate the types of Navigators and States, so
   * for now just pass dummies through.
   */
  const setColorMode = React.useCallback(async () => {
    console.log('unimplemented');
  }, []);

  const setScroll = React.useCallback(
    async (val: 'scrolling' | 'paginated') => {
      const isScrolling = val === 'scrolling';
      dispatch({ type: 'SET_SCROLL', isScrolling });
    },
    []
  );

  const increaseFontSize = React.useCallback(async () => {
    console.log('unimplemented');
  }, []);
  const decreaseFontSize = React.useCallback(async () => {
    console.log('unimplemented');
  }, []);

  const setFontFamily = React.useCallback(async () => {
    console.log('unimplemented');
  }, []);

  // this format is inactive, return null
  if (!webpubManifestUrl || !manifest) return null;

  if (!state.fetchSuccess) {
    // The Reader is fetching a PDF file
    return {
      isLoading: false,
      content: (
        <main
          style={{ height: 'calc(100vh - 100px)' }}
          tabIndex={-1}
          id="iframe-wrapper"
        >
          PDF is loading
        </main>
      ),
      state,
      manifest,
      navigator: {
        goForward,
        goBackward,
        increaseFontSize,
        decreaseFontSize,
        setFontFamily,
        setColorMode,
        setScroll,
      },
    };
  }

  function onDocumentLoadSuccess({ numPages }: { numPages: number }) {
    dispatch({
      type: 'DOCUMENT_LOAD_SUCCESS',
      numPages: numPages,
      direction: state.displayReady ? 'next' : 'previous',
    });
  }

  // the reader is active but loading a page
  return {
    isLoading: false,
    content: (
      <main
        style={{ height: 'calc(100vh - 100px)' }}
        tabIndex={-1}
        id="iframe-wrapper"
      >
        <Document file={state.file} onLoadSuccess={onDocumentLoadSuccess}>
          {state.displayReady && (
            <>
              {state.isScrolling &&
                Array.from(new Array(state.numPages), (index) => (
                  <Page key={`page_${index + 1}`} pageNumber={index + 1} />
                ))}
              {!state.isScrolling && (
                <Page pageNumber={state.pageNumber} loading={<></>} />
              )}
            </>
          )}
        </Document>
      </main>
    ),
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
    },
  };
}
