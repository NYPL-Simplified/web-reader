import { Document, Page, PageProps, pdfjs } from 'react-pdf';
import * as React from 'react';
import { ReaderArguments, ReaderReturn, PdfReaderState } from '../types';
import { chakra, Flex, shouldForwardProp } from '@chakra-ui/react';
import useMeasure from './useMeasure';
import 'react-pdf/dist/esm/Page/AnnotationLayer.css';
import { ReadiumLink } from '../WebpubManifestTypes/ReadiumLink';

type PdfState = PdfReaderState & {
  resourceIndex: number;
  resource: { data: Uint8Array } | null;
  // we only know the numPages once the resource has been parsed
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
  | { type: 'RESOURCE_FETCH_SUCCESS'; resource: { data: Uint8Array } }
  | { type: 'PDF_PARSED'; numPages: number }
  | { type: 'NAVIGATE_PAGE'; pageNum: number }
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
    /**
     * Cleares the current resource and sets the current index, which will cause
     * the useEffect hook to load a new resource.
     */
    case 'SET_CURRENT_RESOURCE':
      return {
        ...state,
        resource: null,
        resourceIndex: action.index,
        pageNumber: action.shouldNavigateToEnd ? -1 : 1,
        numPages: null,
      };

    case 'RESOURCE_FETCH_SUCCESS':
      return {
        ...state,
        resource: action.resource,
      };

    // called when the resource has been parsed by react-pdf
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

const getResourceUrl = (
  index: number,
  readingOrder: ReadiumLink[] | undefined
): string => {
  if (!readingOrder || !readingOrder.length) {
    throw new Error('A manifest has been returned, but has no reading order');
  }

  // If it has no children, return the link href
  return readingOrder[index].href;
};

const loadResource = async (resourceUrl: string, proxyUrl?: string) => {
  // Generate the resource URL using the proxy
  const resource: string = proxyUrl + encodeURI(resourceUrl);
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
 * The PDF reader loads resources in two stages:  First, it fetches the PDF resource as an Uint8Array
 * Then, it passes this array into the <Document> object, which loads the PDF inside an iframe
 *
 * @param args T
 * @returns
 */
export default function usePdfReader(args: ReaderArguments): ReaderReturn {
  const { webpubManifestUrl, manifest, proxyUrl } = args ?? {};
  const [state, dispatch] = React.useReducer(pdfReducer, {
    colorMode: 'day',
    isScrolling: false,
    fontSize: 16,
    fontFamily: 'sans-serif',
    resourceIndex: 0,
    resource: null,
    pageNumber: 1,
    numPages: null,
    currentTocUrl: null,
    scale: 1,
    pdfWidth: 0,
    pdfHeight: 0,
    pageHeight: undefined,
    pageWidth: undefined,
  });

  // state we can derive from the state above
  const isFetching = !state.resource;
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

  /**
   * Load the current resource and set it in state,
   * and reload whenever it changes (via navigation)
   */
  React.useEffect(() => {
    // bail out if there is not manifest passed in,
    // that indicates that this format is inactive
    if (!manifest) return;
    // throw an error on a badly formed manifest
    if (!manifest.readingOrder || !manifest.readingOrder.length) {
      throw new Error('Manifest has no Reading Order');
    }

    const resourceUrl = getResourceUrl(
      state.resourceIndex,
      manifest.readingOrder
    );
    loadResource(resourceUrl, proxyUrl).then((data) => {
      dispatch({
        type: 'RESOURCE_FETCH_SUCCESS',
        resource: { data },
      });
    });
  }, [state.resourceIndex, manifest, proxyUrl]);

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
    }
    // Do nothing if it's at the last page of the last resource
  }, [
    manifest,
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
    }
  }, [
    manifest,
    isParsed,
    state.isScrolling,
    state.pageNumber,
    state.resourceIndex,
  ]);

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
  const zoomIn = React.useCallback(async () => {
    dispatch({
      type: 'SET_SCALE',
      scale: state.scale + 0.1,
    });
  }, [state.scale]);

  const zoomOut = React.useCallback(async () => {
    dispatch({
      type: 'SET_SCALE',
      scale: state.scale - 0.1,
    });
  }, [state.scale]);

  const goToPage = React.useCallback(
    async (href) => {
      const getIndexFromHref = (href: string): number => {
        const index = manifest?.readingOrder?.findIndex((link) => {
          return link.href === href;
        });
        if (!index) {
          throw new Error('Cannot find resource in readingOrder');
        }
        return index;
      };

      dispatch({
        type: 'SET_CURRENT_RESOURCE',
        index: getIndexFromHref(href),
        shouldNavigateToEnd: false,
      });
    },
    [manifest?.readingOrder]
  );

  // this format is inactive, return null
  if (!webpubManifestUrl || !manifest) return null;

  if (isFetching) {
    // The Reader is fetching a PDF resource
    return {
      type: 'PDF',
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
        zoomIn,
        zoomOut,
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
    type: 'PDF',
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
        <Document file={state.resource} onLoadSuccess={onDocumentLoadSuccess}>
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
      setScroll,
      zoomIn,
      zoomOut,
      goToPage,
    },
  };
}
