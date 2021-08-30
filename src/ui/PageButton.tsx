import React from 'react';
import { Circle as ChakraCircle, Box } from '@chakra-ui/react';
import useColorModeValue from './hooks/useColorModeValue';

export type PageButtonProps = React.ComponentPropsWithoutRef<typeof Box> & {
  children: React.ReactNode;
};

function PageButton(
  props: React.PropsWithoutRef<PageButtonProps>
): React.ReactElement {
  const { children, onClick, ...rest } = props;
  const circleColor = useColorModeValue('ui.black', 'ui.white', 'ui.black');
  const circleBgColor = useColorModeValue('ui.white', 'gray.700', 'ui.white');

  return (
    <ChakraCircle
      as="button"
      d="flex"
      position="fixed"
      zIndex="docked"
      alignItems="center"
      border="1px solid"
      borderColor="ui.gray.light-cool"
      color={circleColor}
      bg={circleBgColor}
      size={{ sm: '40px', md: '50px' }}
      mx={{ sm: 2, md: 6 }}
      top="50%"
      cursor="cursor"
      onClick={onClick}
      {...rest}
    >
      {children}
    </ChakraCircle>
  );
}

export default PageButton;
