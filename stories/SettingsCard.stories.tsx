import React from 'react';
import { Meta, Story } from '@storybook/react';
import ToggleGroup from '../src/ui/ToggleGroup';
import ToggleButton from '../src/ui/ToggleButton';

const meta: Meta = {
  title: 'SettingsCard',
  parameters: {
    controls: { expanded: true },
  },
};

export default meta;

export const SettingsCard = () => {
  return (
    <div>
      <ToggleGroup value="publisher" label="text font options">
        <ToggleButton value="publisher">Publisher</ToggleButton>
        <ToggleButton value="serif">Serif</ToggleButton>
        <ToggleButton value="sans-serif">Sans-Serif</ToggleButton>
        <ToggleButton value="dyslexia-friendly">Dyslexia-Friendly</ToggleButton>
      </ToggleGroup>
      <ToggleGroup value="day" label="reading theme options">
        <ToggleButton colorScheme="light" value="day" variant="solid">
          Day
        </ToggleButton>
        <ToggleButton colorScheme="sepia" value="sepia" variant="solid">
          Sepia
        </ToggleButton>
        <ToggleButton colorScheme="dark" value="night" variant="solid">
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
