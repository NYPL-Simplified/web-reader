import { Workbox } from 'workbox-window';

const wb = new Workbox('./serviceWorker.ts');

wb.addEventListener('activated', (event) => {
  // Send a message to the service worker
  wb.messageSW({
    type: 'HELLO_WORLD',
    payload: { hello: 'world' },
  });
});

wb.addEventListener('controlling', (event) => {
  console.log('Service worker is controlling fetch.');
});

// Register the service worker after event listeners have been added.
wb.register();
