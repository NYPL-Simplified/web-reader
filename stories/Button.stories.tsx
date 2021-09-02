import React from 'react';
import { Meta, Story } from '@storybook/react';
import Button, { ButtonProps } from '../src/ui/Button';
import { ChakraProvider } from '@chakra-ui/react';
import { getTheme } from '../src/ui/theme';

const meta: Meta = {
  title: 'Button',
  component: Button,
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

const Template: Story<ButtonProps> = (args) => (
  <ChakraProvider theme={getTheme(args.colormode ?? 'day')}>
    <Button {...args} />
  </ChakraProvider>
);

// By passing using the Args format for exported stories, you can control the props for a component for reuse in a test
// https://storybook.js.org/docs/react/workflows/unit-testing
export const Light = Template.bind({});

Light.args = {
  children: 'Hello world',
  colormode: 'light',
};

export const LightDisabled = Template.bind({});

LightDisabled.args = {
  ...Light.args,
  isDisabled: true,
};

export const Dark = Template.bind({});

Dark.args = {
  children: 'Hello world',
  colormode: 'dark',
};

export const DarkDisabled = Template.bind({});

DarkDisabled.args = {
  ...Dark.args,
  isDisabled: true,
};

export const Sepia = Template.bind({});

Sepia.args = {
  children: 'Hello world',
  colormode: 'sepia',
};

export const SepiaDisable = Template.bind({});

SepiaDisable.args = {
  ...Sepia.args,
  isDisabled: true,
};
