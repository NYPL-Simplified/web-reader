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
  const { colorScheme } = props;
  const common = {
    _focus: {
      'z-index': 1,
    },
    _active: {
      bg: `green.300`,
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
      };
    case 'dark':
      return {
        ...common,
        bg: 'rgb(17, 17, 17)',
        color: 'white',
        _hover: {
          bg: 'rgb(17, 17, 17)',
          _disabled: {
            bg: 'rgb(255, 255, 255)',
          },
        },
      };
    default:
      // default is 'light'
      return {
        ...common,
        bg: '#fff',
        color: `gray.500`,
        _disabled: {
          bg: `gray.100`,
        },
      };
  }
}

export default ButtonStyle;
