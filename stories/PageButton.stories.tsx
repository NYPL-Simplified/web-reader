import React from 'react';
import { Meta, Story } from '@storybook/react';
import PageButton, { PageButtonProps } from '../src/ui/PageButton';
import { MdKeyboardArrowLeft, MdKeyboardArrowRight } from 'react-icons/md';
import { Icon } from '@chakra-ui/react';
const meta: Meta = {
  title: 'PageButton',
  component: PageButton,
  argTypes: {
    children: {
      description: 'String | HTML Element',
      control: false,
    },
    currentColorMode: {
      options: ['day', 'sepia', 'night'],
      control: { type: 'radio' },
      description: 'Select between day / sepia / night mode',
    },
  },
};

export default meta;

const Template: Story<PageButtonProps> = (args) => <PageButton {...args} />;

export const PreviousButton = Template.bind({});

PreviousButton.args = {
  children: <Icon as={MdKeyboardArrowLeft} w={6} h={6} />,
};

export const NextButton = Template.bind({});
NextButton.args = {
  children: <Icon as={MdKeyboardArrowRight} w={6} h={6} />,
};
