import { Document, Outline, Page } from 'react-pdf/dist/esm/entry.parcel';

import React, { useState } from 'react';
import {
  ColorMode,
  ReaderArguments,
  ReaderReturn,
  ReaderState,
} from '../types';

type PdfState = ReaderState & {
  type: 'PDF';
  resource: string;
  pageNumber: number;
};

type PdfReaderAction =
  | { type: 'SET_COLOR_MODE'; mode: ColorMode }
  | { type: 'SET_SCROLL'; isScrolling: boolean }
  | { type: 'SET_RESOURCE'; resource: string }
  | { type: 'SET_PAGENUM'; pageNum: number };

function pdfReducer(state: PdfState, action: PdfReaderAction): PdfState {
  switch (action.type) {
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

    case 'SET_RESOURCE':
      return {
        ...state,
        resource: action.resource,
      };

    case 'SET_PAGENUM':
      return {
        ...state,
        pageNumber: action.pageNum,
      };
  }
}

export default function usePdfReader(args: ReaderArguments): ReaderReturn {
  const { webpubManifestUrl, manifest } = args ?? {};

  const [state, dispatch] = React.useReducer(pdfReducer, {
    type: 'PDF',
    colorMode: 'day',
    isScrolling: false,
    fontSize: 16,
    fontFamily: 'sans-serif',
    resource: '',
    pageNumber: 1,
  });

  const [numPages, setNumPages] = useState(0);
  const [isLoading, setLoading] = useState(true);

  // initialize the pdf reader
  React.useEffect(() => {
    console.log('initializing', manifest);
    // bail out if there is not manifest passed in,
    // that indicates that this format is inactive
    if (!manifest) return;

    // Fetch the resource, then pass it into the reader
    const resource: string =
      args?.proxyUrl + encodeURI(manifest.readingOrder![0].href);

    fetch(resource).then((pdf) => {
      console.log('pdf fetched', pdf);
      dispatch({ type: 'SET_RESOURCE', pdf.body });
    });
    setLoading(false);
    // here initialize reader however u do
  }, [manifest]);

  React.useEffect(() => {});
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
  if (isLoading) {
    return {
      isLoading: true,
      content: <>PDF is loading</>,
      manifest: null,
      navigator: null,
      state: null,
    };
  }

  function onDocumentLoadSuccess({
    numPages,
    pdf,
  }: {
    numPages: number;
    pdf: any;
  }) {
    console.log('pdf', pdf);
    setNumPages(numPages);
  }

  // function onItemClick({ pageNumber }: { pageNumber: number }) {
  //   console.log('pageNumber', pageNumber);
  //   const pageNum = pageNumber;
  //   dispatch({ type: 'SET_PAGENUM', pageNum });
  // }

  // the reader is active
  return {
    isLoading,
    content: (
      <Document file={state.resource} onLoadSuccess={onDocumentLoadSuccess}>
        {/* <Outline onItemClick={onItemClick} /> */}

        {state.isScrolling &&
          Array.from(new Array(numPages), (el, index) => (
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
