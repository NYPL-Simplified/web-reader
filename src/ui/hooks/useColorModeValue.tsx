import { useTheme } from '@emotion/react';
import { getColor } from '../../utils/getColor';

const useColorModeValue = (
  light: string,
  dark: string,
  sepia: string
): string => {
  const { currentColorMode } = useTheme() as any; // TODO: find out the type for this
  const color = getColor(currentColorMode)(light, dark, sepia);
  return color;
};

export default useColorModeValue;
