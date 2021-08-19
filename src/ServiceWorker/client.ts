import React from 'react';
import { WebpubManifest } from '../WebpubManifestTypes/WebpubManifest';
import { ReadiumLink } from '../WebpubManifestTypes/ReadiumLink';
import { WEBPUB_CACHE_NAME } from './constants';

export type PublicationConfig = {
  manifestUrl: string;
  proxyUrl?: string;
};

/**
 * Will add all publication resources to the cache so they
 * can be picked up by the SW.
 */
export default function usePublicationSW(
  publications: PublicationConfig[]
): void {
  // add each manifest and its resources to the cache directly
  React.useEffect(() => {
    async function cachePublications() {
      const cache = await caches.open(WEBPUB_CACHE_NAME);

      const promises = publications.map(async (pub) => {
        const finalManifestUrl = getProxiedUrl(pub.manifestUrl, pub.proxyUrl);
        const manifestResponse = await fetch(finalManifestUrl);
        handleBadResponse(finalManifestUrl, manifestResponse);
        // add the manifest response to the cache
        await cache.put(finalManifestUrl, manifestResponse.clone());

        const manifest: WebpubManifest = await manifestResponse.json();

        // make a list of resources with proxy included
        const resourceHrefs = extractHrefs(
          manifest.resources ?? [],
          pub.manifestUrl,
          pub.proxyUrl
        );

        const readingOrderHrefs = extractHrefs(
          manifest.readingOrder ?? [],
          pub.manifestUrl,
          pub.proxyUrl
        );

        // make sure array is deduped using set or we may get a cache error
        const allResourcesToCache = Array.from(
          new Set([...resourceHrefs, ...readingOrderHrefs])
        );
        // add them all to the cache
        await Promise.all(
          allResourcesToCache.map(async (url) => {
            const response = await fetch(url);
            handleBadResponse(url, response);
            return await cache.put(url, response);
          })
        );
      });
      // wait for this to finish for all of the manifests, but don't reject if one fails
      return await Promise.allSettled(promises);
    }

    cachePublications();
  }, [publications]);
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
