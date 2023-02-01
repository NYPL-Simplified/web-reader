import React from 'react';
import { Meta } from '@storybook/react';
import { Heading, Stack, Text } from '@chakra-ui/react';
import ToggleGroup from '../src/ui/ToggleGroup';
import ToggleButton from '../src/ui/ToggleButton';

const meta: Meta = {
  title: 'SettingsCard',
  parameters: {
    controls: { expanded: true },
  },
};

export default meta;

export const SettingsCard = (): React.ReactElement => {
  return (
    <div>
      <ToggleGroup value="publisher" label="text font options">
        <ToggleButton value="publisher" label="Default" fontSize={[-1, -1, 0]}>
          <Text>Default</Text>
        </ToggleButton>
        <ToggleButton
          value="serif"
          label="Serif"
          font="georgia"
          fontSize={[-1, -1, 0]}
          fontWeight="regular"
        >
          <Text>Serif</Text>
        </ToggleButton>
        <ToggleButton
          value="sans-serif"
          label="Sans-Serif"
          fontSize={[-1, -1, 0]}
          fontWeight="regular"
        >
          <Text>Sans-Serif</Text>
        </ToggleButton>
        <ToggleButton
          value="open-dyslexic"
          label="Dyslexia"
          font="opendyslexic"
          fontSize={[-1, -1, 0]}
          fontWeight="regular"
        >
          <Text>Dyslexia</Text>
        </ToggleButton>
        <Stack bgColor="ui.gray.light-warm" px={7} py={5}>
          <Heading
            as="h3"
            color="ui.black"
            pb="10px"
            fontSize={2}
            fontWeight="light"
          >
            "Publisher's default font"
          </Heading>
          <Text
            color="ui.black"
            fontFamily="roboto"
            fontSize={-1}
            fontWeight="light"
          >
            "Show the publisher's-specified fonts and layout choices in this
            ebook",
          </Text>
        </Stack>
      </ToggleGroup>
      <ToggleGroup value="day" label="reading theme options">
        <ToggleButton colorMode="day" value="day" _checked={{ bg: 'ui.white' }}>
          Day
        </ToggleButton>
        <ToggleButton colorMode="sepia" value="sepia">
          Sepia
        </ToggleButton>
        <ToggleButton colorMode="night" value="night">
          Night
        </ToggleButton>
      </ToggleGroup>
      <ToggleGroup value="paginated" label="pagination options">
        <ToggleButton value="paginated">Paginated</ToggleButton>
        <ToggleButton value="scrolling">Scrolling</ToggleButton>
      </ToggleGroup>
    </div>
  );
};
