import { GetColor } from '../../../types';

const getButtonStyle = (getColor: GetColor) => ({
  // style object for base or default style
  baseStyle: {
    borderRadius: 'none',
  },
  // styles for different sizes ("sm", "md", "lg")
  sizes: {},
  // styles for different visual variants ("outline", "solid")
  variants: {
    solid: variantSolid(getColor),
    toggle: variantToggle(getColor),
  },
  // default values for `size`, `variant`, `colorScheme`
  defaultProps: {
    size: 'sm',
    variant: 'solid',
  },
});

/* Color Schemes:
 ** Light, Sepia, Dark
 * States:
 ** Normal
 ** Selected
 ** Disabled
 ** Hovered
 */
const variantSolid = (getColor: GetColor) => (props: any) => {
  const bgColor = getColor('ui.white', 'ui.black', 'ui.sepia');
  const color = getColor('gray.800', 'ui.white', 'gray.800');

  const _focus = { bgColor, color };
  const _hover = { bgColor, color, _disabled: { bgColor } };
  const _active = { bgColor, color };
  const _checked = { bgColor, color };
  const _disabled = { bgColor };

  return {
    border: '1px solid',
    borderColor: 'gray.100',
    transition: 'none',
    fontSize: 0,
    letterSpacing: 1,
    textTransform: 'uppercase',
    maxWidth: '100%',
    cursor: 'pointer',
    bgColor,
    color,
    _focus,
    _hover,
    _active,
    _checked,
    _disabled,
  };
};

const variantToggle = (getColor: GetColor) => (props: any) => {
  const bgColor = getColor('ui.white', 'gray.800', 'ui.white');
  const color = getColor('gray.800', 'ui.white', 'gray.800');
  return {
    ...variantSolid(getColor)(props),
    bgColor,
    color,
    px: 8,
    fontWeight: 'medium',
    fontSize: -2,
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
      color: 'ui.white',
      bgColor: 'green.700',
    },
  };
};

export default getButtonStyle;
