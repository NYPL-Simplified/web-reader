import { clientsClaim } from 'workbox-core';
import { ExpirationPlugin } from 'workbox-expiration';
import { CacheFirst, StaleWhileRevalidate } from 'workbox-strategies';
import { IS_DEV } from '../constants';
import { WebpubManifest } from '../types';
import { ReadiumLink } from '../WebpubManifestTypes/ReadiumLink';
import {
  CACHE_EXPIRATION_SECONDS,
  PRECACHE_PUBLICATIONS,
  WEBPUB_CACHE_NAME,
} from './constants';
import { registerRoute } from 'workbox-routing';
import { PublicationConfig, WebReaderSWConfig } from './types';

declare let self: ServiceWorkerGlobalScope;

const VERSION = 'v2';

/**
 * We claim the clients immediately and skip waiting because we don't care if
 * half the page resources come from the SW and half from the network. We use
 * content hashes for this to work
 */
clientsClaim();

/**
 * Sets up the event listeners to:
 *  - On Fetch
 *    - Serve cached responses if they exist and are less than a week old.
 */
export default function initWebReaderSW({
  cacheExpirationSeconds = CACHE_EXPIRATION_SECONDS,
}: WebReaderSWConfig | undefined = {}): void {
  log('INITIALIZING');
  self.addEventListener('install', (event) => {
    log('INSTALLING ');
    async function installSW() {
      // perform any install tasks
      // skip the waiting phase and activate immediately
      await self.skipWaiting();
      log('INSTALLED');
    }
    event.waitUntil(installSW());
  });

  /**
   * Allow the client to send a message telling us to pre-cache
   * webpub manifests and resources within them.
   */
  self.addEventListener('message', async (event) => {
    if (event.data.type === PRECACHE_PUBLICATIONS) {
      log('Precaching publications');
      if (typeof event.data.publications !== 'object') {
        console.error('Precache event missing publications');
        return;
      }
      await cachePublications(event.data.publications);
    }
  });

  const cacheFirst = new CacheFirst({
    cacheName: WEBPUB_CACHE_NAME,
    plugins: [
      new ExpirationPlugin({
        maxAgeSeconds: cacheExpirationSeconds,
      }),
    ],
  });

  /**
   * Register the additional urls we sent with a stale-while-revalidate strategy
   * Cache all the manifests in parallel. They're top priority.
   * Then cache all their resources.
   * Only cache items that don't already exist in the cache.
   */
  async function cachePublications(publications: PublicationConfig[]) {
    const cache = await caches.open(WEBPUB_CACHE_NAME);

    // first route the swr urls
    for (const pub of publications) {
      for (const url of pub.swrUrls ?? []) {
        log(`Routing ${url}`);
        registerRoute(
          url,
          new StaleWhileRevalidate({ cacheName: WEBPUB_CACHE_NAME })
        );
      }
    }

    // route, fetch and cache the manifests.
    // but don't re-fetch if they already exist in cache.
    const pubResults: PromiseSettledResult<PubWithManifest>[] = await Promise.allSettled(
      publications.map(async (pub) => {
        const finalManifestUrl = getProxiedUrl(pub.manifestUrl, pub.proxyUrl);

        // route it so that workbox knows to respond.
        registerRoute(finalManifestUrl, cacheFirst);

        // bail out if the manifest already exists
        const match = await cache.match(finalManifestUrl);
        if (match) {
          return { ...pub, manifest: await match.json() };
        }

        // otherwise fetch it
        const manifestResponse = await fetch(finalManifestUrl);
        handleBadResponse(finalManifestUrl, manifestResponse);

        // add the manifest response to the cache
        await cache.put(finalManifestUrl, manifestResponse.clone());

        const manifest: WebpubManifest = await manifestResponse.json();

        return { ...pub, manifest };
      })
    );

    // filter out any errored results
    const pubs = pubResults
      .map((result) =>
        result.status === 'fulfilled' ? result.value : undefined
      )
      .filter(isPub);

    // then route, fetch and cache all resources in each.
    const promises = pubs.map(async (pub) => {
      // make a list of resources with proxy included
      const resourceHrefs = extractHrefs(
        pub.manifest.resources ?? [],
        pub.manifestUrl,
        pub.proxyUrl
      );

      const readingOrderHrefs = extractHrefs(
        pub.manifest.readingOrder ?? [],
        pub.manifestUrl,
        pub.proxyUrl
      );

      // make sure array is deduped using set or we may get a cache error
      const allResourcesToCache = Array.from(
        new Set([...resourceHrefs, ...readingOrderHrefs])
      );

      // route, fetch and cache each one.
      // but don't re-fetch if it is already in the cache.
      await Promise.all(
        allResourcesToCache.map(async (url) => {
          // route it
          registerRoute(url, cacheFirst);
          // bail out if it already exists
          const match = await cache.match(url);
          if (match) {
            return;
          }
          const response = await fetch(url);
          handleBadResponse(url, response);
          return await cache.put(url, response);
        })
      );
    });

    return await Promise.allSettled(promises);
  }
}

