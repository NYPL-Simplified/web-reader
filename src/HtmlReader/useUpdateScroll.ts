import * as React from 'react';
import { HtmlAction, HtmlState } from './types';

const SCROLL_STOP_DEBOUNCE = 100;

/**
 * Dispatch a USER_SCROLLED event after some delay
 */
export function useUpdateScroll(
  state: HtmlState,
  dispatch: React.Dispatch<HtmlAction>
): void {
  const timeout = React.useRef<number>();

  React.useLayoutEffect(() => {
    if (state.state !== 'READY') return;
    const iframeDocument = state.iframe.contentDocument;
    if (!iframeDocument) return;

    function handleScroll() {
      if (timeout.current) clearTimeout(timeout.current);
      timeout.current = window.setTimeout(() => {
        dispatch({ type: 'USER_SCROLLED' });
      }, SCROLL_STOP_DEBOUNCE);
    }
    iframeDocument.addEventListener('scroll', handleScroll);
    return () => iframeDocument.removeEventListener('scroll', handleScroll);
  }, [state.state, state.iframe, dispatch]);
}
