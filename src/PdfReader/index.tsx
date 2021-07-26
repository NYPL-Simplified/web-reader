import { Document, Page } from 'react-pdf/dist/esm/entry.parcel';

import React from 'react';
import {
  ColorMode,
  ReaderArguments,
  ReaderReturn,
  ReaderState,
} from '../types';
import PDFContent from './PdfContent';

type PdfState = ReaderState & {
  type: 'PDF';
  resource: string;
  // some pdf-specific state here, like the instance of the
  // package you are using if necessary
};

type PdfReaderAction =
  | { type: 'SET_COLOR_MODE'; mode: ColorMode }
  | { type: 'SET_SCROLL'; isScrolling: boolean }
  | { type: 'SET_RESOURCE'; resource: string };

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
  }
}

export default function usePdfReader(args: ReaderArguments): ReaderReturn {
  console.log('got here');
  const { webpubManifestUrl, manifest } = args ?? {};

  const [state, dispatch] = React.useReducer(pdfReducer, {
    type: 'PDF',
    colorMode: 'day',
    isScrolling: false,
    fontSize: 16,
    fontFamily: 'sans-serif',
    resource: '',
  });

  // initialize the pdf reader
  React.useEffect(() => {
    console.log('initializing', manifest);
    // bail out if there is not manifest passed in,
    // that indicates that this format is inactive
    if (!manifest) return;
    const resource: string = manifest.readingOrder![0].href;
    console.log('resource', resource);
    dispatch({ type: 'SET_RESOURCE', resource });
    // here initialize reader however u do
  }, [manifest]);

  /**
   * Here you add the functionality, either directly working with the iframe
   * or through PDF.js. You should update the internal state. In the PDF case,
   * you will probably want to store which resource you are currently on and
   * update that on goForward or goBackward
   */
  const goForward = React.useCallback(() => {
    console.log('unimplemented');
  }, []);

  const goBackward = React.useCallback(() => {
    console.log('unimplemented');
  }, []);

  /**
   * These ones don't make sense in the PDF case I dont think. I'm still
   * deciding how we will separate the types of Navigators and States, so
   * for now just pass dummies through.
   */
  const setColorMode = React.useCallback(async () => {
    console.log('unimplemented');
  }, []);
  const setScroll = React.useCallback(async () => {
    console.log('unimplemented');
  }, []);

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

  const isLoading = false;

  // we are initializing the reader
  if (isLoading) {
    return {
      isLoading: true,
      content: <PDFContent resource={''} />,
      manifest: null,
      navigator: null,
      state: null,
    };
  }

  function onDocumentLoadSuccess({ numPages }: { numPages: number }) {
    console.log('success');
  }

  // the reader is active
  return {
    isLoading: false,
    content: (
      <Document file={state.resource} onLoadSuccess={onDocumentLoadSuccess}>
        <Page pageNumber={1} />
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
