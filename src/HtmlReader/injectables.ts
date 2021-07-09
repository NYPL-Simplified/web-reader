const origin = window.location.origin;

const injectables = [
  {
    type: 'style',
    url: `${origin}/css/ReadiumCSS-before.css`,
    r2before: true,
  },
  {
    type: 'style',
    url: `${origin}/css/ReadiumCSS-default.css`,
    r2default: true,
  },
  {
    type: 'style',
    url: `${origin}/css/ReadiumCSS-after.css`,
    r2after: true,
  },
  // {
  //   type: 'script',
  //   url:
  //     'https://cdnjs.cloudflare.com/ajax/libs/mathjax/2.7.6/MathJax.js?config=TeX-MML-AM_CHTML&latest',
  // },
  // {
  //   type: 'style',
  //   url: 'http://localhost:1234/viewer/fonts/opendyslexic/opendyslexic.css',
  //   fontFamily: 'opendyslexic',
  //   systemFont: false,
  // },
  // { type: 'style', fontFamily: 'Courier', systemFont: true },
];

export default injectables;
