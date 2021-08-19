import initWebReaderSW from '../src/ServiceWorker/sw';

initWebReaderSW();
/**
 * ON INSTALL
 *  - Cache app shell
 *
 * WHEN MANIFESTS AVAILABLE
 *  - Cache manifest
 *  - Add all book resources to cache.
 *  - If file already exists, skip caching it unless older than some time
 *
 * NEXT
 *  - Check which books are cached
 *  - Maybe save books to their own individual caches?
 *  - Skip waiting to have SW run on first load
 *    - will this be ok because our app shell uses hashes?
 *
 * OPTIONS
 *  - Simply add stuff to the cache in the hook, serve it from the cache in the
 *    SW
 *  - Add stuff to indexedDB in the client, check indexedDB when responding to
 *    requests
 *
 * PROBLEMS
 *  - Can't determine if a request is for a book from the request alone. So we have
 *    to just check if it's in the cache, and serve it from there if so.
 *
 */
