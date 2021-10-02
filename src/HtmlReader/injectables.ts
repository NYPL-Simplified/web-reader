const origin = window.location.origin;

export const defaultInjectables = [
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

export const defaultInjectablesFixed = [];
