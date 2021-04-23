import React from 'react';
import { useRadioGroup } from '@chakra-ui/react';

import ToggleButton, { ToggleButtonProps } from './ToggleButton';

type optionProps = {
  colorScheme: string;
  value: string;
};

const Toggle = (props: {
  options: Array<optionProps | string>;
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
      {options.map((option: string | optionProps) => {
        if (typeof option === 'string') {
          const radio = getRadioProps({ value: option });
          return (
            <ToggleButton key={option} {...radio}>
              {option}
            </ToggleButton>
          );
        }
        const { value, ...rest } = option;
        const radio = getRadioProps({ value });
        return (
          <ToggleButton key={value} optionProps={rest} {...radio}>
            {value}
          </ToggleButton>
        );
      })}
    </div>
  );
};

export default Toggle;
