import Input from './input';

const sizes = {
  xs: Input.sizes.xs.field,
  sm: Input.sizes.sm.field,
  md: Input.sizes.md.field,
  lg: Input.sizes.lg.field,
};

export default {
  baseStyle: {
    _disabled: {
      bg: 'ui.gray.x-light-cool',
    },
  },
  sizes,
};
