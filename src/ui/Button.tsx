import React from 'react';
import { Button as ChakraButton } from '@chakra-ui/react';

export type ButtonProps = React.ComponentPropsWithRef<typeof ChakraButton>;

const Button: React.FC<ButtonProps> = (props) => (
  <ChakraButton colorScheme="gray" {...props} />
);

export default Button;
