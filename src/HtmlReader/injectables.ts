const origin = window.location.origin;

const injectables = [
  {
    type: 'style',
    url: `${origin}/css/html-reader.css`,
  },
  {
    type: 'style',
    url: `${origin}/fonts/opendyslexic/opendyslexic.css`,
    fontFamily: 'opendyslexic',
  },
];

export default injectables;
