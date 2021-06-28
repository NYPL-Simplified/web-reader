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
      <ToggleGroup defaultValue="publisher">
        <ToggleButton value="publisher" variant="setting">
          Publisher
        </ToggleButton>
        <ToggleButton value="serif" variant="setting">
          Serif
        </ToggleButton>
        <ToggleButton value="sans-serif" variant="setting">
          Sans-Serif
        </ToggleButton>
        <ToggleButton value="dyslexia-friendly" variant="setting">
          Dyslexia-Friendly
        </ToggleButton>
      </ToggleGroup>
      <ToggleGroup defaultValue="day">
        <ToggleButton colorScheme="light" value="day">
          Day
        </ToggleButton>
        <ToggleButton colorScheme="sepia" value="sepia">
          Sepia
        </ToggleButton>
        <ToggleButton colorScheme="dark" value="night">
          Night
        </ToggleButton>
      </ToggleGroup>
      <ToggleGroup defaultValue="paginated">
        <ToggleButton value="paginated" variant="setting">
          Paginated
        </ToggleButton>
        <ToggleButton value="scrolling" variant="setting">
          Scrolling
        </ToggleButton>
      </ToggleGroup>
    </div>
  );
};
