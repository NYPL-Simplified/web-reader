import React from 'react';
import { useRadioGroup } from '@chakra-ui/react';

import ToggleButton from './ToggleButton';

const ToggleGroup = (props: {
  defaultValue?: string;
  name?: string;
  children: typeof ToggleButton | Array<typeof ToggleButton>;
}) => {
  const { name, defaultValue, children } = props;
  const { getRootProps, getRadioProps } = useRadioGroup({
    name,
    defaultValue,
    onChange: console.log,
  });

  const group = getRootProps();

  return (
    <div {...group}>
      {React.Children.map(children, (element) => {
        try {
          const value = (element as any).props.value;
          const radio = getRadioProps({ value });
          return React.cloneElement(element as any, radio);
        } catch (e) {
          throw new Error(
            'ToggleGroup expects ToggleButton children with `value` props.'
          );
        }
      })}
    </div>
  );
};

export default ToggleGroup;
