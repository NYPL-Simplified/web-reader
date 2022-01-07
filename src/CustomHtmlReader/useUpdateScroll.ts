import * as React from 'react';
import { HtmlAction } from './types';

const SCROLL_STOP_DEBOUNCE = 100;

/**
 * Dispatch a USER_SCROLLED event after some delay
 */
export function useUpdateScroll(
  iframe: HTMLIFrameElement | null,
  isIframeLoaded: boolean,
  dispatch: React.Dispatch<HtmlAction>
): void {
  const timeout = React.useRef<number>();

  React.useLayoutEffect(() => {
    const iframeDocument = iframe?.contentDocument;
    if (!iframeDocument || !isIframeLoaded) return;

    function handleScroll() {
      if (timeout.current) clearTimeout(timeout.current);
      timeout.current = window.setTimeout(() => {
        dispatch({ type: 'USER_SCROLLED' });
      }, SCROLL_STOP_DEBOUNCE);
    }
    iframeDocument.addEventListener('scroll', handleScroll);
    return () => iframeDocument.removeEventListener('scroll', handleScroll);
  }, [iframe, isIframeLoaded, dispatch]);
}
