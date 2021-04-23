import React from 'react';
import { Meta, Story } from '@storybook/react';
import Toggle from '../src/ui/Toggle';

const meta: Meta = {
  title: 'Toggle',
  component: Toggle,
  parameters: {
    controls: { expanded: true },
  },
};

export default meta;

const Template: Story<React.ComponentPropsWithRef<typeof Toggle>> = (args) => (
  <Toggle {...args} />
);

export const Light = Template.bind({});

Light.args = {
  options: ['Sedona', 'Santa Fe', 'Las Cruces'],
  colorScheme: 'light',
  name: 'southwest',
  defaultValue: 'Sedona',
};
