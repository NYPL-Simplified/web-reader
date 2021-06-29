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
};

export default meta;

const Template: Story<React.ComponentPropsWithRef<typeof ToggleGroup>> = (
  args
) => <ToggleGroup {...args} />;

export const Light = Template.bind({});

Light.args = {
  children: [
    <ToggleButton value="sedona" variant="setting">
      Sedona
    </ToggleButton>,
    <ToggleButton value="santa_fe" variant="setting">
      Santa Fe
    </ToggleButton>,
    <ToggleButton value="las_cruces" variant="setting">
      Las Cruces
    </ToggleButton>,
  ],
  name: 'southwest',
  defaultValue: 'sedona',
};

export const OneOption = Template.bind({});

OneOption.args = {
  children: <ToggleButton value="sedona">Sedona</ToggleButton>,
  name: 'southwest',
  defaultValue: 'Sedona',
};
