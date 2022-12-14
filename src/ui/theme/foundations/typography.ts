import { Dict } from '../types';

type Fonts = {
  fonts: Dict;
};

const typography: Fonts = {
  fonts: {
    body: 'Roboto, -apple-system, BlinkMacSystemFont, system-ui, sans-serif',
    heading: 'Roboto, -apple-system, BlinkMacSystemFont, system-ui, sans-serif',
    serif: `'Georgia', serif`,
    sansSerif: `'Helvetica', 'Arial', serif`,
    opendyslexic: `'OpenDyslexic', sans-serif`,
  },
};

export default typography;
