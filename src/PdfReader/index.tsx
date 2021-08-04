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
  resourceIndex: number;
  file: { data: Uint8Array } | null;
  // we only know the numPages once the file has been parsed
  numPages: number | null;
  // if pageNumber is -1, we will navigate to the end of the
  // resource once it is parsed
  pageNumber: number;
};

type PdfReaderAction =
  | {
      type: 'SET_CURRENT_RESOURCE';
      index: number;
      shouldNavigateToEnd: boolean;
    }
  | { type: 'RESOURCE_FETCH_SUCCESS'; file: { data: Uint8Array } }
  | { type: 'PDF_PARSED'; numPages: number }
  | { type: 'NAVIGATE_PAGE'; pageNum: number }
  | { type: 'SET_COLOR_MODE'; mode: ColorMode }
  | { type: 'SET_SCROLL'; isScrolling: boolean };

function pdfReducer(state: PdfState, action: PdfReaderAction): PdfState {
  switch (action.type) {
    // Changes reader to be in "loading" state
    case 'SET_CURRENT_RESOURCE':
      return {
        ...state,
        file: null,
        resourceIndex: action.index,
        pageNumber: action.shouldNavigateToEnd ? -1 : 1,
        numPages: null,
      };

    case 'RESOURCE_FETCH_SUCCESS':
      return {
        ...state,
        file: action.file,
      };

    // called when the file has been parsed by react-pdf
    // and we know the number of pages
    case 'PDF_PARSED':
      return {
        ...state,
        numPages: action.numPages,
        // if the state.pageNumber is -1, we know to navigate to the
        // end of the PDF that was just parsed
        pageNumber:
          state.pageNumber === -1 ? action.numPages : state.pageNumber,
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
  // Generate the resource URL using the proxy
  const resource: string =
    proxyUrl + encodeURI(manifest.readingOrder![resourceIndex].href);
  const response = await fetch(resource, { mode: 'cors' });
  const array = new Uint8Array(await response.arrayBuffer());

  if (!response.ok) {
    throw new Error('Response not Ok for URL: ' + resource);
  }
  return array;
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
    isScrolling: false,
    fontSize: 16,
    fontFamily: 'sans-serif',
    resourceIndex: 0,
    file: null,
    pageNumber: 1,
    numPages: null,
  });

  // state we can derive from the state above
  const isFetching = !state.file;
  const isParsed = typeof state.numPages === 'number';

  // initialize the pdf reader
  React.useEffect(() => {
    async function setPdfResource(manifest: WebpubManifest, proxyUrl: string) {
      const data = await loadResource(manifest, 0, proxyUrl);
      dispatch({
        type: 'RESOURCE_FETCH_SUCCESS',
        file: { data: data },
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
    // do nothing if we haven't parsed the number of pages yet
    if (!state.numPages) return;

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
      const nextIndex = state.resourceIndex + 1;
      dispatch({
        type: 'SET_CURRENT_RESOURCE',
        index: nextIndex,
        shouldNavigateToEnd: false,
      });

      const data = await loadResource(manifest, nextIndex, proxyUrl);
      dispatch({
        type: 'RESOURCE_FETCH_SUCCESS',
        file: { data },
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
    // do nothing if we haven't parsed the PDF yet
    if (!isParsed) return;

    if (state.pageNumber > 1) {
      dispatch({
        type: 'NAVIGATE_PAGE',
        pageNum: state.pageNumber - 1,
      });
    } else if (manifest?.readingOrder && state.resourceIndex > 0) {
      const nextIndex = state.resourceIndex - 1;
      dispatch({
        type: 'SET_CURRENT_RESOURCE',
        index: nextIndex,
        shouldNavigateToEnd: true,
      });

      const data = await loadResource(manifest, nextIndex, proxyUrl);

      dispatch({
        type: 'RESOURCE_FETCH_SUCCESS',
        file: { data },
      });
    }
  }, [manifest, proxyUrl, isParsed, state.pageNumber, state.resourceIndex]);

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

  if (isFetching) {
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
      type: 'PDF_PARSED',
      numPages: numPages,
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
          {isParsed && state.numPages && (
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
