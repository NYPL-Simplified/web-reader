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
    readerState: {},
  },
  argTypes: {
    currentColorMode: {
      options: ['day', 'sepia', 'night'],
      control: { type: 'radio' },
      description: 'Select between day / sepia / night mode',
    },
    headerLeft: {
      description: '[Optional]',
    },
    navigator: {
      description: 'Navigator Object',
      type: { name: 'object', required: true },
    },
    readerState: {
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

export const HeaderBar = (args: HeaderProps): React.ReactElement => (
  <Header {...args} />
);
