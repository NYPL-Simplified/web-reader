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
        <ToggleButton value="publisher">Publisher</ToggleButton>
        <ToggleButton value="serif">Serif</ToggleButton>
        <ToggleButton value="sans-serif">Sans-Serif</ToggleButton>
        <ToggleButton value="dyslexia-friendly">Dyslexia-Friendly</ToggleButton>
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
        <ToggleButton value="paginated">Paginated</ToggleButton>
        <ToggleButton value="scrolling">Scrolling</ToggleButton>
      </ToggleGroup>
    </div>
  );
};
