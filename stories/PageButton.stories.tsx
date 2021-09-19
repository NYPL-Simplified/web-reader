import React from 'react';
import { Meta, Story } from '@storybook/react';
import PageButton, { PageButtonProps } from '../src/ui/PageButton';
import {
  Icon,
  IconNames,
  IconRotationTypes,
} from '@nypl/design-system-react-components';

const meta: Meta = {
  title: 'PageButton',
  component: PageButton,
  argTypes: {
    children: {
      description: 'String | HTML Element',
      control: false,
    },
  },
};

export default meta;

const Template: Story<PageButtonProps> = (args) => <PageButton {...args} />;

export const PreviousButton = Template.bind({});

PreviousButton.args = {
  children: (
    <Icon
      decorative
      name={IconNames.arrow}
      modifiers={['small']}
      iconRotation={IconRotationTypes.rotate90}
    />
  ),
  pr: 2,
};

export const NextButton = Template.bind({});
NextButton.args = {
  children: (
    <Icon
      decorative
      name={IconNames.arrow}
      modifiers={['small']}
      iconRotation={IconRotationTypes.rotate270}
    />
  ),
  pl: 2,
};
