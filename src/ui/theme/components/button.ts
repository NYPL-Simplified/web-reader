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
    setting: variantSetting,
  },
  // default values for `size`, `variant`, `colorScheme`
  defaultProps: {
    size: 'md',
    variant: 'solid',
    colorScheme: 'light',
  },
};

const commonSettingButtonStyle = {
  color: 'black',
  px: '8',
  border: '1px solid',
  borderColor: 'gray.100',
  transition: 'none',
  maxWidth: '100%',
  _focus: {
    'z-index': 1,
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
        ...commonSettingButtonStyle,
        bg: 'rgb(246, 236, 217)',
        color: 'rgb(17, 17, 17)',
        _focus: {
          bg: 'rgb(246, 236, 217)',
          color: 'rgb(17, 17, 17)',
          boxShadow: 'none',
        },
        _active: {
          bg: 'rgb(246, 236, 217)',
          color: 'rgb(17, 17, 17)',
        },
        _hover: {
          bg: 'rgb(246, 236, 217)',
          _disabled: {
            bg: 'rgb(17, 17, 17)',
          },
        },
        _checked: {
          bg: 'rgb(246, 236, 217)',
          color: 'rgb(17, 17, 17)',
        },
      };
    case 'dark':
      return {
        ...common,
        ...commonSettingButtonStyle,
        bg: 'rgb(17, 17, 17)',
        color: 'white',
        _focus: {
          bg: 'rgb(17, 17, 17)',
          color: 'white',
          boxShadow: 'none',
        },
        _active: {
          bg: 'rgb(17, 17, 17)',
          color: 'white',
          boxShadow: 'none',
        },
        _hover: {
          bg: 'rgb(17, 17, 17)',
          _disabled: {
            bg: 'rgb(255, 255, 255)',
          },
        },
        _checked: {
          bg: 'rgb(17, 17, 17)',
          color: 'white',
        },
      };
    default:
      // default is 'light'
      return {
        ...common,
        ...commonSettingButtonStyle,
        bg: '#fff',
        color: `gray.500`,
        _disabled: {
          bg: `gray.100`,
        },
        _checked: {
          bg: `#fff`,
          color: `gray.500`,
        },
      };
  }
}

function variantSetting(props: any) {
  return {
    ...variantSolid(props),
    _checked: {
      color: 'white',
      bg: '#468028',
    },
  };
}

export default ButtonStyle;
