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
      {React.Children.toArray(children).map((element) => {
        const radio = getRadioProps({ value: element.props.value });
        return React.cloneElement(element, radio);
      })}
    </div>
  );
};

export default ToggleGroup;
