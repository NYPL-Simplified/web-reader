import React from 'react';
import { Box as ChakraBox, Circle, useRadio } from '@chakra-ui/react';
import { Icon, IconNames } from '@nypl/design-system-react-components';

import Button from './Button';

export interface ToggleButtonProps
  extends React.ComponentPropsWithoutRef<typeof ChakraBox> {
  isChecked?: false;
  value: string;
}

function ToggleButton(props: React.PropsWithoutRef<ToggleButtonProps>) {
  const { isChecked, children, ...rest } = props;
  const { getInputProps, getCheckboxProps } = useRadio(props);

  const input = getInputProps();
  const checkbox = getCheckboxProps();

  return (
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
          >
            <Icon decorative name={IconNames.check} modifiers={['small']} />
          </Circle>
        )}
      </Button>
    </ChakraBox>
  );
}

export default ToggleButton;
