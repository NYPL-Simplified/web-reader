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
  },
  // default values for `size`, `variant`, `colorScheme`
  defaultProps: {
    size: 'md',
    variant: 'solid',
    colorScheme: 'light',
  },
};

const sepia = 'rgb(246, 236, 217)';
const lightGreen = '#468028';
const lightGrey = '#DADADA';
const defaultBlack = '#383535';
const activeBlack = '#111';

const commonToggleButtonStyle = {
  color: activeBlack,
  px: '8',
  border: '0.0625rem solid',
  borderColor: lightGrey,
  transition: 'none',
  fontSize: '-2',
  fontWeight: 'medium',
  letterSpacing: '0.07rem',
  textTransform: 'uppercase',
  maxWidth: '100%',
  cursor: 'pointer',
  _focus: {
    boxShadow: 'none',
  },
  _active: {
    bg: 'none',
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
        bg: sepia,
        color: defaultBlack,
        _focus: {
          bg: sepia,
          color: activeBlack,
          boxShadow: 'none',
        },
        _active: {
          bg: sepia,
          color: activeBlack,
        },
        _hover: {
          bg: sepia,
          _disabled: {
            bg: activeBlack,
          },
        },
        _checked: {
          bg: sepia,
          color: activeBlack,
        },
      };
    case 'dark':
      return {
        ...commonToggleButtonStyle,
        bg: activeBlack,
        color: 'ui.white',
        _focus: {
          bg: activeBlack,
          color: 'white',
          boxShadow: 'none',
        },
        _active: {
          bg: activeBlack,
          color: 'ui.white',
          boxShadow: 'none',
        },
        _hover: {
          bg: activeBlack,
          _disabled: {
            bg: 'ui.white',
          },
        },
        _checked: {
          bg: activeBlack,
          color: 'ui.white',
        },
      };
    default:
      // default is 'light'
      return {
        ...commonToggleButtonStyle,
        bg: 'ui.white',
        color: defaultBlack,
        _disabled: {
          bg: `gray.100`,
        },
        _checked: {
          bg: `ui.white`,
          color: activeBlack,
        },
      };
  }
}

function variantToggle(props: any) {
  return {
    ...variantSolid(props),
    _checked: {
      color: 'ui.white',
      bg: lightGreen,
    },
  };
}

export default ButtonStyle;
