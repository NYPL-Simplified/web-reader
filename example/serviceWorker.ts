import { registerRoute } from 'workbox-routing';
import { clientsClaim } from 'workbox-core';

declare var self: ServiceWorkerGlobalScope;

/**
 * This disables the feature of waiting until the tab is closed to install
 * an updated sw
 */
clientsClaim();
self.addEventListener('install', function (event) {
  // The promise that skipWaiting() returns can be safely ignored.
  self.skipWaiting();

  console.log('installed eh');
  // Perform any other actions required for your
  // service worker to install, potentially inside
  // of event.waitUntil();
});

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
