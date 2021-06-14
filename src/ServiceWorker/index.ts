import { registerRoute } from 'workbox-routing';
import './install';

declare var self: ServiceWorkerGlobalScope;

/**
 * SERVICE WORKER STRATEGY
 * - The host app imports a service worker init script into service-worker.js
 * - The service worker initializes
 * - When it is ready, the app sends it a message with the manifest.json
 * - The service worker then will
 *  - Cache all of the content in manifest.json
 *  - Decrypt content in manifest.json if necessary
 */

/**
 * This file is to intercept encrypted traffic and transform it
 */

registerRoute(
  // Check to see if the request is a navigation to a new page
  ({ url, sameOrigin, ...rest }) => {
    if (!sameOrigin) return true;
    if (url.href.includes('samples')) return true;
    return false;
  },
  async ({ url, event, request }) => {
    // console.log(url);
    // console.log(event);
    // console.log('blep13');

    if (url.href.includes('muse')) {
      return new Response('SW is working');
    }

    const response = await fetch(request);

    return response;
  }
);

self.addEventListener('message', async (event) => {
  const response = await reducer(event.data);
  event.ports[0].postMessage(response);
});

type SwResponse = {
  type: string;
  payload?: any;
};

async function reducer(data: {
  type: string;
  payload?: unknown;
}): Promise<SwResponse> {
  switch (data.type) {
    case 'PRECACHE_BOOK':
      return {
        type: 'DOWNLOAD_BOOK_SUCCESS',
      };
    default:
      throw new Error(`SW Event Not Recognized: ${data.type}`);
  }
}
