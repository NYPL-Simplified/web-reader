import { Button } from '@chakra-ui/react';
import React from 'react';
import { GetColor } from '../../../types';

const getButtonStyle = (getColor: GetColor) =>
  ({
    // style object for base or default style
    baseStyle: {
      borderRadius: 'none',
    },
    // styles for different sizes ("sm", "md", "lg")
    sizes: {},
    // styles for different visual variants ("outline", "solid")
    variants: {
      solid: variantSolid(getColor),
      settings: variantSettings(getColor),
    },
    // default values for `size`, `variant`, `colorScheme`
    defaultProps: {
      size: 'sm',
      variant: 'solid',
    },
  } as const);

/* Color Schemes:
 ** Light, Sepia, Dark
 * States:
 ** Normal
 ** Selected
 ** Disabled
 ** Hovered
 */

const variantSolid = (getColor: GetColor) => (
  props: React.ComponentProps<typeof Button>
) => {
  const { 'aria-expanded': expanded } = props;

  const bgColor = getColor('ui.gray.light-warm', 'ui.black', 'ui.sepia');

  const bgColorActive = getColor(
    'ui.gray.active',
    'ui.gray.x-dark',
    'ui.sepiaChecked'
  );
  const color = getColor('gray.800', 'ui.white', 'gray.800');

  const _focus = { bgColor: bgColorActive, color };
  const _hover = {
    bgColor: bgColorActive,
    color,
    _disabled: { bgColor },
  };
  const _active = { bgColor: bgColorActive, color };
  const _checked = { bgColor, color };
  const _disabled = { bgColor };

  return {
    border: 'none',
    borderColor: 'gray.100',
    height: '48px',
    transition: 'none',
    fontSize: 0,
    letterSpacing: 1,
    maxWidth: '100%',
    cursor: 'pointer',
    bgColor: expanded ? bgColorActive : bgColor,
    color,
    _focus,
    _hover,
    _active,
    _checked,
    _disabled,
  };
};

const variantSettings = (getColor: GetColor) => (
  props: React.ComponentProps<typeof Button>
) => {
  const { bgColor, value } = props;

  const color = getColor('ui.black', 'ui.white', 'ui.black');

  const checkedBgColor = getColor(
    'ui.gray.light-warm',
    'ui.gray.x-dark',
    'ui.sepiaChecked'
  );

  return {
    ...variantSolid(getColor)(props),
    bgColor: getColor('ui.white', 'ui.black', 'ui.sepia'),
    border: '1px solid',
    borderBottom: (value === 'paginated' || value === 'scrolling') && 'none',
    borderRadius:
      value === 'paginated'
        ? '0 0 0 4px'
        : value === 'scrolling'
        ? '0 0 4px 0'
        : null,
    color,
    py: 8,
    width: [8, 16, 36],
    fontSize: [0, 0, 2],
    whiteSpace: ['normal', 'normal', 'nowrap'],
    _active: {
      bgColor,
    },
    _checked: {
      color,
      bgColor: checkedBgColor,
      borderBottomColor: checkedBgColor,
      p: {
        textDecoration: 'underline',
      },
    },
    _hover: {
      bgColor,
    },
    _focus: {
      bgColor,
      zIndex: 1000,
    },
  };
};

export default getButtonStyle;
