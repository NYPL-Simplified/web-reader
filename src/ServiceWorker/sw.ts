import { clientsClaim } from 'workbox-core';
import { ExpirationPlugin } from 'workbox-expiration';
import { CacheFirst } from 'workbox-strategies';
import { IS_DEV } from '../constants';
import { CACHE_EXPIRATION_SECONDS, WEBPUB_CACHE_NAME } from './constants';

declare let self: ServiceWorkerGlobalScope;

const VERSION = 'v1';

/**
 * Sets up the event listeners to:
 *  - On Fetch
 *    - Serve cached responses if they exist and are less than a week old.
 */

clientsClaim();
export default function initWebReaderSW(): void {
  log('INITIALIZING');
  self.addEventListener('install', (event) => {
    log('INSTALLING ');
    async function installSW() {
      // perform any install tasks
      self.skipWaiting();
      log('INSTALLED');
    }
    event.waitUntil(installSW);
  });
  self.addEventListener('activate', (event) => {
    log('ACTIVATING');
    event.waitUntil(async () => {
      // here we can perform any other async work needed to activate SW.
      log('ACTIVATED');
    });
  });

  /**
   * On a fetch event, respond with an item from the cache, if
   * it exists. We don't ever add things to the cache here,
   * because the fetch event is called for _all_ network requests,
   * and we can't tell if any given request is for app resources or
   * publication resources. Thus publication resources are added
   * to the cache separately, and then just returned if found here.
   */
  self.addEventListener('fetch', (event) => {
    if (event.request.method !== 'GET') {
      return;
    }

    async function matchOrFetch() {
      const pubCache = await caches.open(WEBPUB_CACHE_NAME);
      const match = await pubCache.match(event.request);

      // check if there is a match
      if (match) {
        return new CacheFirst({
          cacheName: WEBPUB_CACHE_NAME,
          plugins: [
            new ExpirationPlugin({
              // Only cache requests for a week
              maxAgeSeconds: CACHE_EXPIRATION_SECONDS,
            }),
          ],
        }).handle(event);
      }
      // otherwise go to network
      return fetch(event.request);
    }

    // we have to make the event wait if we want to use async work
    event.respondWith(matchOrFetch());
  });
}

// each logging line will be prepended with the service worker version
function log(message: string) {
  if (IS_DEV) console.log(`SW (${VERSION}) -`, message);
}
