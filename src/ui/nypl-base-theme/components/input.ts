const size = {
  lg: {
    fontSize: 'lg',
    px: 4,
    h: 12,
    borderRadius: 'none',
  },
  md: {
    fontSize: 'sm',
    px: 4,
    h: 9,
    borderRadius: 'none',
  },
  sm: {
    fontSize: 'sm',
    px: 3,
    h: 8,
    borderRadius: 'none',
  },
  xs: {
    fontSize: 'xs',
    px: 2,
    h: 6,
    borderRadius: 'none',
  },
};

const sizes = {
  lg: {
    field: size.lg,
    addon: size.lg,
  },
  md: {
    field: size.md,
    addon: size.md,
  },
  sm: {
    field: size.sm,
    addon: size.sm,
  },
  xs: {
    field: size.xs,
    addon: size.xs,
  },
};

const Input = {
  // style object for base or default style
  baseStyle: {
    field: {
      borderRadius: 'none',
      fontSize: 'sm',
      _focus: {
        borderColor: 'ui.link.primary',
        _hover: {
          borderColor: 'ui.link.primary',
        },
      },
      _placeholder: {
        fontStyle: 'italic',
        color: 'ui.gray.dark',
      },
      _invalid: {
        borderColor: 'ui.error',
        _placeholder: {
          color: 'ui.error',
        },
        _hover: {
          borderColor: 'ui.error',
        },
      },
    },
  },
  // styles for different sizes ("sm", "md", "lg")
  sizes,
  // styles for different visual variants ("outline", "solid")
  variants: {
    outline: {
      field: {
        _disabled: {
          bg: 'ui.gray.xx-light-cool',
        },
        _focus: {
          boxShadow: 'none',
          _hover: {
            borderColor: 'ui.link.primary',
          },
        },
        _invalid: {
          boxShadow: 'none',
        },
      },
    },
  },
  // default values for `size`, `variant`, `colorScheme`
  defaultProps: {
    size: 'md',
  },
};

export default Input;
