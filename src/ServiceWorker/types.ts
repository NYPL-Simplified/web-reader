import { PRECACHE_PUBLICATIONS } from './constants';

export type WebReaderSWConfig = {
  cacheExpirationSeconds?: number;
};

export type PublicationConfig = {
  manifestUrl: string;
  proxyUrl?: string;
  // users can pass in a list of additonal urls
  // we will route with a stale-while-revalidate
  // strategy. Useful in CPW for the heavy fulfillment link.
  swrUrls?: string[];
};

export type PrecachePublicationsMessage = {
  type: typeof PRECACHE_PUBLICATIONS;
  publications: PublicationConfig[];
};
