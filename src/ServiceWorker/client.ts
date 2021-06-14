import { Workbox } from 'workbox-window';

/**
 * This file is to communicate with our service worker:
 *  - Telling it books to download
 *    - Whether the book needs to be decrypted
 *  - Querying which books are download
 *  - Receiving information on download progress
 */
