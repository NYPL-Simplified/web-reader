import { extendTheme } from '@chakra-ui/react';
import Button from './components/button';
import colors from './foundations/colors';
import nyplTheme from '../nypl-base-theme';

/**
 * See Chakra default theme for shape of theme object:
 * https://github.com/chakra-ui/chakra-ui/tree/main/packages/theme
 */
const theme = extendTheme(
  {
    colors,
    /**
     * Chakra documentation on component styles:
     * https://chakra-ui.com/docs/theming/component-style
     */
    components: {
      Button,
    },
  },
  nyplTheme
);

export default theme;
