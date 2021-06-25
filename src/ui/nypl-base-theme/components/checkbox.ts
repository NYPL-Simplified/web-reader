const baseStyleLabel = {
  userSelect: 'none',
  fontWeight: 'light',
  _disabled: { color: 'ui.gray.x-dark', opacity: 1 },
};

const Checkbox = {
  // style object for base or default style
  baseStyle: {
    control: {
      borderColor: 'ui.gray.dark',
      _hover: {
        bg: 'white',
        _disabled: {
          bg: 'ui.gray.x-light-cool',
        },
      },
      _checked: {
        bg: 'white',
        color: 'gray.800',
        borderColor: 'ui.gray.dark',
        _hover: {
          bg: 'white',
          borderColor: 'ui.gray.x-dark',
        },
      },
      _disabled: {
        bg: 'ui.gray.x-light-cool',
        borderColor: 'ui.gray.medium',
      },
    },
    label: baseStyleLabel,
  },
  // styles for different sizes ("sm", "md", "lg")
  sizes: {},
  // styles for different visual variants ("outline", "solid")
  variants: {},
  // default values for `size`, `variant`, `colorScheme`
  defaultProps: {
    size: 'md',
    colorScheme: 'gray',
  },
};

export default Checkbox;
