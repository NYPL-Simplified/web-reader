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
    colorScheme: {
      control: {
        type: 'select',
        options: ['light', 'sepia', 'dark'],
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

export const Default = Template.bind({});

Default.args = {
  children: 'Hello world',
  isChecked: false,
};

export const Checked = Template.bind({});

Checked.args = {
  ...Default.args,
  isChecked: true,
};

export const CheckedSettingButton = Template.bind({});

CheckedSettingButton.args = {
  ...Default.args,
  variant: 'toggle',
  isChecked: true,
};
