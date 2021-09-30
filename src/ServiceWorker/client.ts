import React from 'react';
import { PRECACHE_PUBLICATIONS } from './constants';
import { PrecachePublicationsMessage, PublicationConfig } from './types';

/**
 * Sends a message to the SW to fetch and cache publication resources
 * in a separate thread.
 */
export default function usePublicationSW(
  publications: PublicationConfig[]
): void {
  React.useEffect(() => {
    // send a message to the SW to pre-cache our publications
    // cachePublications();
    if ('serviceWorker' in navigator) {
      const message: PrecachePublicationsMessage = {
        type: PRECACHE_PUBLICATIONS,
        publications,
      };
      navigator.serviceWorker.controller?.postMessage(message);
    }
  }, [publications]);
}
