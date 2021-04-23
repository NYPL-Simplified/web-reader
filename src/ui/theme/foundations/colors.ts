import { Colors } from '@chakra-ui/react';

const colors: Colors = {
  transparent: 'transparent',

  // ui fills
  ui: {
    black: '#000',
    white: '#fff',
    focus: '#4181F1',
    link: {
      primary: '#0576D3',
      secondary: '#004B98',
    },
    success: {
      primary: '#077719',
      secondary: '#095212',
    },
    warning: {
      primary: '#F0974E',
      secondary: '#EC7B1F',
    },
    status: {
      primary: '#F9E08E',
      secondary: '#FBE7E1',
    },
    error: '#97272C',
    disabled: {
      primary: '#E0E0E0',
      secondary: '#FAFAFA',
    },
    test: '#FF6347',
    gray: {
      'x-dark': '#424242',
      dark: '#616161',
      medium: '#BDBDBD',
      'light-cool': '#E0E0E0',
      'light-warm': '#EFEDEB',
      'x-light-cool': '#F5F5F5',
      'x-light-warm': '#F8F8F7',
      'xx-light-cool': '#FAFAFA',
    },
  },

  // brand fills. Only primary and secondary filled in for now.
  brand: {
    primary: '#C60917',
    secondary: '#760000',
  },

  /**
   * The following color scales are useful for color edge cases
   * where a distinct named ui or brand color doesn't quite work.
   */
  // based on ui/gray/medium
  gray: {
    '50': '#F2F2F2',
    '100': '#DBDBDB',
    '200': '#C4C4C4',
    '300': '#ADADAD',
    '400': '#969696',
    '500': '#808080',
    '600': '#666666',
    '700': '#4D4D4D',
    '800': '#333333',
    '900': '#1A1A1A',
  },
  // based on ui/error
  red: {
    '50': '#FAEBEB',
    '100': '#F0C6C8',
    '200': '#E7A2A5',
    '300': '#DE7D82',
    '400': '#D4595E',
    '500': '#CB343B',
    '600': '#A22A2F',
    '700': '#7A1F23',
    '800': '#511518',
    '900': '#290A0C',
  },
  // based on ui/warning/secondary
  orange: {
    '50': '#FDF1E7',
    '100': '#F9D8BD',
    '200': '#F6BF93',
    '300': '#F2A669',
    '400': '#EF8D3E',
    '500': '#EB7414',
    '600': '#BC5D10',
    '700': '#8D460C',
    '800': '#5E2F08',
    '900': '#2F1704',
  },
  // based on ui/status/primary
  yellow: {
    '50': '#FEF8E7',
    '100': '#FBECBB',
    '200': '#F9E090',
    '300': '#F7D464',
    '400': '#F4C938',
    '500': '#F2BD0D',
    '600': '#C2970A',
    '700': '#917108',
    '800': '#614B05',
    '900': '#302603',
  },
  // based on ui/success/primary
  green: {
    '50': '#E7FEEB',
    '100': '#BCFBC6',
    '200': '#90F8A1',
    '300': '#65F67C',
    '400': '#3AF357',
    '500': '#0EF133',
    '600': '#0BC128',
    '700': '#08911E',
    '800': '#066014',
    '900': '#03300A',
  },
  // based on ui/link/primary
  blue: {
    '50': '#E6F3FE',
    '100': '#B9DFFD',
    '200': '#8CCAFC',
    '300': '#60B5FB',
    '400': '#33A0FA',
    '500': '#068BF9',
    '600': '#056FC7',
    '700': '#045495',
    '800': '#023864',
    '900': '#011C32',
  },
};

export default colors;
