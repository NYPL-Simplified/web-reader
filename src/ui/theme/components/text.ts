const TextStyle = {
  // style object for base or default style
  baseStyle: {},
  // styles for different sizes ("sm", "md", "lg")
  sizes: {},
  // styles for different visual variants ("outline", "solid")
  variants: {
    headerNav: variantHeaderNav,
  },
  // default values for `size`, `variant`, `colorScheme`
  defaultProps: {},
};

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
function variantHeaderNav() {
  return {
    my: 0,
    letterSpacing: 1,
    fontSize: 0,
    display: { sm: 'none', md: 'none', lg: 'inline-block' },
    verticalAlign: 'middle',
  } as const;
}

export default TextStyle;
