import React from 'react';
import { WebpubManifest } from '../WebpubManifestTypes/WebpubManifest';
import { getFromReadingOrder } from './lib';
import { HtmlAction } from './types';

export default function useIframeLinkClick(
  baseUrl: string | undefined,
  manifest: WebpubManifest | undefined,
  dispatch: React.Dispatch<HtmlAction>
): void {
  React.useEffect(() => {
    if (!baseUrl || !manifest) return;
    window.addEventListener('message', ({ data }) => {
      if (typeof data === 'object' && data !== null && 'type' in data) {
        switch (data.type) {
          case 'LINK_CLICKED':
            handleIframeLink(data.href, manifest, baseUrl, dispatch);
        }
      }
    });
  }, [dispatch, baseUrl, manifest]);
}

const handleIframeLink = (
  href: string,
  manifest: WebpubManifest,
  baseUrl: string,
  dispatch: React.Dispatch<HtmlAction>
) => {
  if (isExternalLink(href, manifest, baseUrl)) {
    window.open(href, '_blank');
  } else {
    dispatch({ type: 'GO_TO_HREF', href: href });
  }
};

// If the href doesn't exist in the readingOrder, it's not
// part of the book link, we can say this is an external link
const isExternalLink = (
  href: string,
  manifest: WebpubManifest,
  baseUrl: string
) => {
  const resource = getFromReadingOrder(href, manifest, baseUrl);
  return resource === undefined;
};
