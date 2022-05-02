import debounce from 'debounce';
import React from 'react';
import { WebpubManifest } from '../types';
import { setFXLCss } from './effects';
import { HtmlAction, HtmlState } from './types';

/**
 * Simply dispatches an action when the window is resized.
 */
export default function useWindowResize(
  manifest: WebpubManifest | undefined,
  state: HtmlState,
  dispatch: React.Dispatch<HtmlAction>
): void {
  React.useEffect(() => {
    if (!manifest) return;
    if (state.state !== 'NAVIGATING' && state.state !== 'READY') return;

    function handleResize() {
      const iframeDocument = state.iframe?.contentDocument as Document;
      const iframeContainer = window.document.querySelector(
        'main'
      ) as HTMLElement;

      setFXLCss(
        manifest?.metadata?.presentation?.layout,
        iframeDocument,
        iframeContainer
      );

      dispatch({
        type: 'WINDOW_RESIZED',
      });
    }

    const deboucedHandleResize = debounce(handleResize, 100);
    window.addEventListener('resize', deboucedHandleResize);
    return () => window.removeEventListener('resize', deboucedHandleResize);
  }, [dispatch, manifest, state]);
}
