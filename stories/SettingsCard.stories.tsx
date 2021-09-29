import React from 'react';
import { Meta } from '@storybook/react';
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
        <ToggleButton value="publisher">Publisher</ToggleButton>
        <ToggleButton value="serif">Serif</ToggleButton>
        <ToggleButton value="sans-serif">Sans-Serif</ToggleButton>
        <ToggleButton value="dyslexia-friendly">Dyslexia-Friendly</ToggleButton>
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
