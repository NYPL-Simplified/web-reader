import React from 'react';
import { Meta, Story } from '@storybook/react';
import ToggleGroup from '../src/ui/ToggleGroup';

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
      <ToggleGroup
        options={['Publisher', 'Serif', 'Sans-Serif', 'Dyslexia-Friendly']}
        defaultValue="Publisher"
      />
      <ToggleGroup
        options={[
          {
            value: 'Day',
            colorScheme: 'light',
          },
          {
            value: 'Sepia',
            colorScheme: 'sepia',
          },
          {
            value: 'Night',
            colorScheme: 'dark',
          },
        ]}
        defaultValue="Day"
      />
      <ToggleGroup options={['Paginated', 'Scrolling']} defaultValue="Paginated" />
    </div>
  );
};
