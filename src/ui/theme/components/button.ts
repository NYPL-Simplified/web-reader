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
    toggle: variantToggle,
    headerNav: variantHeaderNav,
  },
  // default values for `size`, `variant`, `colorScheme`
  defaultProps: {
    size: 'sm',
    variant: 'solid',
    colorScheme: 'light',
  },
};

const commonToggleButtonStyle = {
  color: 'ui.black',
  px: 8,
  border: '1px solid',
  borderColor: 'gray.100',
  transition: 'none',
  fontSize: '-2',
  fontWeight: 'medium',
  letterSpacing: '0.07rem',
  textTransform: 'uppercase',
  maxWidth: '100%',
  cursor: 'pointer',
  _active: {
    bg: 'ui.white',
  },
  _hover: {
    bg: 'ui.white',
    _disabled: {
      bg: 'ui.white',
    },
  },
  _disabled: {
    bg: 'ui.white',
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

  switch (colorScheme) {
    case 'sepia':
      return {
        ...commonToggleButtonStyle,
        bg: 'ui.sepia',
        color: 'gray.800',
        _focus: {
          bg: 'ui.sepia',
          color: 'ui.black',
        },
        _active: {
          bg: 'ui.sepia',
          color: 'ui.black',
        },
        _hover: {
          bg: 'ui.sepia',
          _disabled: {
            bg: 'ui.sepia',
          },
        },
        _checked: {
          bg: 'ui.sepia',
          color: 'ui.black',
        },
        _disabled: {
          bg: 'ui.sepia',
        },
      };
    case 'dark':
      return {
        ...commonToggleButtonStyle,
        bg: 'ui.black',
        color: 'ui.white',
        _focus: {
          bg: 'ui.black',
          color: 'white',
        },
        _active: {
          bg: 'ui.black',
          color: 'ui.white',
        },
        _hover: {
          bg: 'ui.black',
          _disabled: {
            bg: 'ui.black',
            color: 'ui.white',
          },
        },
        _checked: {
          bg: 'ui.black',
          color: 'ui.white',
        },
        _disabled: {
          bg: 'ui.black',
          color: 'ui.white',
        },
      };
    default:
      // default is 'light'
      return {
        ...commonToggleButtonStyle,
        bg: 'ui.white',
        color: 'gray.800',
        _hover: {
          bg: 'ui.white',
          _disabled: {
            bg: 'ui.white',
          },
        },
        _checked: {
          bg: `ui.white`,
          color: 'ui.black',
        },
        _disabled: {
          bg: 'ui.white',
        },
      };
  }
}

function variantToggle(props: any) {
  return {
    ...variantSolid(props),
    _checked: {
      color: 'ui.white',
      bg: 'green.700',
    },
  };
}

function variantHeaderNav() {
  return {
    py: 1,
    border: 'none',
    background: 'transparent',
    textTransform: 'uppercase',
    fontSize: 0,
    color: 'gray.700',
  };
}

export default ButtonStyle;
