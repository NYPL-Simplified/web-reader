const React = require("react")
const {ChakraProvider} = require("@chakra-ui/react")
const theme = require("../src/ui/theme")

import '@nypl/design-system-react-components/dist/styles.css'

// https://storybook.js.org/docs/react/writing-stories/parameters#global-parameters
export const parameters = {
  // https://storybook.js.org/docs/react/essentials/actions#automatically-matching-args
  actions: { argTypesRegex: '^on.*' },
};

const withChakra = (StoryFn, _context) => {
  return (
    <ChakraProvider theme={theme} >
        <StoryFn />
    </ChakraProvider>
  )
}

export const decorators = [withChakra];
