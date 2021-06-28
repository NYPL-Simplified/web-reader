import { Colors } from '@chakra-ui/react';

const colors: Colors = {
  transparent: 'transparent',

  // ui fills
  /**
   * We can define these when we need to. We will use the
   * NYPL base them until we need to customize, then we can
   * do that here
   */
  // ui: {
  //   black: '#000',
  //   white: '#fff',
  //   link: {
  //     primary: '#0576D3',
  //     secondary: '#004B98',
  //   },
  // },

  /**
   * The following color scales are useful for color edge cases
   * where a distinct named ui or brand color doesn't quite work.
   */
  // EXAMPLE:
  // gray: {
  //   '50': '#F2F2F2',
  //   '100': '#DBDBDB',
  //   '200': '#C4C4C4',
  //   '300': '#ADADAD',
  //   '400': '#969696',
  //   '500': '#808080',
  //   '600': '#666666',
  //   '700': '#4D4D4D',
  //   '800': '#333333',
  //   '900': '#1A1A1A',
  // },
};

export default colors;
