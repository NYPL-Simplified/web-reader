import React from 'react';
import { Flex, Circle as ChakraCircle } from '@chakra-ui/react';
import useColorModeValue from './hooks/useColorModeValue';

export type PageButtonProps = {
  children: React.ReactNode;
  onClick: (() => void) | undefined;
};

function PageButton(props: React.PropsWithoutRef<PageButtonProps>) {
  const { children, onClick, ...rest } = props;
  const mainBgColor = useColorModeValue('ui.white', 'ui.black', 'ui.sepia');
  const circleColor = useColorModeValue('ui.black', 'gray.700', 'ui.black');
  return (
    <Flex alignItems="center" bgColor={mainBgColor}>
      <ChakraCircle
        as="button"
        d="flex"
        alignItems="center"
        border="1px solid"
        borderColor="ui.gray.light-cool"
        color={circleColor}
        bg="inherit"
        size={{ sm: '40px', md: '50px' }}
        mr={8}
        ml={6}
        cursor="unset"
        _hover={{
          backgroundColor: 'gray.700',
          color: 'ui.white',
          border: 'none',
        }}
        onClick={onClick}
        {...rest}
      >
        {children}
      </ChakraCircle>
    </Flex>
  );
}

export default PageButton;
