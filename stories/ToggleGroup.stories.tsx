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

const ToggleTemplate: Story<React.ComponentPropsWithRef<typeof Toggle>> = (
  args
) => <Toggle {...args} />;

const Arizona = ToggleTemplate.bind({});

Arizona.args = {
  options: ['Sedona', 'Tuscon', 'Phoenix'],
  colorScheme: 'light',
  name: 'arizona',
  defaultValue: 'Sedona',
};

const NewMexico = ToggleTemplate.bind({});

NewMexico.args = {
  options: ['Santa Fe', 'Las Cruces'],
  colorScheme: 'light',
  name: 'newmexico',
  defaultValue: 'Santa Fe',
};

export const ToggleGroup = () => {
  return (
    <div>
      <Toggle options={['Sedona', 'Tuscon', 'Las Cruces']} />
      <Toggle options={['Santa Fe', 'Las Cruces']} />
    </div>
  );
};
