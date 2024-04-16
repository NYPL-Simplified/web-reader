import React from 'react';
import { Button } from '@chakra-ui/react';
import useColorModeValue from './hooks/useColorModeValue';

export type PageButtonProps = React.ComponentPropsWithoutRef<typeof Button> & {
  children: React.ReactNode;
};

function PageButton(
  props: React.PropsWithoutRef<PageButtonProps>
): React.ReactElement {
  const { children, onClick, ...rest } = props;
  const circleColor = useColorModeValue('ui.black', 'ui.white', 'ui.black');
  const circleBgColor = useColorModeValue(
    'ui.gray.light-warm',
    'ui.black',
    'ui.sepia'
  );

  return (
    <Button
      color={circleColor}
      bg={circleBgColor}
      height="auto"
      border="none"
      cursor="pointer"
      onClick={onClick}
      p={{ sm: 2 }}
      {...rest}
    >
      {children}
    </Button>
  );
}

export default PageButton;
