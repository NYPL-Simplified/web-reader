import { extendTheme } from '@chakra-ui/react';
import Alert from './components/alert';
import Text from './components/text';
import colors from './foundations/colors';
import breakpoints from '../nypl-base-theme/foundations/breakpoints';
import typography from './foundations/typography';
import nyplTheme from '../nypl-base-theme';
import { ColorMode } from '../../types';
import { getColor } from '../../utils/getColor';
import getButtonStyle from './components/button';
import { Dict } from './types';

/**
 * See Chakra default theme for shape of theme object:
 * https://github.com/chakra-ui/chakra-ui/tree/main/packages/theme
 *
 * Making this a function because we need to adjust the theme based
 * on the colorMode that's being passed in.
 *
 * Returns the chakra theme object with an additional property `currentColorMode`
 */
export function getTheme(colorMode: ColorMode = 'day'): Dict<unknown> {
  return extendTheme(
    {
      colors,
      ...typography,
      /**
       * Chakra documentation on component styles:
       * https://chakra-ui.com/docs/theming/component-style
       */
      components: {
        Button: getButtonStyle(getColor(colorMode)),
        Text,
        Alert,
      },
      currentColorMode: colorMode,
    },
    nyplTheme
  );
}
