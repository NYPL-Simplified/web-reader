import React from 'react';
import { useRadioGroup, UseRadioGroupProps } from '@chakra-ui/react';

type ToggleGroupProps = Omit<UseRadioGroupProps, 'value' | 'defaultValue'> & {
  value: string;
  label: string;
};

const ToggleGroup: React.FC<ToggleGroupProps> = ({
  value,
  label,
  name,
  children,
  onChange,
}) => {
  const { getRootProps, getRadioProps } = useRadioGroup({
    name,
    onChange,
    value,
  });

  const group = getRootProps();

  return (
    <div {...group} aria-label={label}>
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
