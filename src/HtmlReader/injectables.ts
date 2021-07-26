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
  {
    type: 'style',
    url: `${origin}/fonts/opendyslexic/opendyslexic.css`,
    fontFamily: 'opendyslexic',
  },
];

export default injectables;
