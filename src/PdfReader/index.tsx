import { Document, PageProps, pdfjs } from 'react-pdf';
import * as React from 'react';
import { ReaderArguments, ReaderReturn, WebpubManifest } from '../types';
import { Flex } from '@chakra-ui/react';
import useMeasure from './useMeasure';
import ChakraPage from './ChakraPage';
import ScrollPage from './ScrollPage';
import 'react-pdf/dist/esm/Page/AnnotationLayer.css';
import { HEADER_HEIGHT, FOOTER_HEIGHT } from '../constants';
import {
  DEFAULT_HEIGHT,
  DEFAULT_SHOULD_GROW_WHEN_SCROLLING,
} from '../constants';
import LoadingSkeleton from '../ui/LoadingSkeleton';
import addTocToManifest from './addTocToManifest';
import { PdfReaderAction, PdfState } from './types';
import {
  getIndexFromHref,
  getPageNumberFromHref,
  getResourceUrl,
  getStartPageFromHref,
  IFRAME_WRAPPER_ID,
  loadResource,
  SCALE_STEP,
  START_QUERY,
} from './lib';
import { makePdfReducer } from './reducer';

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
  const [state, dispatch] = React.useReducer(makePdfReducer(args), {
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
    const isResourceEnd = isLastResource && state.pageNumber === state.numPages;

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
   * In scrolling mode, manually scroll the user when the page changes
   */
  React.useEffect(() => {
    if (!state.settings?.isScrolling) return;
    const page = document.querySelector(
      `[data-page-number="${state.pageNumber}"]`
    );
    if (!page) return;
    page.scrollIntoView();
  }, [state.pageNumber, state.settings?.isScrolling]);

  const goForward = React.useCallback(async () => {
    dispatch({ type: 'GO_FORWARD' });
  }, []);

  const goBackward = React.useCallback(async () => {
    dispatch({ type: 'GO_BACKWARD' });
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

  const goToPage = React.useCallback(async (href: string) => {
    dispatch({ type: 'GO_TO_HREF', href });
  }, []);

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
