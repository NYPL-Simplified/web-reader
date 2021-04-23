import React from 'react';
import { Meta, Story } from '@storybook/react';
import Toggle from '../src/ui/Toggle';

const meta: Meta = {
  title: 'ToggleGroup',
  parameters: {
    controls: { expanded: true },
  },
};

export default meta;

export const ToggleGroup = () => {
  return (
    <div>
      <Toggle
        options={['Publisher', 'Serif', 'Sans-Serif', 'Dyslexia-Friendly']}
        defaultValue="Publisher"
      />
      <Toggle options={['Day', 'Sepia', 'Night']} defaultValue="Day" />
      <Toggle options={['Paginated', 'Scrolling']} defaultValue="Paginated" />
    </div>
  );
};
