import React from 'react';
import { Box as ChakraBox, useRadio } from '@chakra-ui/react';
import { Icon, IconNames } from '@nypl/design-system-react-components';

import Button from './Button';

export interface ToggleButtonProps
  extends React.ComponentPropsWithRef<typeof ChakraBox> {
  isChecked?: false;
  optionProps?: {};
}

function ToggleButton(props: React.PropsWithChildren<ToggleButtonProps>) {
  const { isChecked, children, optionProps } = props;
  const { getInputProps, getCheckboxProps } = useRadio(props);

  const input = getInputProps();
  const checkbox = getCheckboxProps();

  return (
    <ChakraBox as="label">
      <input {...input} />
      <Button as="div" isChecked={isChecked} {...checkbox} {...optionProps}>
        {children}
        {isChecked ? <Icon decorative name={IconNames.check} /> : null}
      </Button>
    </ChakraBox>
  );
}

export default ToggleButton;
