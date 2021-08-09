import initWebReaderSW from '../src/ServiceWorker';

initWebReaderSW();

/**
 * So we need to cache things. We could just call cache.add, but then we can't really
 * know if a publication is fully cached.
 */
