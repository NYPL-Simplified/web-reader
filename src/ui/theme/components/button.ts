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

  switch (colorScheme) {
    // case 'sepia':
    //   return {
    //     bg: background,
    //     color: mode(color, `gray.800`)(props),
    //     _hover: {
    //       bg: mode(hoverBg, `${colorScheme}.300`)(props),
    //       _disabled: {
    //         bg: background,
    //       },
    //     },
    //     _active: { bg: mode(activeBg, `${colorScheme}.400`)(props) },
    //   }
    // case 'dark':
    //   return {
    //     bg: background,
    //     color: mode(color, `gray.800`)(props),
    //     _hover: {
    //       bg: mode(hoverBg, `${colorScheme}.300`)(props),
    //       _disabled: {
    //         bg: background,
    //       },
    //     },
    //     _active: { bg: mode(activeBg, `${colorScheme}.400`)(props) },
    //   }
    default:
      // default is 'light'
      return {
        bg: isChecked ? 'green.500' : '#fff',
        color: isChecked ? 'white' : `gray.500`,
        _hover: {
          bg: isChecked ? 'green.500' : `gray.200`,
          // _disabled: {
          //   bg: `gray.100`,
          // },
        },
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
