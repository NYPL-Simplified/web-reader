import React, { ReactElement } from 'react';
import {
  Box as ChakraBox,
  ThemeProvider,
  useRadio,
  useTheme,
  Icon,
  Text,
} from '@chakra-ui/react';

import Button from './Button';
import Fonts from './theme/foundations/fonts';
import { getTheme } from './theme';
import { ColorMode } from '../types';

export type ToggleButtonProps = React.ComponentPropsWithoutRef<
  typeof ChakraBox
> & {
  colorMode?: ColorMode;
  icon?: ReactElement;
  iconFill?: string;
  label?: string;
  value: string;
};

function ToggleButton(
  props: React.PropsWithoutRef<ToggleButtonProps>
): React.ReactElement {
  const { children, colorMode, icon, iconFill, label, value, ...rest } = props;
  const { getInputProps, getCheckboxProps } = useRadio(props);

  const input = getInputProps();
  const checkbox = getCheckboxProps();
  const theme = useTheme();

  return (
    // This will override the default theme if we specify the colorMode to the toggle button.
    <ThemeProvider theme={getTheme(colorMode ?? theme.currentColorMode)}>
      <Fonts />
      <ChakraBox as="label" display="flex" flexGrow={1} aria-label={label}>
        <input {...input} />
        <Button
          as="div"
          variant="settings"
          flexGrow={1}
          {...checkbox}
          {...rest}
        >
          {icon && (
            <Icon
              as={icon}
              verticalAlign="middle"
              mr={1.5}
              w={6}
              h={6}
              fill={iconFill && iconFill}
            />
          )}
          {label && <Text>{label}</Text>}
        </Button>
      </ChakraBox>
    </ThemeProvider>
  );
}

export const FontToggleButton: typeof ToggleButton = (props) => {
  return <ToggleButton fontSize={[-2, -2, -1, -1, 0]} py={6} {...props} />;
};

export const ColorModeToggleButton: typeof ToggleButton = ({
  bgColor,
  ...rest
}) => {
  return (
    <ToggleButton
      sx={{
        _checked: {
          bgColor,
          p: {
            textDecoration: 'underline',
            textUnderlinePosition: 'under',
          },
        },
      }}
      {...rest}
    />
  );
};

export default ToggleButton;
