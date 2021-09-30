import { PRECACHE_PUBLICATIONS } from './constants';

export type WebReaderSWConfig = {
  cacheExpirationSeconds?: number;
};

export type PublicationConfig = {
  manifestUrl: string;
  proxyUrl?: string;
};

export type PrecachePublicationsMessage = {
  type: typeof PRECACHE_PUBLICATIONS;
  publications: PublicationConfig[];
};
