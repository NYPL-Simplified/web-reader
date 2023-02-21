import { DEFAULT_SETTINGS } from '../constants';
import { ReaderArguments } from '../types';
import {
  getIndexFromHref,
  getStartPageFromHref,
  getPageNumberFromHref,
} from './lib';
import { PdfState, PdfReaderAction } from './types';

export function makePdfReducer(
  args: ReaderArguments
): (state: PdfState, action: PdfReaderAction) => PdfState {
  /**
   * If there are no args, it's an inactive hook, or you are pre-first render.
   * just use a function that returns the state in most cases so you don't have
   * to keep checking if args is defined.
   */
  if (!args) return (state: PdfState, _action: PdfReaderAction) => state;
  const { manifest } = args;

  return function reducer(state: PdfState, action: PdfReaderAction): PdfState {
    if (state.state !== 'ACTIVE' && action.type !== 'ARGS_CHANGED') {
      return handleInvalidTransition(state, action);
    }

    /**
     * Utility function to generate state navigating us to a given resource and page.
     * Used by multiple cases below.
     */
    function goToLocation(index: number, page = 1): PdfState {
      // only set the resource to null if you're actually changing resources (not just
      // navigating to a different page in the same resource)
      const shouldResetResource = state.resourceIndex !== index;

      // check if there is a `?startPage` in the href of the resource we are navigating to
      const href = manifest.readingOrder[index].href;
      const startPage = getStartPageFromHref(href);
      // only go to the start page if we don't have another valid page we are navigating to
      // instead.
      const isNavigatingToEnd = page === -1;
      const requestedPageIsBeforeStartPage = startPage && page < startPage;
      const pageNumberToNavigateTo =
        !isNavigatingToEnd && requestedPageIsBeforeStartPage ? startPage : page;

      const newState = {
        ...state,
        resourceIndex: index,
        pageNumber: pageNumberToNavigateTo,
      };
      if (shouldResetResource) {
        return {
          ...newState,
          resource: null,
          numPages: null,
          rendered: false,
          pageHeight: undefined,
          pageWidth: undefined,
          pdfHeight: 0,
          pdfWidth: 0,
        };
      }
      return newState;
    }

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
          rendered: false,
        };
      }

      case 'GO_FORWARD': {
        /**
         * In scrolling mode, we simply move forward one whole resource
         */
        if (state.settings?.isScrolling) {
          const atEndOfBook =
            state.resourceIndex === args.manifest.readingOrder.length - 1;
          if (atEndOfBook) return state;
          return goToLocation(state.resourceIndex + 1);
        }
        /**
         * Navigate forward one page or one resource if at the end of the current
         * resource. Do nothing at the end of the last resource.
         */
        // do nothing if we have not parsed the number of pages yet.
        if (!state.numPages) return state;
        const atEndOfResource = state.pageNumber === state.numPages;
        const atEndOfBook =
          state.resourceIndex === args.manifest.readingOrder.length - 1;

        if (atEndOfResource) {
          if (atEndOfBook) return state;
          // go to next resource
          return goToLocation(state.resourceIndex + 1);
        }
        // go to next page
        return goToLocation(state.resourceIndex, state.pageNumber + 1);
      }

      case 'GO_BACKWARD': {
        /**
         * In scrolling mode, we simply move forward one whole resource
         */
        if (state.settings?.isScrolling) {
          const atStartOfBook = state.resourceIndex === 0;
          if (atStartOfBook) return state;
          return goToLocation(state.resourceIndex - 1);
        }
        /**
         * Navigate backward one page or to the end of the previous resource
         * if at the beginning of the current resource. Do nothing at the
         * beginning of the first resource.
         */
        // do nothing if we have not parsed the number of pages yet.
        if (!state.numPages) return state;
        const atStartOfResource = isStartOfResource(
          state.pageNumber,
          args.manifest.readingOrder[state.resourceIndex].href
        );

        const atStartOfBook = state.resourceIndex === 0;
        if (atStartOfResource) {
          if (atStartOfBook) return state;
          // go to end of prev resource
          return {
            ...goToLocation(state.resourceIndex - 1, -1),
          };
        }
        // go to prev page
        return goToLocation(state.resourceIndex, state.pageNumber - 1);
      }

      case 'GO_TO_HREF': {
        const resourceIndex = getIndexFromHref(action.href, args.manifest);
        const startPage = getStartPageFromHref(action.href);
        const pageNumber = getPageNumberFromHref(action.href);

        const page = pageNumber ?? startPage ?? 1;
        return goToLocation(resourceIndex, page);
      }

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
          rendered: true,
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
  };
}

function handleInvalidTransition(state: PdfState, action: PdfReaderAction) {
  console.trace(
    `Inavlid state transition attempted: ${state} with ${action.type}`
  );
  return state;
}

/**
 * Checks if we are at the start of the resource, taking into account the `?startPage`
 * query param.
 */
function isStartOfResource(pageNumber: number, resourceHref: string) {
  const startPage = getStartPageFromHref(resourceHref);
  return pageNumber === (startPage ?? 1);
}
