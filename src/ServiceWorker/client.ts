import React from 'react';
import { WebpubManifest } from '../WebpubManifestTypes/WebpubManifest';

export type UsePublicationReturn = {
  isSupported: boolean;
};

const PUBLICATION_CACHE_NAME = 'webpub-cache';

export type PublicationConfig = {
  manifestUrl: string;
  proxyUrl?: string;
};

function getProxiedUrl(url: string, proxyUrl?: string) {
  return proxyUrl ? `${proxyUrl}${encodeURIComponent(url)}` : url;
}

/**
 * Will add all publication resources to the cache.
 * Saves the previous list of manifestUrls in order to delete
 * the cached values when they are no longer required
 */
export default function usePublicationSW(
  publications: PublicationConfig[]
): UsePublicationReturn {
  // register SW.

  // delete old values

  // add each manifest and its resources to the cache
  React.useEffect(() => {
    async function cachePublications() {
      const cache = await window.caches.open(PUBLICATION_CACHE_NAME);
      for (const pub of publications) {
        const proxiedManifestUrl = getProxiedUrl(pub.manifestUrl, pub.proxyUrl);
        // fetch the manifest to get the resource URLs
        const resp = await fetch(proxiedManifestUrl);
        // bail out of the response isn't ok
        if (!resp.ok) {
          console.warn(
            `Failed to fetch manifest in usePublicationSW for: ${proxiedManifestUrl}`
          );
          continue;
        }
        // add the manifest response directly
        await cache.put(proxiedManifestUrl, resp.clone());
        const manifest = (await resp.json()) as WebpubManifest;
        const resourceUrls = manifest.resources
          ? manifest.resources.map((res) =>
              getProxiedUrl(res.href, pub.proxyUrl)
            )
          : [];
        // try to add the resources, but bail out if this fails
        // because one returned a non-200 exit code
        try {
          await cache.addAll(resourceUrls);
        } catch (e) {
          console.warn(
            `Failed to cache publication resources: ${proxiedManifestUrl}`,
            e
          );
          continue;
        }
        console.log(`Cached: ${manifest.metadata.title}`);
      }
    }

    cachePublications().then(() => {
      console.log('Finished caching publications.');
    });
  }, [publications]);

  return {
    isSupported: true,
  };
}
