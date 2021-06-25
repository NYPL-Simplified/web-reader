import React from 'react';
import { useRadioGroup, UseRadioGroupProps } from '@chakra-ui/react';

type ToggleGroupProps = UseRadioGroupProps;

const ToggleGroup: React.FC<ToggleGroupProps> = ({
  defaultValue,
  value,
  name,
  children,
  onChange,
}) => {
  const { getRootProps, getRadioProps } = useRadioGroup({
    name,
    defaultValue,
    onChange,
    value,
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
