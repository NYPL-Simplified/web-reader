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
  const circleColor = useColorModeValue('ui.black', 'ui.white', 'ui.black');
  const circleBgColor = useColorModeValue('ui.white', 'gray.700', 'ui.white');

  return (
    <Flex alignItems="center" bgColor={mainBgColor}>
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
        {...rest}
      >
        {children}
      </ChakraCircle>
    </Flex>
  );
}

export default PageButton;
