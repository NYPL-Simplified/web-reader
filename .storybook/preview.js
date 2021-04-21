

import React from 'react';
import { ChakraProvider, extendTheme } from "@chakra-ui/react"
import theme from "../src/ui/theme"

// https://storybook.js.org/docs/react/writing-stories/parameters#global-parameters
export const parameters = {
  // https://storybook.js.org/docs/react/essentials/actions#automatically-matching-args
  actions: { argTypesRegex: '^on.*' },
};

const withChakra = (StoryFn: Function, context: StoryContext) => {
  return (
    <ChakraProvider >
        <StoryFn />
    </ChakraProvider>
  )
}

export const decorators = [withChakra];