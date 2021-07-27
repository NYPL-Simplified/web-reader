import { ColorMode } from '../types';

export function getColor(colorMode: ColorMode) {
  return (light: string, dark: string, sepia: string): string => {
    switch (colorMode) {
      case 'day':
        return light;
      case 'night':
        return dark;
      case 'sepia':
        return sepia;
    }
  };
}
