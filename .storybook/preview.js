

import React from 'react';
import { ChakraProvider } from "@chakra-ui/react"
import theme from "../src/ui/theme"

// https://storybook.js.org/docs/react/writing-stories/parameters#global-parameters
export const parameters = {
  // https://storybook.js.org/docs/react/essentials/actions#automatically-matching-args
  actions: { argTypesRegex: '^on.*' },
};

export const decorators = [
  (Story) => (
    <ChakraProvider theme={theme} resetCSS={false}>
      <Story />
    </ChakraProvider>
  ),
];