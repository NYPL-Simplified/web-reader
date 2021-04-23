import React from 'react';
import { Box as ChakraBox, useRadio } from '@chakra-ui/react';
import { CheckCircleIcon } from '@chakra-ui/icons';
// import { Icon, IconNames } from '@nypl/design-system-react-components';

import Button from './Button';

function ToggleButton(props: any) {
  const { isChecked = false } = props;
  const { getInputProps, getCheckboxProps } = useRadio(props);

  const input = getInputProps();
  const checkbox = getCheckboxProps();

  return (
    <ChakraBox as="label">
      <input {...input} />
      <Button as="div" {...checkbox} isChecked={isChecked} onChange={() => {}}>
        {props.children}
        {isChecked ? <CheckCircleIcon /> : null}
      </Button>
    </ChakraBox>
  );
}

export default ToggleButton;
