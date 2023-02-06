import { DEFAULT_SETTINGS } from '../constants';
import { PdfState, PdfReaderAction } from './types';

export function pdfReducer(state: PdfState, action: PdfReaderAction): PdfState {
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

function handleInvalidTransition(state: PdfState, action: PdfReaderAction) {
  console.trace(
    `Inavlid state transition attempted: ${state} with ${action.type}`
  );
  return state;
}
