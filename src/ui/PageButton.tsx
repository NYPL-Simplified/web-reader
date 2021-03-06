import React from 'react';
import { Flex, Circle as ChakraCircle } from '@chakra-ui/react';

export type PageButtonProps = {
  children: React.ReactNode;
  onClick: (() => void) | undefined;
};

function PageButton(props: React.PropsWithoutRef<PageButtonProps>) {
  const { children, onClick, ...rest } = props;
  return (
    <Flex alignItems="center">
      <ChakraCircle
        as="button"
        d="flex"
        alignItems="center"
        border="1px solid"
        borderColor="ui.gray.light-cool"
        color="ui.black"
        bg="inherit"
        size={{ sm: '40px', md: '50px' }}
        mr={8}
        ml={6}
        cursor="unset"
        _hover={{ backgroundColor: 'gray.700', color: 'ui.white' }}
        onClick={onClick}
        {...rest}
      >
        {children}
      </ChakraCircle>
    </Flex>
  );
}

export default PageButton;
