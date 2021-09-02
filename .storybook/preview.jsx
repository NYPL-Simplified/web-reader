const React = require('react');
const { ChakraProvider } = require('@chakra-ui/react');
import { getTheme } from '../src/ui/theme';
import { useTheme } from '@chakra-ui/react';
import '@nypl/design-system-react-components/dist/styles.css';

// https://storybook.js.org/docs/react/writing-stories/parameters#global-parameters
export const parameters = {
  // https://storybook.js.org/docs/react/essentials/actions#automatically-matching-args
  actions: { argTypesRegex: '^on.*' },
};

const withChakra = (StoryFn, _context) => {
  const { args } = _context;
  return (
    <ChakraProvider theme={getTheme(args.colorMode ?? 'day')}>
      <StoryFn />
    </ChakraProvider>
  );
};

export const decorators = [withChakra];
