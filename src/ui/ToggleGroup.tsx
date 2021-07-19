import React from 'react';
import { Flex, useRadioGroup, UseRadioGroupProps } from '@chakra-ui/react';

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
    <Flex {...group} aria-label={label} flex="1 0 auto" flexWrap="wrap" my={2}>
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
    </Flex>
  );
};

export default ToggleGroup;
