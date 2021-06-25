import { extendTheme } from '@chakra-ui/react';
import Button from './components/button';
import breakpoints from './foundations/breakpoints';
import typography from './foundations/typography';
import colors from './foundations/colors';
import radii from './foundations/radii';
import spacing from './foundations/spacing';
import Checkbox from './components/checkbox';
import Input from './components/input';
import global from './foundations/global';
import FormLabel from './components/form-label';
import Form from './components/form';
import FormError from './components/form-error';
import Textarea from './components/text-area';

/**
 * See Chakra default theme for shape of theme object:
 * https://github.com/chakra-ui/chakra-ui/tree/main/packages/theme
 */
const theme = extendTheme({
  styles: { global },
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
    Checkbox,
    Input,
    FormLabel,
    Form,
    FormError,
    Textarea,
  },
});

export default theme;
