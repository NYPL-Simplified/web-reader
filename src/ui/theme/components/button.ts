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
  const { colorScheme } = props;
  // dynamic colors based on colorMode
  let bgColor = getColor('ui.white', 'ui.black', 'ui.sepia');
  let color = getColor('gray.800', 'ui.white', 'gray.800');

  // style stays the same when it's being labeled with a colorScheme prop.
  switch (colorScheme) {
    case 'light':
      bgColor = 'ui.white';
      color = 'gray.800';
      break;
    case 'dark':
      bgColor = 'ui.black';
      color = 'ui.white';
      break;
    case 'sepia':
      bgColor = 'ui.sepia';
      color = 'gray.800';
      break;
  }

  const _focus = { bgColor, color };
  const _hover = { bgColor, color, _disabled: { bgColor } };
  const _active = { bgColor, color };
  const _checked = { bgColor, color };
  const _disabled = { bgColor };

  return {
    px: 8,
    border: '1px solid',
    borderColor: 'gray.100',
    transition: 'none',
    fontSize: -2,
    fontWeight: 'medium',
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
