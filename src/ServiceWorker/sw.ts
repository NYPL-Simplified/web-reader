export {};

declare var self: ServiceWorkerGlobalScope;

const VERSION = 'v1';

self.addEventListener('install', (event) => {
  log('INSTALLING ');

  async function installSW() {
    // perform any install tasks
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

// handling service worker installation
self.addEventListener('fetch', (event) => {
  log('HTTP call intercepted - ' + event.request.url);

  // forward it to the network
  return event.respondWith(fetch(event.request.url));
});

// each logging line will be prepended with the service worker version
function log(message: string) {
  console.log(`SW (${VERSION}) -`, message);
}
