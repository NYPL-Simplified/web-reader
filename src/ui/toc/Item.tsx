import React from 'react';
import useColorModeValue from '../hooks/useColorModeValue';
import { MenuItem } from '../menu';

export const Item = React.forwardRef<
  HTMLAnchorElement,
  React.ComponentProps<typeof MenuItem> & { html: string }
>(({ html, children, ...props }, ref) => {
  const bgColor = useColorModeValue('ui.white', 'ui.black', 'ui.sepia');
  const color = useColorModeValue('ui.black', 'ui.white', 'ui.black');
  const borderColor = useColorModeValue(
    'ui.gray.medium',
    'gray.500',
    'yellow.600'
  );

  const _hover = {
    textDecoration: 'none',
    background: 'ui.gray.x-dark',
    color: 'ui.white',
  } as const;

  const _focus = {
    ..._hover,
    boxShadow: 'none',
  } as const;

  return (
    <>
      <MenuItem
        d="flex"
        flexDir="column"
        alignItems="stretch"
        listStyleType="none"
        bg={bgColor}
        color={color}
        _hover={_hover}
        _focus={_focus}
        tabIndex={-1}
        borderBottom="1px solid"
        borderColor={borderColor}
        {...props}
      >
        <span dangerouslySetInnerHTML={{ __html: html }} />
      </MenuItem>
      {children}
    </>
  );
});
