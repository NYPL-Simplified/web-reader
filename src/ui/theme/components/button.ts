const ButtonStyle = {
  // style object for base or default style
  baseStyle: {
    borderRadius: 'none',
  },
  // styles for different sizes ("sm", "md", "lg")
  sizes: {},
  // styles for different visual variants ("outline", "solid")
  variants: {
    solid: variantSolid,
  },
  // default values for `size`, `variant`, `colorScheme`
  defaultProps: {
    size: 'md',
    variant: 'solid',
    colorScheme: 'light',
  },
};

/* Color Schemes:
 ** Light, Sepia, Dark
 * States:
 ** Normal
 ** Selected
 ** Disabled
 ** Hovered
 */
function variantSolid(props: any) {
  const { colorScheme, isChecked } = props;
  const common = {
    _focus: {
      'z-index': 1,
    },
  };

  const toggleButtonBg = (uncheckedColor: string) =>
    isChecked ? 'green.500' : uncheckedColor;
  const toggleButtonColor = (uncheckedColor: string) =>
    isChecked ? 'white' : uncheckedColor;

  switch (colorScheme) {
    case 'sepia':
      return {
        ...common,
        bg: toggleButtonBg('rgb(246, 236, 217)'),
        color: toggleButtonColor('rgb(17, 17, 17)'),
        _hover: {
          bg: toggleButtonBg('rgb(246, 236, 217)'),
          _disabled: {
            bg: 'rgb(17, 17, 17)',
          },
        },
        _active: { bg: 'rgb(17, 17, 17)' },
      };
    case 'dark':
      return {
        ...common,
        bg: toggleButtonBg('rgb(17, 17, 17)'),
        color: 'white',
        _hover: {
          bg: toggleButtonBg('rgb(17, 17, 17)'),
          _disabled: {
            bg: 'rgb(255, 255, 255)',
          },
        },
        _active: {
          bg: `gray.300`,
        },
      };
    default:
      // default is 'light'
      return {
        ...common,
        bg: toggleButtonBg('#fff'),
        color: isChecked ? 'white' : `gray.500`,
        _active: {
          bg: `gray.300`,
        },
        _disabled: {
          bg: `gray.100`,
        },
      };
  }
}

export default ButtonStyle;
