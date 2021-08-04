import React from 'react';
import { Flex, Circle as ChakraCircle, Box } from '@chakra-ui/react';
import useColorModeValue from './hooks/useColorModeValue';

export type PageButtonProps = React.ComponentPropsWithoutRef<typeof Box> & {
  children: React.ReactNode;
};

function PageButton(props: React.PropsWithoutRef<PageButtonProps>) {
  const { children, onClick, ...rest } = props;
  const mainBgColor = useColorModeValue('ui.white', 'ui.black', 'ui.sepia');
  const circleColor = useColorModeValue('ui.black', 'ui.white', 'ui.black');
  const circleBgColor = useColorModeValue('ui.white', 'gray.700', 'ui.white');

  return (
    <Flex
      alignItems="center"
      bgColor={mainBgColor}
      position="fixed"
      top="0"
      height="100vh"
      {...rest}
    >
      <ChakraCircle
        as="button"
        d="flex"
        alignItems="center"
        border="1px solid"
        borderColor="ui.gray.light-cool"
        color={circleColor}
        bg={circleBgColor}
        size={{ sm: '40px', md: '50px' }}
        mr={8}
        ml={6}
        cursor="cursor"
        onClick={onClick}
      >
        {children}
      </ChakraCircle>
    </Flex>
  );
}

export default PageButton;
