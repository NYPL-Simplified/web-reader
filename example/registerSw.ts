// Check that service workers are supported
console.log('registering sw');
if ('serviceWorker' in navigator) {
  // Use the window load event to keep the page load performant
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('./serviceWorker.ts').then(
      (registration) => {
        // Registration was successful
        console.log(
          'ServiceWorker registration successful with scope: ',
          registration.scope
        );

        // notify on updates
        registration.onupdatefound = () => {
          const installingWorker = registration.installing;
          if (installingWorker == null) {
            return;
          }
          installingWorker.onstatechange = () => {
            if (installingWorker.state === 'installed') {
              if (navigator.serviceWorker.controller) {
                console.log(
                  'New content is available and will be used when all tabs for this page are closed.'
                );
              } else {
                console.log('Content is cached for offline use.');
              }
            }
          };
        };
      },
      (err) => {
        // registration failed :(
        console.log('ServiceWorker registration failed: ', err);
      }
    );
  });
}
