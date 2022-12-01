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
  const { 'aria-expanded': expanded, isSettingsButton } = props;
  const bgColor = getColor(
    isSettingsButton ? 'ui.white' : 'ui.gray.light-warm',
    'ui.black',
    'ui.sepia'
  );
  const bgColorActive = getColor(
    'ui.gray.active',
    'ui.gray.x-dark',
    'ui.gray.active'
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
  const {
    permanentBgColor,
    permanentTextColor,
    font,
    fontSize,
    fontWeight,
    value,
  } = props;
  const bgColor = permanentBgColor
    ? permanentBgColor
    : getColor('ui.white', 'ui.black', 'ui.sepia');

  const color = permanentTextColor
    ? permanentTextColor
    : getColor('ui.black', 'ui.white', 'ui.black');

  const checkedBgColor = getColor(
    'ui.gray.light-warm',
    'ui.gray.x-dark',
    'ui.sepiaChecked'
  );

  return {
    ...variantSolid(getColor)(props),
    bgColor,
    border: '1px solid',
    borderBottom: (value === 'paginated' || value === 'scrolling') && 'none',
    borderRadius:
      value === 'paginated'
        ? '0 0 0 20px'
        : value === 'scrolling'
        ? '0 0 20px 0'
        : null,
    color,
    px: [2, 2, 7],
    py: 6,
    width: [8, 16, 24, 28],
    fontFamily: font,
    fontSize: fontSize,
    fontWeight: fontWeight,
    _focus: {
      bgColor,
    },
    _hover: {
      bgColor,
    },
    _active: {
      bgColor,
    },
    _checked: {
      color,
      bgColor: permanentBgColor ? permanentBgColor : checkedBgColor,
      borderBottom: 'none',
      p: {
        textDecoration: 'underline',
      },
    },
  };
};

export default getButtonStyle;
