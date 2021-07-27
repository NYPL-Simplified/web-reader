import { extendTheme } from '@chakra-ui/react';
import Text from './components/text';
import colors from './foundations/colors';
import nyplTheme from '../nypl-base-theme';
import { ColorMode } from '../../types';
import { getColor } from '../../utils/getColor';
import getButtonStyle from './components/button';

/**
 * See Chakra default theme for shape of theme object:
 * https://github.com/chakra-ui/chakra-ui/tree/main/packages/theme
 */
export function theme(colorMode: ColorMode) {
  return extendTheme(
    {
      colors,
      /**
       * Chakra documentation on component styles:
       * https://chakra-ui.com/docs/theming/component-style
       */
      components: {
        Button: getButtonStyle(getColor(colorMode)),
        Text,
      },
      currentColorMode: colorMode,
    },
    nyplTheme
  );
}
