import { Document, PageProps, pdfjs } from 'react-pdf';
import * as React from 'react';
import {
  ReaderArguments,
  ReaderReturn,
  ReaderSettings,
  ReaderState,
  WebpubManifest,
} from '../types';
import { Flex } from '@chakra-ui/react';
import useMeasure from './useMeasure';
import ChakraPage from './ChakraPage';
import ScrollPage from './ScrollPage';
import { ReadiumLink } from '../WebpubManifestTypes/ReadiumLink';
import 'react-pdf/dist/esm/Page/AnnotationLayer.css';
import { HEADER_HEIGHT, FOOTER_HEIGHT, DEFAULT_SETTINGS } from '../constants';
import {
  DEFAULT_HEIGHT,
  DEFAULT_SHOULD_GROW_WHEN_SCROLLING,
} from '../constants';
import LoadingSkeleton from '../ui/LoadingSkeleton';
import addTocToManifest from './addTocToManifest';

type InternalState = {
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

type InactiveState = ReaderState &
  InternalState & { state: 'INACTIVE'; settings: undefined };

type ActiveState = ReaderState &
  InternalState & { state: 'ACTIVE'; settings: ReaderSettings };

type PdfState = InactiveState | ActiveState;

type PdfReaderAction =
  | {
      type: 'ARGS_CHANGED';
      args: ReaderArguments;
    }
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
    }
  | { type: 'BOOK_BOUNDARY_CHANGED'; atStart: boolean; atEnd: boolean };
const IFRAME_WRAPPER_ID = 'iframe-wrapper';
export const SCALE_STEP = 0.1;
const START_QUERY = 'start';

