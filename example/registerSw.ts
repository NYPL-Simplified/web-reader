/**
 * Every consuming app will need to have a serviceWorker.js file and
 * in there they can call our code.
 */

// Check that service workers are supported
if ('serviceWorker' in navigator) {
  // Use the window load event to keep the page load performant
  window.addEventListener('load', () => {
    navigator.serviceWorker
      .register(new URL('./serviceWorker.ts', import.meta.url), {
        type: 'module',
      })
      .then(
        (registration) => {
          // Registration was successful
          console.log('ServiceWorker registration successful.');
        },
        (err) => {
          // registration failed :(
          console.log('ServiceWorker registration failed: ', err);
        }
      );
  });
}
