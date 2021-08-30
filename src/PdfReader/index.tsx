import { Document, Page, PageProps, pdfjs } from 'react-pdf';
import * as React from 'react';
import {
  ColorMode,
  ReaderArguments,
  ReaderReturn,
  ReaderState,
  WebpubManifest,
} from '../types';
import { chakra, Flex, shouldForwardProp } from '@chakra-ui/react';
import useMeasure from './useMeasure';
import 'react-pdf/dist/esm/Page/AnnotationLayer.css';
type PdfState = ReaderState & {
  type: 'PDF';
  resourceIndex: number;
  file: { data: Uint8Array } | null;
  // we only know the numPages once the file has been parsed
  numPages: number | null;
  // if pageNumber is -1, we will navigate to the end of the
  // resource once it is parsed
  pageNumber: number;
  scale: number;
  pdfHeight: number;
  pdfWidth: number;
  pageHeight: number | undefined;
  pageWidth: number | undefined;
};

pdfjs.GlobalWorkerOptions.workerSrc = `pdf.worker.min.js`;

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
  | { type: 'SET_SCALE'; scale: number }
  | { type: 'SET_SCROLL'; isScrolling: boolean }
  | { type: 'PAGE_LOAD_SUCCESS'; height: number; width: number }
  | {
      type: 'RESIZE_PAGE';
      height: number | undefined;
      width: number | undefined;
    };
const IFRAME_WRAPPER_ID = 'iframe-wrapper';

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

    case 'SET_SCALE':
      return {
        ...state,
        scale: action.scale,
      };

    case 'PAGE_LOAD_SUCCESS':
      return {
        ...state,
        pdfWidth: action.width,
        pdfHeight: action.height,
        pageWidth: action.width,
        pageHeight: action.height,
      };

    case 'RESIZE_PAGE':
      return {
        ...state,
        pageWidth: action.width,
        pageHeight: action.height,
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
    proxyUrl + encodeURI(manifest.readingOrder[resourceIndex].href);
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
    currentTocUrl: null,
    resourceIndex: 0,
    file: null,
    pageNumber: 1,
    numPages: null,
    scale: 1,
    pdfWidth: 0,
    pdfHeight: 0,
    pageHeight: undefined,
    pageWidth: undefined,
  });

  // state we can derive from the state above
  const isFetching = !state.file;
  const isParsed = typeof state.numPages === 'number';
  const [containerRef, containerSize] = useMeasure<HTMLDivElement>();

  // Wrap Page component so that we can pass it styles
  const ChakraPage = chakra(Page, {
    shouldForwardProp: (prop) => {
      // Definitely forward width and height
      if (['width', 'height', 'scale'].includes(prop)) return true;
      // don't forward the rest of Chakra's props
      const isChakraProp = !shouldForwardProp(prop);
      if (isChakraProp) return false;
      // else, only forward `sample` prop
      return true;
    },
    baseStyle: {
      outline: '1px',
      outlineColor: 'ui.gray.light-cool',
    },
  });

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

  /**
   * calculate the height or width of the pdf page in paginated mode.
   *  - if the page's aspect ratio is taller than the container's, we will constrain
   *    the page to the height of the container.
   *  - if the page's aspect ratio is wider than the container's, we will constrain
   *    the page to the width of the container
   */

  const resizePage = React.useCallback(
    (
      pdfWidth: number,
      pdfHeight: number,
      containerSize: { width: number; height: number }
    ) => {
      const wRatio = pdfWidth / containerSize.width;
      const hRatio = pdfHeight / containerSize.height;

      const fitHorizontal = wRatio > hRatio;
      const width = fitHorizontal ? Math.round(containerSize.width) : undefined;
      const height = !fitHorizontal
        ? Math.round(containerSize.height)
        : undefined;

      dispatch({ type: 'RESIZE_PAGE', width, height });
    },
    []
  );

  //TODO: Somehow, this window size updates when height
  React.useEffect(() => {
    if (containerSize) {
      resizePage(state.pdfWidth, state.pdfHeight, containerSize);
    }
  }, [containerSize, state.pdfWidth, state.pdfHeight, resizePage]);

  // prev and next page functions
  const goForward = React.useCallback(async () => {
    // do nothing if we haven't parsed the number of pages yet
    if (!state.numPages) return;

    if (state.pageNumber < state.numPages && !state.isScrolling) {
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
    state.isScrolling,
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
        shouldNavigateToEnd: !state.isScrolling,
      });

      const data = await loadResource(manifest, nextIndex, proxyUrl);

      dispatch({
        type: 'RESOURCE_FETCH_SUCCESS',
        file: { data },
      });
    }
  }, [
    manifest,
    proxyUrl,
    isParsed,
    state.isScrolling,
    state.pageNumber,
    state.resourceIndex,
  ]);

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

  /**
   * TODO: Change this button into a different "scale" button
   */
  const increaseFontSize = React.useCallback(async () => {
    dispatch({
      type: 'SET_SCALE',
      scale: state.scale + 0.1,
    });
  }, [state.scale]);

  const decreaseFontSize = React.useCallback(async () => {
    dispatch({
      type: 'SET_SCALE',
      scale: state.scale - 0.1,
    });
  }, [state.scale]);

  const setFontFamily = React.useCallback(async () => {
    console.log('unimplemented');
  }, []);

  const goToPage = React.useCallback(async () => {
    console.log('unimplemented');
  }, []);

  // this format is inactive, return null
  if (!webpubManifestUrl || !manifest) return null;

  if (isFetching) {
    // The Reader is fetching a PDF file
    return {
      isLoading: false,
      content: (
        <Flex
          as="main"
          tabIndex={-1}
          id="iframe-wrapper"
          zIndex="base"
          alignItems="center"
          justifyContent="center"
          flex="1 0 auto"
        >
          PDF is loading
        </Flex>
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
        goToPage,
      },
    };
  }

  function onDocumentLoadSuccess({ numPages }: { numPages: number }) {
    dispatch({
      type: 'PDF_PARSED',
      numPages: numPages,
    });
  }

  function onRenderSuccess(page: PageProps) {
    if (!page.height || !page.width || !containerSize)
      throw new Error('Error rendering page from Reader');
    if (
      Math.round(page.height) !== state.pdfHeight ||
      Math.round(page.width) !== state.pdfWidth
    ) {
      dispatch({
        type: 'PAGE_LOAD_SUCCESS',
        height: Math.round(page.height),
        width: Math.round(page.width),
      });

      resizePage(page.width, page.height, containerSize);
    }
  }

  // the reader is active but loading a page
  return {
    isLoading: false,
    content: (
      <Flex
        as="main"
        zIndex="base"
        flex="1 0 auto"
        justifyContent="center"
        alignItems="center"
        tabIndex={-1}
        id={IFRAME_WRAPPER_ID}
        ref={containerRef}
      >
        <Document file={state.file} onLoadSuccess={onDocumentLoadSuccess}>
          {isParsed && state.numPages && (
            <>
              {state.isScrolling &&
                Array.from(new Array(state.numPages), (_, index) => (
                  <ChakraPage
                    key={`page_${index + 1}`}
                    width={containerSize?.width}
                    scale={state.scale}
                    pageNumber={index + 1}
                  />
                ))}
              {!state.isScrolling && (
                <ChakraPage
                  pageNumber={state.pageNumber}
                  onLoadSuccess={onRenderSuccess}
                  width={state.pageWidth}
                  height={state.pageHeight}
                  scale={state.scale}
                  loading={<></>}
                />
              )}
            </>
          )}
        </Document>
      </Flex>
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
      goToPage,
    },
  };
}
