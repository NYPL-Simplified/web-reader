import React from 'react';
import { ColorMode, ReaderReturn, ReaderState } from '../types';
import PDFContent from './PdfContent';

type PdfState = ReaderState & {
  type: 'PDF';
  // some pdf-specific state here, like the instance of the
  // package you are using if necessary
};

type PdfReaderAction =
  | { type: 'SET_COLOR_MODE'; mode: ColorMode }
  | { type: 'SET_SCROLL'; isScrolling: boolean };

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
  }
}

export default function usePdfReader(webpubManifestUrl?: string): ReaderReturn {
  const [state, dispatch] = React.useReducer(pdfReducer, {
    type: 'PDF',
    colorMode: 'day',
    isScrolling: false,
    fontSize: 16,
    fontFamily: 'sans-serif',
  });

  // initialize the pdf reader
  React.useEffect(() => {
    // bail out if there is not manifest url passed in,
    // that indicates that this format is inactive
    if (!webpubManifestUrl) return;
    // here initialize reader however u do
    // ...
  }, [webpubManifestUrl]);

  const goForward = React.useCallback(() => {
    console.log('unimplemented');
  }, []);

  const goBackward = React.useCallback(() => {
    console.log('unimplemented');
  }, []);
  const setColorMode = React.useCallback(async () => {
    console.log('unimplemented');
  }, []);
  const setScroll = React.useCallback(async () => {
    console.log('unimplemented');
  }, []);

  // this format is inactive, return null
  if (!webpubManifestUrl) return null;

  const isLoading = true;

  // we are initializing the reader
  if (isLoading) {
    return {
      isLoading: true,
      content: <PDFContent />,
    };
  }

  // the reader is active
  return {
    isLoading: false,
    content: <PDFContent />,
    state,
    navigator: {
      goForward,
      goBackward,
      setColorMode,
      setScroll,
    },
  };
}
