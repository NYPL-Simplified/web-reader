import { Dict } from '../types';

const sizes = {
  lg: {
    h: 12,
    minW: 12,
    fontSize: 'lg',
    px: 6,
  },
  md: {
    h: '38px',
    minW: 10,
    fontSize: 'sm',
    px: 2.5,
  },
  sm: {
    h: 8,
    minW: 8,
    fontSize: 'sm',
    px: 3,
  },
  xs: {
    h: 6,
    minW: 6,
    fontSize: 'xs',
    px: 2,
  },
};

const ButtonStyle = {
  // style object for base or default style
  baseStyle: {
    borderRadius: 'sm',
    fontWeight: 'light',
  },
  // styles for different sizes ("sm", "md", "lg")
  sizes,
  // styles for different visual variants ("outline", "solid")
  variants: {
    pill: {
      border: '1px solid',
      borderColor: 'gray.200',
      borderRadius: '2xl',
      height: 6,
      px: 6,
      fontSize: '-1',
      my: 'auto',
    },
    solid: variantSolid,
    secondary: {
      border: '1px solid',
      borderColor: 'ui.gray.light-cool',
      _hover: {
        bg: 'ui.gray.x-light-cool',
        borderColor: 'ui.gray.medium',
      },
    },
  },
  // default values for `size`, `variant`, `colorScheme`
  defaultProps: {
    size: 'md',
    variant: 'solid',
    colorScheme: 'gray',
  },
};

function solidColors(colorScheme: string) {
  switch (colorScheme) {
    case 'gray':
      return {
        bg: 'gray.100',
        _hover: {
          bg: 'gray.200',
          _disabled: {
            bg: 'gray.100',
          },
        },
        _active: { bg: 'gray.300' },
      };

    case 'red':
      return {
        bg: 'brand.nypl-red',
        color: 'white',
        hoverBg: 'red.500',
        activeBg: 'red.600',
      };

    default:
      return {
        bg: `${colorScheme}.500`,
        color: 'white',
        hoverBg: `${colorScheme}.600`,
        activeBg: `${colorScheme}.700`,
      };
  }
}

function variantSolid(props: Dict) {
  const colors = solidColors(props.colorScheme);

  return {
    ...colors,
    _hover: {
      _disabled: {
        bg: 'ui.gray.light-cool',
        color: 'ui.gray.dark',
      },
    },
    _disabled: {
      bg: 'ui.gray.light-cool',
      color: 'ui.gray.dark',
    },
  };
}

export default ButtonStyle;
