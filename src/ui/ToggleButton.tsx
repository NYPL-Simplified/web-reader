import React from 'react';
import {
  Box as ChakraBox,
  ThemeProvider,
  useRadio,
  useTheme,
  Icon,
} from '@chakra-ui/react';

import Button from './Button';
import { getTheme } from './theme';
import { ColorMode } from '../types';
import { MdOutlineCheckCircle } from 'react-icons/md';

export interface ToggleButtonProps
  extends React.ComponentPropsWithoutRef<typeof ChakraBox> {
  isChecked?: false;
  colorMode?: ColorMode;
  value: string;
}

function ToggleButton(
  props: React.PropsWithoutRef<ToggleButtonProps>
): React.ReactElement {
  const { isChecked, children, colorMode, ...rest } = props;
  const { getInputProps, getCheckboxProps } = useRadio(props);

  const input = getInputProps();
  const checkbox = getCheckboxProps();
  const theme = useTheme();

  return (
    // This will override the default theme if we specify the colorMode to the toggle button.
    <ThemeProvider theme={getTheme(colorMode ?? theme.currentColorMode)}>
      <ChakraBox as="label" d="flex" flexGrow={1}>
        <input {...input} />
        <Button as="div" {...checkbox} variant="toggle" {...rest} flexGrow={1}>
          {children}
          {isChecked && (
            <Icon
              as={MdOutlineCheckCircle}
              position="absolute"
              verticalAlign="middle"
              right={2}
              top="50%"
              transform="translateY(-50%)"
              alignItems="baseline"
              w={5}
              h={5}
            />
          )}
        </Button>
      </ChakraBox>
    </ThemeProvider>
  );
}

export default ToggleButton;
