import React from 'react';
import { Global } from '@emotion/react';

const Fonts = () => (
  <Global
    styles={`
      /* latin */
      @font-face {
        font-family: 'OpenDyslexic';
        font-style: normal;
        font-weight: 700;
        src: url('/fonts/opendyslexic/opendyslexic-regular-webfont.woff2')
            format('woff2'),
          url('/fonts/opendyslexic/opendyslexic-regular-webfont.woff')
            format('woff');
      }
    `}
  />
);

export default Fonts;
