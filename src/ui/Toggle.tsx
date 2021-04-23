import React from 'react';
import { useRadioGroup } from '@chakra-ui/react';

import ToggleButton from './ToggleButton';

const Toggle = (props: {
  options: string[];
  defaultValue?: string;
  name?: string;
}) => {
  const { options, name, defaultValue } = props;
  const { getRootProps, getRadioProps } = useRadioGroup({
    name,
    defaultValue,
    onChange: console.log,
  });

  const group = getRootProps();

  return (
    <div {...group}>
      {options.map((value: string) => {
        const radio = getRadioProps({ value });
        return (
          <ToggleButton key={value} {...radio}>
            {value}
          </ToggleButton>
        );
      })}
    </div>
  );
};

export default Toggle;
