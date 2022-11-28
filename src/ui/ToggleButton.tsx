import React, { ReactElement } from 'react';
import {
  Box as ChakraBox,
  ThemeProvider,
  useRadio,
  useTheme,
  Icon,
  useStyleConfig,
} from '@chakra-ui/react';

import Button from './Button';
import Fonts from './theme/foundations/fonts';
import { getTheme } from './theme';
import { ColorMode } from '../types';

export interface ToggleButtonProps
  extends React.ComponentPropsWithoutRef<typeof ChakraBox> {
  bgColor?: string;
  font?: string;
  fontSize?: number;
  fontWeight?: string;
  icon?: ReactElement;
  iconFill?: string;
  isChecked?: false;
  colorMode?: ColorMode;
  label?: string;
  value: string;
}

function ToggleButton(
  props: React.PropsWithoutRef<ToggleButtonProps>
): React.ReactElement {
  const {
    bgColor,
    font,
    fontSize,
    fontWeight,
    icon,
    iconFill,
    children,
    colorMode,
    label,
    textColor,
    value,
    ...rest
  } = props;
  const { getInputProps, getCheckboxProps } = useRadio(props);

  const input = getInputProps();
  const checkbox = getCheckboxProps();
  const theme = useTheme();
  const buttonStyles = useStyleConfig('Button', {
    variant: 'settings',
    font: font || 'roboto',
    fontSize: fontSize ?? [0, 0, 2],
    fontWeight: fontWeight || 'light',
    permanentBgColor: bgColor || undefined,
    permanentTextColor: textColor || undefined,
    value,
  });

  return (
    // This will override the default theme if we specify the colorMode to the toggle button.
    <ThemeProvider theme={getTheme(colorMode ?? theme.currentColorMode)}>
      <Fonts />
      <ChakraBox as="label" d="flex" flexGrow={1} aria-label={label}>
        <input {...input} />
        <Button as="div" {...checkbox} sx={buttonStyles} {...rest} flexGrow={1}>
          {icon && (
            <Icon
              as={icon}
              verticalAlign="middle"
              mr="6px"
              w={6}
              h={6}
              fill={iconFill && iconFill}
            />
          )}
          {children}
        </Button>
      </ChakraBox>
    </ThemeProvider>
  );
}

export default ToggleButton;
