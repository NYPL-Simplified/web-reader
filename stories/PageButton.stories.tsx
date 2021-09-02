import React from 'react';
import { Meta, Story } from '@storybook/react';
import PageButton, { PageButtonProps } from '../src/ui/PageButton';

const meta: Meta = {
  title: 'PageButton',
  component: PageButton,
  argTypes: {
    children: {
      control: {
        type: 'text',
      },
    },
    colorMode: {
      options: ['day', 'sepia', 'night'],
      control: { type: 'radio' },
      defaultValue: 'day',
      description: 'Select between day / sepia / night mode',
    },
  },
};

export default meta;

const Template: Story<PageButtonProps> = (args) => <PageButton {...args} />;

// By passing using the Args format for exported stories, you can control the props for a component for reuse in a test
// https://storybook.js.org/docs/react/workflows/unit-testing
export const PreviousButton = Template.bind({});

PreviousButton.args = {
  children: '<',
};
