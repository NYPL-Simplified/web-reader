import { ReaderArguments, ReaderSettings, ReaderState } from '../types';

export type InternalState = {
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

export type InactiveState = ReaderState &
  InternalState & { state: 'INACTIVE'; settings: undefined };

export type ActiveState = ReaderState &
  InternalState & { state: 'ACTIVE'; settings: ReaderSettings };

export type PdfState = InactiveState | ActiveState;

export type PdfReaderAction =
  | {
      type: 'ARGS_CHANGED';
      args: ReaderArguments;
    }
  | {
      type: 'SET_CURRENT_RESOURCE';
      index: number;
      shouldNavigateToEnd: boolean;
    }
  | { type: 'GO_FORWARD' }
  | { type: 'GO_BACKWARD' }
  | { type: 'GO_TO_HREF'; href: string }
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
