import * as React from 'react';
// this is a hacky thing to do we shouldn't rely on in the future
import 'regenerator-runtime/runtime';
import D2Reader from '@d-i-t-a/reader';
import '@d-i-t-a/reader/dist/reader.css';
import manifest from '../example/static/axisnow-webpub/manifest.json';
import { ReaderConfig } from '../../R2D2BC/dist/navigator/IFrameNavigator';

async function getContent(href: string): Promise<string> {
  // the href is the readingOrder href, which we use to know which
  // resource we need to fetch and decrypt
  console.log('hello!', href);
  console.log('manifest', manifest);
  return '<div>hello world</div>';
}

const R2Reader = () => {
  React.useEffect(() => {
    const url = new URL('http://localhost:1234/axisnow-webpub/manifest.json');
    D2Reader.load({
      url: url,
      injectables: injectables,
      api: {
        getContent,
      },
    })
      .then((instance: D2Reader) => {
        console.log('D2Reader loaded ', instance);
      })
      .catch((error: any) => {
        console.error('error.message ', error.message);
      });
  });

  return (
    <div>
      <header>
        <button onClick={() => D2Reader.previousPage()}>Prev Page</button>
        <button onClick={() => D2Reader.nextPage()}>Next Page</button>
        <button onClick={() => D2Reader.scroll(true)}>Scroll true</button>
        <button onClick={() => D2Reader.scroll(false)}>Scroll false</button>
      </header>
      <div id="root">
        <div
          id="D2Reader-Container"
          style={{ width: '100%', height: '100%', position: 'relative' }}
        >
          <main
            style={{ overflow: 'hidden' }}
            tabIndex={-1}
            id="iframe-wrapper"
          >
            <div id="reader-loading" className="loading"></div>
            <div id="reader-error" className="error"></div>
          </main>
          <span id="highlight-toolbox" className="highlight-toolbox">
            <div id="highlight-toolbox-mode-add">
              <button
                style={{ backgroundColor: 'gainsboro' }}
                id="highlightIcon"
              >
                <span
                  style={{
                    background: 'yellow',
                    display: 'inline-block',
                    width: 24,
                    height: 24,
                  }}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    preserveAspectRatio="xMidYMid meet"
                    role="img"
                    className="icon open"
                    aria-labelledby="text-icon"
                  >
                    <title id="text-icon">Text</title>
                    <path d="M5 4v3h5.5v12h3V7H19V4z"></path>
                  </svg>
                </span>
              </button>
              <button
                style={{ backgroundColor: 'gainsboro' }}
                id="underlineIcon"
              >
                <span
                  style={{
                    display: 'inline-block',
                    width: 24,
                    height: 24,
                    borderBottom: 'yellow solid 4px',
                  }}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    preserveAspectRatio="xMidYMid meet"
                    role="img"
                    className="icon open"
                    aria-labelledby="text-icon"
                  >
                    <title id="text-icon">Text</title>
                    <path d="M5 4v3h5.5v12h3V7H19V4z"></path>
                  </svg>
                </span>
              </button>
              <button style={{ backgroundColor: 'gainsboro' }} id="speakIcon">
                <span
                  style={{ display: 'inline-block', width: 24, height: 24 }}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    preserveAspectRatio="xMidYMid meet"
                    role="img"
                    className="icon open"
                    aria-labelledby="speak-icon"
                  >
                    <title id="speak-icon">Speak</title>
                    <circle cx="9" cy="9" r="4"></circle>
                    <path d="M9 15c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4zm7.76-9.64l-1.68 1.69c.84 1.18.84 2.71 0 3.89l1.68 1.69c2.02-2.02 2.02-5.07 0-7.27zM20.07 2l-1.63 1.63c2.77 3.02 2.77 7.56 0 10.74L20.07 16c3.9-3.89 3.91-9.95 0-14z"></path>
                    <path d="M0 0h24v24H0z" fill="none"></path>
                  </svg>
                </span>
              </button>
              <button style={{ backgroundColor: 'gainsboro' }} id="anIcon">
                <span
                  style={{ display: 'inline-block', width: 24, height: 24 }}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="black"
                    width="24"
                    height="24"
                  >
                    <path d="M0 0h24v24H0z" fill="none" />
                    <path d="M11 18h2v-2h-2v2zm1-16C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm0-14c-2.21 0-4 1.79-4 4h2c0-1.1.9-2 2-2s2 .9 2 2c0 2-3 1.75-3 5h2c0-2.25 3-2.5 3-5 0-2.21-1.79-4-4-4z" />
                  </svg>
                </span>
              </button>
            </div>
            <div id="highlight-toolbox-mode-edit">
              <button
                style={{ backgroundColor: 'gainsboro', display: 'none' }}
                id="deleteIcon"
              >
                <i className="material-icons" style={{ color: 'gray' }}>
                  delete
                </i>
              </button>
            </div>
          </span>
        </div>
      </div>
    </div>
  );
};

const injectables = [
  {
    type: 'style',
    url: 'http://localhost:1234/viewer/readium-css/ReadiumCSS-before.css',
    r2before: true,
  },
  {
    type: 'style',
    url: 'http://localhost:1234/viewer/readium-css/ReadiumCSS-default.css',
    r2default: true,
  },
  {
    type: 'style',
    url: 'http://localhost:1234/viewer/readium-css/ReadiumCSS-after.css',
    r2after: true,
  },
  {
    type: 'style',
    url: 'http://localhost:1234/viewer/injectables/pagebreak/pagebreak.css',
    r2after: true,
  },
  // { type: 'style', url: 'http://localhost:1234/viewer/readium-css/neon-after.css', r2after: true, appearance: 'neon' },
  {
    type: 'script',
    url:
      'https://cdnjs.cloudflare.com/ajax/libs/mathjax/2.7.6/MathJax.js?config=TeX-MML-AM_CHTML&latest',
  },
  {
    type: 'style',
    url: 'http://localhost:1234/viewer/fonts/opendyslexic/opendyslexic.css',
    fontFamily: 'opendyslexic',
    systemFont: false,
  },
  { type: 'style', fontFamily: 'Courier', systemFont: true },
  // {
  //   type: 'script',
  //   url: 'http://localhost:1234/viewer/injectables/click/click.js',
  // },
  // {
  //   type: 'script',
  //   url: 'http://localhost:1234/viewer/injectables/footnotes/footnotes.js',
  // },
  {
    type: 'style',
    url: 'http://localhost:1234/viewer/injectables/footnotes/footnotes.css',
  },
  // {
  //   type: 'script',
  //   url: 'http://localhost:1234/viewer/injectables/glossary/glossary.js',
  // },
  {
    type: 'style',
    url: 'http://localhost:1234/viewer/injectables/glossary/glossary.css',
  },
  {
    type: 'style',
    url: 'http://localhost:1234/viewer/injectables/style/style.css',
  },
];

export default R2Reader;
