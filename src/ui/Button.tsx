import React from 'react';
import { Button as ChakraButton } from '@chakra-ui/react';

export type ButtonProps = React.ComponentPropsWithRef<typeof ChakraButton>;

const Button: React.FC<ButtonProps> = (props) => {
  return <ChakraButton variant="solid" {...props} />;
};

export default Button;
