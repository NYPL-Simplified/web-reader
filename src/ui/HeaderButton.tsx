import React from 'react';
import { Button as ChakraButton } from '@chakra-ui/react';
import useColorModeValue from './hooks/useColorModeValue';

export type ButtonProps = React.ComponentPropsWithRef<typeof ChakraButton>;

const HeaderButton = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (props, ref) => {
    const color = useColorModeValue('gray.700', 'gray.100', 'gray.700');
    return (
      <ChakraButton
        ref={ref}
        p={1}
        border="none"
        bg="transparent"
        textTransform="uppercase"
        fontSize={0}
        color={color}
        _hover={{ bgColor: 'transparent' }}
        _active={{ bgColor: 'transparent' }}
        {...props}
      />
    );
  }
);

export default HeaderButton;
