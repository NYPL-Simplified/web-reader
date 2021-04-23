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
    _hover: {
      bg: isChecked ? 'green.500' : 'gray.200',
    },
  };

  switch (colorScheme) {
    case 'sepia':
      return {
        ...common,
        bg: 'rgb(246, 236, 217)',
        color: 'rgb(17, 17, 17)',
        _hover: {
          bg: 'rgb(246, 236, 217)',
          _disabled: {
            bg: 'rgb(17, 17, 17)',
          },
        },
        _active: { bg: 'rgb(17, 17, 17)' },
      };
    case 'dark':
      return {
        ...common,
        bg: 'rgb(17, 17, 17)',
        color: 'rgb(255, 255, 255)',
        _hover: {
          bg: 'rgb(17, 17, 17)',
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
        bg: isChecked ? 'green.500' : '#fff',
        color: isChecked ? 'white' : `gray.500`,
        _active: {
          bg: `gray.300`,
        },
        _disabled: {
          bg: `gray.100`,
        },
        _focus: {
          'z-index': 1,
        },
      };
  }
}

export default ButtonStyle;
