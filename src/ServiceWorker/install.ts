/**
 * This file will install the service worker and claim the client
 * as soon as possible when a new worker is available.
 */

import { clientsClaim } from 'workbox-core';

declare let self: ServiceWorkerGlobalScope;

/**
 * This disables the feature of waiting until the tab is closed to install
 * an updated sw
 */
clientsClaim();
self.addEventListener('install', function (event) {
  // The promise that skipWaiting() returns can be safely ignored.
  self.skipWaiting();

  console.log('Service Worker Installed.');
  // Perform any other actions required for your
  // service worker to install, potentially inside
  // of event.waitUntil();
});
