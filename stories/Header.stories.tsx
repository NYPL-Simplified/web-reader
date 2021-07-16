import React from 'react';
import { Meta } from '@storybook/react';
import Header, { HeaderProps } from '../src/ui/Header';

const meta: Meta = {
  title: 'Header',
  parameters: {
    controls: { expanded: true },
  },
  args: {
    navigator: {},
    currentState: {},
    manifest: {},
  },
  argTypes: {
    logo: {
      description: 'Your Logo [Optional]',
    },
    navigator: {
      description: 'Navigator Object',
      type: { name: 'object', required: true },
    },
    currentState: {
      description: 'ReaderState Object',
      type: { name: 'object', required: true },
    },
    manifest: {
      description: 'WebpubManifest Object',
      type: { name: 'object', required: true },
    },
  },
};

export default meta;

export const HeaderBar = (args: HeaderProps) => <Header {...args} />;
