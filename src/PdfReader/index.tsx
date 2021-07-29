import { Document, Outline, Page } from 'react-pdf/dist/esm/entry.parcel';

import React, { useMemo, useState } from 'react';
import {
  ColorMode,
  ReaderArguments,
  ReaderReturn,
  ReaderState,
} from '../types';

type PdfState = ReaderState & {
  type: 'PDF';
  loadSuccess: boolean;
  resource: string | null;
  data: Uint8Array | null;
  numPages: number;
  pageNumber: number;
};

type PdfReaderAction =
  | { type: 'LOAD_SUCCESS'; success: boolean }
  | { type: 'SET_RESOURCE'; resource: string }
  | { type: 'SET_DATA'; data: Uint8Array }
  | { type: 'SET_COLOR_MODE'; mode: ColorMode }
  | { type: 'SET_SCROLL'; isScrolling: boolean }
  | { type: 'SET_NUMPAGES'; numPages: number }
  | { type: 'SET_PAGENUM'; pageNum: number };

function pdfReducer(state: PdfState, action: PdfReaderAction): PdfState {
  switch (action.type) {
    case 'LOAD_SUCCESS': {
      return {
        ...state,
        loadSuccess: action.success,
      };
    }

    case 'SET_RESOURCE':
      return {
        ...state,
        resource: action.resource,
      };

    case 'SET_DATA':
      return {
        ...state,
        data: action.data,
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

    case 'SET_NUMPAGES':
      return {
        ...state,
        numPages: action.numPages,
      };

    case 'SET_PAGENUM':
      return {
        ...state,
        pageNumber: action.pageNum,
      };
  }
}
async function fetchPdf<ExpectedResponse extends any = any>(url: string) {
  console.log('fetchPdf called', url);
  const response = await fetch(url, { mode: 'cors' });
  const array = new Uint8Array(await response.arrayBuffer());

  if (!response.ok) {
    throw new Error('Response not Ok for URL: ' + url);
  }
  return array as ExpectedResponse;
}

export default function usePdfReader(args: ReaderArguments): ReaderReturn {
  const { webpubManifestUrl, manifest, proxyUrl } = args ?? {};

  const [state, dispatch] = React.useReducer(pdfReducer, {
    type: 'PDF',
    loadSuccess: false,
    colorMode: 'day',
    isScrolling: false,
    fontSize: 16,
    fontFamily: 'sans-serif',
    resource: null,
    data: null,
    pageNumber: 1,
    numPages: 0,
  });

  const file = useMemo(() => {
    return { data: state.data };
  }, [state.data]);

  // initialize the pdf reader
  React.useEffect(() => {
    async function setFile(resource: string) {
      const data = await fetchPdf(resource);
      dispatch({ type: 'SET_DATA', data });
    }
    // bail out if there is not manifest passed in,
    // that indicates that this format is inactive
    if (!manifest) return;
    if (!manifest.readingOrder || !manifest.readingOrder.length) {
      throw new Error('Manifest has no Reading Order');
    }

    // Fetch the resource, then pass it into the reader
    const resource: string =
      proxyUrl + encodeURI(manifest.readingOrder[0].href);

    dispatch({ type: 'SET_RESOURCE', resource });
    setFile(resource);
  }, [proxyUrl, manifest]);

  /**
   * Here you add the functionality, either directly working with the iframe
   * or through PDF.js. You should update the internal state. In the PDF case,
   * you will probably want to store which resource you are currently on and
   * update that on goForward or goBackward
   */
  const goForward = React.useCallback(() => {
    const pageNum = state.pageNumber + 1;
    dispatch({ type: 'SET_PAGENUM', pageNum });
  }, [state.pageNumber]);

  const goBackward = React.useCallback(() => {
    const pageNum = state.pageNumber - 1;
    dispatch({ type: 'SET_PAGENUM', pageNum });
  }, [state.pageNumber]);

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

  // we are initializing the reader
  if (!state.data) {
    return {
      isLoading: true,
      content: <>PDF is loading</>,
      manifest: null,
      navigator: null,
      state: null,
    };
  }

  function onDocumentLoadSuccess({ numPages }: { numPages: number }) {
    dispatch({ type: 'LOAD_SUCCESS', success: true });
    dispatch({ type: 'SET_NUMPAGES', numPages: numPages });
  }

  // function onItemClick({ pageNumber }: { pageNumber: number }) {
  //   console.log('pageNumber', pageNumber);
  //   const pageNum = pageNumber;
  //   dispatch({ type: 'SET_PAGENUM', pageNum });
  // }

  // the reader is active
  return {
    isLoading: false,
    content: (
      <Document file={file} onLoadSuccess={onDocumentLoadSuccess}>
        {/* <Outline onItemClick={onItemClick} /> */}

        {state.isScrolling &&
          Array.from(new Array(state.numPages), (index) => (
            <Page key={`page_${index + 1}`} pageNumber={index + 1} />
          ))}
        {!state.isScrolling && <Page pageNumber={state.pageNumber} />}
      </Document>
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