function pdfReducer(state: PdfState, action: PdfReaderAction): PdfState {
  console.log('action', action);
  switch (action.type) {
    case 'ARGS_CHANGED': {
      return {
        state: 'ACTIVE',
        settings: DEFAULT_SETTINGS,
        resourceIndex: 0,
        resource: null,
        pageNumber: 1,
        numPages: null,
        scale: 1,
        pdfWidth: 0,
        pdfHeight: 0,
        pageHeight: undefined,
        pageWidth: undefined,
        atStart: true,
        atEnd: false,
      };
    }
    /**
     * Cleares the current resource and sets the current index, which will cause
     * the useEffect hook to load a new resource.
     */
    case 'SET_CURRENT_RESOURCE':
      if (state.resourceIndex === action.index) return state;
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
      if (state.state !== 'ACTIVE') {
        return handleInvalidTransition(state, action);
      }
      return {
        ...state,
        settings: {
          ...state.settings,
          isScrolling: action.isScrolling,
        },
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

    case 'BOOK_BOUNDARY_CHANGED':
      return {
        ...state,
        atStart: action.atStart,
        atEnd: action.atEnd,
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
  const url: string = proxyUrl
    ? `${proxyUrl}${encodeURIComponent(resourceUrl)}`
    : resourceUrl;
  const response = await fetch(url, { mode: 'cors' });
  const array = new Uint8Array(await response.arrayBuffer());

  if (!response.ok) {
    throw new Error('Response not Ok for URL: ' + url);
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
  // use a passed in src for the pdf worker
  if (args?.pdfWorkerSrc) {
    pdfjs.GlobalWorkerOptions.workerSrc = args.pdfWorkerSrc;
  }

  const {
    webpubManifestUrl,
    manifest,
    proxyUrl,
    getContent,
    injectablesReflowable,
    injectablesFixed,
    height = DEFAULT_HEIGHT,
    growWhenScrolling = DEFAULT_SHOULD_GROW_WHEN_SCROLLING,
  } = args ?? {};
  const [state, dispatch] = React.useReducer(pdfReducer, {
    state: 'INACTIVE',
    resourceIndex: 0,
    resource: null,
    pageNumber: 1,
    numPages: null,
    scale: 1,
    pdfWidth: 0,
    pdfHeight: 0,
    pageHeight: undefined,
    pageWidth: undefined,
    atStart: true,
    atEnd: false,
    settings: undefined,
  });

  // state we can derive from the state above
  const isFetching = !state.resource;
  const isParsed = typeof state.numPages === 'number';
  const isSinglePDF = manifest && manifest?.readingOrder.length === 1;
  const [containerRef, containerSize] = useMeasure<HTMLDivElement>();

  // dispatch action when arguments change
  React.useEffect(() => {
    if (!webpubManifestUrl || !manifest) {
      return dispatch({ type: 'ARGS_CHANGED', args: undefined });
    }
    dispatch({
      type: 'ARGS_CHANGED',
      args: {
        webpubManifestUrl,
        manifest,
        getContent,
        injectablesReflowable,
        injectablesFixed,
        height,
        growWhenScrolling,
      },
    });
  }, [
    webpubManifestUrl,
    manifest,
    getContent,
    injectablesReflowable,
    injectablesFixed,
    height,
    growWhenScrolling,
  ]);

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

  React.useEffect(() => {
    resizePage(state.pdfWidth, state.pdfHeight, containerSize);
  }, [containerSize, state.pdfWidth, state.pdfHeight, resizePage]);

  /**
   * Hide Or Show Page Button
   */
  React.useEffect(() => {
    if (!manifest || state.state !== 'ACTIVE') return;

    const isFirstResource = state.resourceIndex === 0;
    const isResourceStart = isFirstResource && state.pageNumber === 1;

    const isLastResource =
      state.resourceIndex === manifest?.readingOrder?.length - 1;
    const isResourceEnd =
      (isLastResource && state.pageNumber === state.numPages) ||
      // On scroll mode, next page button takes you to the next resource. So we can just hide the next button on last resource.
      (state.settings.isScrolling && isLastResource);

    dispatch({
      type: 'BOOK_BOUNDARY_CHANGED',
      atStart: isResourceStart,
      atEnd: isResourceEnd,
    });
  }, [
    manifest,
    state.state,
    state.settings,
    state.numPages,
    state.pageNumber,
    state.resourceIndex,
    isSinglePDF,
  ]);

  // add TOC object to manifest if single-resource pdf
  React.useEffect(() => {
    if (!manifest || !manifest.readingOrder || !manifest.readingOrder.length)
      return;

    if (isSinglePDF) {
      const resourceUrl = getResourceUrl(
        state.resourceIndex,
        manifest.readingOrder
      );
      const proxiedUrl = `${proxyUrl}${encodeURIComponent(resourceUrl)}`;
      addTocToManifest(manifest, proxiedUrl);
    }
  }, [isSinglePDF, manifest, proxyUrl, state.resourceIndex]);

  /**
   * Next page button. Has to handle:
   *   - going to the next page in the current resource
   *   - going to the next resource if at the end of current resource
   */
  const goForward = React.useCallback(async () => {
    // do nothing if we haven't parsed the number of pages yet
    if (!state.numPages) return;
    // do nothing if the reader is inactive
    if (state.state !== 'ACTIVE') return;

    if (state.pageNumber < state.numPages && !state.settings.isScrolling) {
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
      if (manifest?.readingOrder[nextIndex]) {
        const pageNum =
          getStartPageFromHref(manifest?.readingOrder[nextIndex].href) ?? 1;
        dispatch({
          type: 'NAVIGATE_PAGE',
          pageNum: pageNum,
        });
      }
    }
    // Do nothing if it's at the last page of the last resource
  }, [
    state.state,
    manifest,
    state.settings,
    state.numPages,
    state.pageNumber,
    state.resourceIndex,
  ]);

  /**
   * Prev page button. Has to handle:
   *   - Go back one page in current resource
   *   - Go to the last page of previous resource if at the beginning
   */
  const goBackward = React.useCallback(async () => {
    // do nothing if we haven't parsed the PDF yet
    if (!isParsed || !state.numPages) return;
    // do nothing if the reader is inactive
    if (state.state !== 'ACTIVE') return;

    const prevHref = manifest?.readingOrder[state.resourceIndex - 1]?.href;
    if (!prevHref) return;

    const startPage = getStartPageFromHref(prevHref) ?? 1;

    if (state.pageNumber > startPage && !state.settings.isScrolling) {
      dispatch({
        type: 'NAVIGATE_PAGE',
        pageNum: state.pageNumber - 1,
      });
    } else if (manifest?.readingOrder && state.resourceIndex > 0) {
      const nextIndex = state.resourceIndex - 1;
      dispatch({
        type: 'SET_CURRENT_RESOURCE',
        index: nextIndex,
        shouldNavigateToEnd: !state.settings.isScrolling,
      });
    }
  }, [
    manifest,
    isParsed,
    state.state,
    state.settings,
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
      scale: state.scale + SCALE_STEP,
    });
  }, [state.scale]);

  const zoomOut = React.useCallback(async () => {
    dispatch({
      type: 'SET_SCALE',
      scale: state.scale - SCALE_STEP,
    });
  }, [state.scale]);

  /**
   * TODO: Update to work with sub-chapter links
   */
  const goToPage = React.useCallback(
    async (href: string) => {
      if (!manifest) return;
      // if (isSinglePDF) {
      //   const getIndexFromHref = (href: string): number => {
      //     const index = manifest?.toc?.findIndex((link) => {
      //       return link.href === href;
      //     }) as number;
      //     if (index < 0) {
      //       throw new Error('Cannot find resource in toc');
      //     }
      //     return index;
      //   };

      //   const resourceIndex = getIndexFromHref(href);
      //   if (manifest?.toc && manifest?.toc[resourceIndex]) {
      //     const hashPage = getHashPage(manifest?.toc[resourceIndex].href);
      //     dispatch({
      //       type: 'NAVIGATE_PAGE',
      //       pageNum: hashPage,
      //     });

      //     if (state.settings?.isScrolling && hashPage) {
      //       document
      //         .querySelector(`[data-page-number="${hashPage}"]`)
      //         ?.scrollIntoView();
      //     }
      //   }
      // } else {
      const resourceIndex = getIndexFromHref(href, manifest);
      const startPage = getStartPageFromHref(href);
      const pageNumber = getPageNumberFromHref(href);

      /**
       * Set the current resource to the specified resource index
       */
      dispatch({
        type: 'SET_CURRENT_RESOURCE',
        index: resourceIndex,
        shouldNavigateToEnd: false,
      });

      /**
       * Navigate to the specified page number if it exists, or the start page if that
       * exists.
       */
      if (pageNumber) {
        dispatch({
          type: 'NAVIGATE_PAGE',
          pageNum: pageNumber,
        });
      } else if (startPage) {
        dispatch({
          type: 'NAVIGATE_PAGE',
          pageNum: startPage,
        });
      }
    },
    [manifest]
  );

  // this format is inactive, return null
  if (!webpubManifestUrl || !manifest) return null;

  if (state.state === 'INACTIVE' || isFetching) {
    return {
      type: null,
      isLoading: true,
      content: <LoadingSkeleton height={height} state={state} />,
      navigator: null,
      manifest: null,
      state: null,
    };
  }

  // if (isFetching) {
  //   // The Reader is fetching a PDF resource
  //   return {
  //     type: 'PDF',
  //     isLoading: false,
  //     content: (
  //       <Flex
  //         as="main"
  //         tabIndex={-1}
  //         id="iframe-wrapper"
  //         zIndex="base"
  //         alignItems="center"
  //         justifyContent="center"
  //         flex="1 0 auto"
  //         height={height}
  //       >
  //         PDF is loading
  //       </Flex>
  //     ),
  //     state,
  //     manifest,
  //     navigator: {
  //       goForward,
  //       goBackward,
  //       zoomIn,
  //       zoomOut,
  //       setScroll,
  //       goToPage,
  //     },
  //   };
  // }

  const onDocumentLoadSuccess = ({ numPages }: { numPages: number }) => {
    dispatch({
      type: 'PDF_PARSED',
      numPages: numPages,
    });
  };

  function onRenderSuccess(page: PageProps) {
    if (!page.height || !page.width)
      throw new Error(
        'Error rendering page from Reader, please refresh your page.'
      );
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

  const shouldGrow = state.settings?.isScrolling && growWhenScrolling;
  const finalHeight = shouldGrow ? 'initial' : height;

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
        height={finalHeight}
      >
        {/* FIXME: POC, update this with more a react proach. chakra.factory throws memory leak error.*/}
        <style>
          {`
            .react-pdf__Document {
              height: calc(100vh - ${HEADER_HEIGHT + FOOTER_HEIGHT}px);
              overflow-x: hidden;
              overflow-y: auto;
            }
          `}
        </style>
        <Document file={state.resource} onLoadSuccess={onDocumentLoadSuccess}>
          {isParsed && state.numPages && (
            <>
              {state.settings.isScrolling &&
                Array.from(new Array(state.numPages), (_, index) => (
                  <ScrollPage
                    key={`page_${index + 1}`}
                    // width is necessary to pass to react-pdf Page component on initial render
                    width={containerSize.width}
                    placeholderHeight={state.pdfHeight}
                    placeholderWidth={state.pdfWidth}
                    scale={state.scale}
                    pageNumber={index + 1}
                    onLoadSuccess={onRenderSuccess}
                  />
                ))}
              {!state.settings.isScrolling && (
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

function handleInvalidTransition(state: PdfState, action: PdfReaderAction) {
  console.trace(
    `Inavlid state transition attempted: ${state} with ${action.type}`
  );
  return state;
}

/**
 * Gets the index of the provided href in the readingOrder, or throws an error if one
 * is not found.
 */
function getIndexFromHref(href: string, manifest: WebpubManifest): number {
  const input = new URL(href);
  const index = manifest?.readingOrder?.findIndex((link) => {
    return doHrefsMatch(link.href, input);
  });
  if (index < 0) {
    throw new Error(`Cannot find resource in readingOrder: ${href}`);
  }
  return index;
}

/**
 * Compares two hrefs without query params or hash
 */
function doHrefsMatch(href1: string | URL, href2: string | URL) {
  const input1 = new URL(href1);
  const input2 = new URL(href2);
  return (
    input1.pathname === input2.pathname &&
    input1.hostname === input2.hostname &&
    input1.protocol === input2.protocol
  );
}

/**
 * Extracts a start page from a href if it exists and is in the format
 * `?startPage=1`. Returns undefined if none found.
 */
const getStartPageFromHref = (href: string): number | undefined => {
  const params = new URL(href).searchParams;
  const startPage = params.get(START_QUERY);
  return startPage ? parseInt(startPage) : undefined;
};

/**
 * Extracts a page number from a href if it exists and is in
 * the format of `#page=1`
 */
const getPageNumberFromHref = (href: string): number | undefined => {
  const hash = new URL(href).hash;
  try {
    const strPageNumber = hash.replace('#page=', '');
    if (!strPageNumber || strPageNumber === 'NaN') return undefined;
    const pageNumber = parseInt(strPageNumber);
    return pageNumber;
  } catch (e) {
    console.warn(`Failed to parse page number from hash ${hash}`);
    return undefined;
  }
};
