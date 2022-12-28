import React from 'react';
import { Global } from '@emotion/react';

const Fonts = () => (
  <Global
    styles={`
      /* latin */
      @font-face {
        font-family: 'Helvetica';
        src: url('Helvetica.eot');
        src: local('Helvetica'),
            url('Helvetica.eot?#iefix') format('embedded-opentype'),
            url('Helvetica.woff2') format('woff2'),
            url('Helvetica.woff') format('woff'),
            url('Helvetica.ttf') format('truetype');
        font-weight: normal;
        font-style: normal;
        font-display: swap;
    }
      @font-face {
        font-family: 'OpenDyslexic';
        font-style: normal;
        font-weight: 700;
        src: url('/fonts/opendyslexic/opendyslexic-regular-webfont.woff2')
            format('woff2'),
          url('/fonts/opendyslexic/opendyslexic-regular-webfont.woff')
            format('woff');
      }
      @font-face {
        font-family: 'robotoregular';
        src: url('Roboto-Regular-webfont.eot');
        src: url('Roboto-Regular-webfont.eot?#iefix') format('embedded-opentype'),
             url('Roboto-Regular-webfont.woff2') format('woff2'),
             url('Roboto-Regular-webfont.woff') format('woff'),
             url('Roboto-Regular-webfont.ttf') format('truetype'),
             url('Roboto-Regular-webfont.svg#robotoregular') format('svg');
        font-weight: normal;
        font-style: normal;
    }
      @font-face {
        font-family: 'robotolight';
        src: url('Roboto-Light-webfont.eot');
        src: url('Roboto-Light-webfont.eot?#iefix') format('embedded-opentype'),
             url('Roboto-Light-webfont.woff2') format('woff2'),
             url('Roboto-Light-webfont.woff') format('woff'),
             url('Roboto-Light-webfont.ttf') format('truetype'),
             url('Roboto-Light-webfont.svg#robotolight') format('svg');
        font-weight: normal;
        font-style: normal;
    
    }
    `}
  />
);

export default Fonts;
