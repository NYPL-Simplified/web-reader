import React from 'react';
import { Button as ChakraButton } from '@chakra-ui/react';

export type ButtonProps = React.ComponentPropsWithRef<typeof ChakraButton>;

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (props, ref) => {
    return <ChakraButton ref={ref} variant="solid" {...props} />;
  }
);

export default Button;
