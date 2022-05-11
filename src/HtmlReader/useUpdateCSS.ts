import React from 'react';
import { WebpubManifest } from '../types';
import { setReflowableCss } from './effects';
import { getMaybeIframeHtml } from './lib';
import { HtmlState } from './types';

/**
 * Set CSS variables when user state changes.
 * @todo - narrow down the dependencies so this doesn't run on _every_ state change.
 */
export default function useUpdateCSS(
  state: HtmlState,
  manifest: WebpubManifest | undefined
): void {
  React.useEffect(() => {
    if (!manifest) return;
    if (state.state !== 'NAVIGATING' && state.state !== 'READY') return;
    const html = getMaybeIframeHtml(state.iframe);
    if (!html) return;
    setReflowableCss(html, state.settings);
  }, [state.state, state.iframe, state.settings, manifest]);
}
