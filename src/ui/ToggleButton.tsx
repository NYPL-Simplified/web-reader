import React from 'react';
import {
  Box as ChakraBox,
  Circle,
  ThemeProvider,
  useRadio,
  useTheme,
} from '@chakra-ui/react';
import { Icon, IconNames } from '@nypl/design-system-react-components';

import Button from './Button';
import { getTheme } from './theme';
import { ColorMode } from '../types';

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
            <Circle
              position="absolute"
              verticalAlign="middle"
              right={2}
              top="50%"
              transform="translateY(-50%)"
              borderColor="white"
              border="1px solid"
              size="15px"
              alignItems="baseline"
            >
              <Icon decorative name={IconNames.check} modifiers={['small']} />
            </Circle>
          )}
        </Button>
      </ChakraBox>
    </ThemeProvider>
  );
}

export default ToggleButton;
