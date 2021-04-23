import React from 'react';
import { Meta, Story } from '@storybook/react';
import ToggleButton from '../src/ui/ToggleButton';

const meta: Meta = {
  title: 'ToggleButton',
  component: ToggleButton,
  argTypes: {
    children: {
      control: {
        type: 'text',
      },
    },
  },
  parameters: {
    controls: { expanded: true },
  },
};

export default meta;

const Template: Story<React.ComponentPropsWithRef<typeof ToggleButton>> = (
  args
) => <ToggleButton {...args} />;

export const Light = Template.bind({});

Light.args = {
  children: 'Hello world',
  colorScheme: 'light',
  isChecked: false,
};

export const LightChecked = Template.bind({});

LightChecked.args = {
  ...Light.args,
  isChecked: true,
};
//
// export const DarkSelected = Template.bind({});
//
// DarkSelected.args = {
//   ...Dark.args,
//   isSelected: true,
// };
//
// export const SepiaSelected = Template.bind({});
//
// SepiaSelected.args = {
//   ...Sepia.args,
//   isSelected: true,
// };
