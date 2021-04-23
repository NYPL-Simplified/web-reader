import { extendTheme } from '@chakra-ui/react';
import Button from './components/button';
import breakpoints from './foundations/breakpoints';
import typography from './foundations/typography';
import colors from './foundations/colors';
import radii from './foundations/radii';
import spacing from './foundations/spacing';

/**
 * See Chakra default theme for shape of theme object:
 * https://github.com/chakra-ui/chakra-ui/tree/main/packages/theme
 */
const theme = extendTheme({
  breakpoints,
  radii,
  colors,
  ...typography,
  space: spacing,
  /**
   * Chakra documentation on component styles:
   * https://chakra-ui.com/docs/theming/component-style
   */
  components: {
    Button,
  },
});

export default theme;