type PubWithManifest = PublicationConfig & { manifest: WebpubManifest };

function isPub(maybe: PubWithManifest | undefined): maybe is PubWithManifest {
  return !!maybe;
}

function handleBadResponse(url: string, response: Response) {
  if (!response.ok) {
    const message = `Bad response status for: ${url}. Status: ${response.status}`;
    console.warn(message);
    throw new Error(message);
  }
}

/**
 * Prepends the proxy url if there is one
 */
function getProxiedUrl(url: string, proxyUrl: string | undefined) {
  return proxyUrl ? `${proxyUrl}${encodeURIComponent(url)}` : url;
}

/**
 * If the passed in url is relative, it will resolve it relative to the
 * manifest url. Otherwise it should stay the same. Finally, the proxy is
 * conditionally added
 */
function getAbsoluteUrl(
  maybeRelative: string,
  manifestUrl: string,
  proxyUrl?: string
) {
  return getProxiedUrl(
    new URL(maybeRelative, manifestUrl).toString(),
    proxyUrl
  );
}

/**
 * Gets an array of raw href values from an array of readium links
 */
function extractHrefs(
  links: ReadiumLink[],
  manifestUrl: string,
  proxyUrl: string | undefined
): string[] {
  return links.map((res) => getAbsoluteUrl(res.href, manifestUrl, proxyUrl));
}

// each logging line will be prepended with the service worker version
function log(message: string) {
  if (IS_DEV) console.log(`SW (${VERSION}) -`, message);
}

/**
 * On a fetch event, respond with an item from the cache, if
 * it exists. We don't ever add things to the cache here,
 * because the fetch event is called for _all_ network requests,
 * and we can't tell if any given request is for app resources or
 * publication resources. Thus publication resources are added
 * to the cache separately, and then just returned if found here.
 *
 * This event listener MUST be run as the last fetch event listener
 * of all in the host app because it always responds to the event
 * in order to be able to use async functionality.
 */
//  self.addEventListener('fetch', (event) => {
//   if (event.request.method !== 'GET') {
//     return;
//   }

//   async function matchOrFetch() {
//     const pubCache = await caches.open(WEBPUB_CACHE_NAME);
//     const match = await pubCache.match(event.request);

//     // check if there is a match
//     if (match) {
//       return new CacheFirst({
//         cacheName: WEBPUB_CACHE_NAME,
//         plugins: [
//           new ExpirationPlugin({
//             // Only cache requests for a week
//             maxAgeSeconds: cacheExpirationSeconds,
//           }),
//         ],
//       }).handle(event);
//     }
//     // otherwise go to network
//     return fetch(event.request);
//   }

//   // we have to make the event wait if we want to use async work. This will
//   // make the network tab show "ServiceWorker" in all requests, despite the
//   // fact that not every request actually goes through the service worker:
//   // https://stackoverflow.com/questions/33590378/status-code200-ok-from-serviceworker-in-chrome-network-devtools/33655173
//   event.respondWith(matchOrFetch());
// });
