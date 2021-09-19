import { useTheme, Theme } from '@emotion/react';
import { ColorMode } from '../../types';
import { getColor } from '../../utils/getColor';

export interface ColorModeTheme extends Theme {
  currentColorMode: ColorMode;
}

const useColorModeValue = (
  light: string,
  dark: string,
  sepia: string
): string => {
  const { currentColorMode } = useTheme() as ColorModeTheme;
  const color = getColor(currentColorMode)(light, dark, sepia);
  return color;
};

export default useColorModeValue;
