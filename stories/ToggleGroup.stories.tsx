import React from 'react';
import { Meta, Story } from '@storybook/react';
import ToggleGroup from '../src/ui/ToggleGroup';

const meta: Meta = {
  title: 'ToggleGroup',
  component: ToggleGroup,
  parameters: {
    controls: { expanded: true },
  },
};

export default meta;

const Template: Story<React.ComponentPropsWithRef<typeof ToggleGroup>> = (args) => (
  <ToggleGroup {...args} />
);

export const Light = Template.bind({});

Light.args = {
  options: ['Sedona', 'Santa Fe', 'Las Cruces'],
  colorScheme: 'light',
  name: 'southwest',
  defaultValue: 'Sedona',
};
