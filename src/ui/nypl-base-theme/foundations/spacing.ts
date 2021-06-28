/**
 * A comprehensive spacin scale based on NYPL Design System,
 * with intermediate values interpolated. Those marked with comments
 * are directly from the NYPL DS.
 *
 * 1 spacing unit is 4px or 0.25rem.
 *
 * Mental model: If you need a spacing of 40px, divide it by 4.
 * That'll give you 10. Then use it in your component.
 */
const spacing = {
  space: {
    px: '1px',
    0: '0',
    0.5: '0.125rem',
    // 4px
    1: '0.25rem',
    1.5: '0.375rem',
    // 8px
    2: '0.5rem',
    2.5: '0.625rem',
    3: '0.75rem',
    3.5: '0.875rem',
    // 16px
    4: '1rem',
    5: '1.25rem',
    // 24px
    6: '1.5rem',
    7: '1.75rem',
    // 32 px
    8: '2rem',
    9: '2.25rem',
    10: '2.5rem',
    // 48px
    12: '3rem',
    14: '3.5rem',
    // 64px
    16: '4rem',
    20: '5rem',
    // 96px
    24: '6rem',
    28: '7rem',
    32: '8rem',
    36: '9rem',
    40: '10rem',
    44: '11rem',
    48: '12rem',
    52: '13rem',
    56: '14rem',
    60: '15rem',
    64: '16rem',
    72: '18rem',
    80: '20rem',
    96: '24rem',
  },
};

export default spacing;
