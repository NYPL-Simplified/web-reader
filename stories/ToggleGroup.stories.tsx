import React from 'react';
import { Meta, Story } from '@storybook/react';
import ToggleGroup from '../src/ui/ToggleGroup';
import ToggleButton from '../src/ui/ToggleButton';

const meta: Meta = {
  title: 'ToggleGroup',
  component: ToggleGroup,
  parameters: {
    controls: { expanded: true },
  },
  argTypes: {
    currentColorMode: {
      options: ['day', 'sepia', 'night'],
      control: { type: 'radio' },
    },
  },
};

export default meta;

const Template: Story<React.ComponentPropsWithRef<typeof ToggleGroup>> = (
  args
) => <ToggleGroup {...args} />;

export const Light = Template.bind({});

Light.args = {
  children: [
    <ToggleButton key="sedona" value="sedona">
      Sedona
    </ToggleButton>,
    <ToggleButton key="santa_fe" value="santa_fe">
      Santa Fe
    </ToggleButton>,
    <ToggleButton key="las_cruces" value="las_cruces">
      Las Cruces
    </ToggleButton>,
  ],
  name: 'southwest',
};

export const OneOption = Template.bind({});

OneOption.args = {
  children: <ToggleButton value="sedona">Sedona</ToggleButton>,
  name: 'southwest',
};
