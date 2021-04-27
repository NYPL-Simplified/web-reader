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

  const checked = isChecked
    ? {
        color: 'white',
        bg: 'green.500',
        _hover: {
          color: 'white',
          bg: 'green.500',
        },
      }
    : {};

  return (
    <ChakraBox as="label">
      <input {...input} />
      <Button
        as="div"
        isChecked={isChecked}
        {...checked}
        rightIcon={
          isChecked ? <Icon decorative name={IconNames.check} /> : null
        }
        {...checkbox}
        {...optionProps}
      >
        {children}
      </Button>
    </ChakraBox>
  );
}

export default ToggleButton;
