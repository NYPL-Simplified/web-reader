import * as React from 'react';
import { render, fireEvent } from '@testing-library/react';
import ToggleButton from '../src/ui/ToggleButton';
import ToggleGroup from '../src/ui/ToggleGroup';

const renderComponent = () => {
  return render(
    <ToggleGroup value="sedona" label="test">
      <ToggleButton value="sedona" label="Sedona">
        Sedona
      </ToggleButton>
      <ToggleButton value="santa_fe" label="Santa Fe">
        Santa Fe
      </ToggleButton>
      <ToggleButton value="las_cruces" label="Las Cruces">
        Las Cruces
      </ToggleButton>
    </ToggleGroup>
  );
};

test('radiogroup should be in the document', () => {
  const { getByRole } = renderComponent();
  expect(getByRole('radiogroup', { name: 'test' })).toBeInTheDocument();
});

test('toggle group should contain all radio buttons', () => {
  const { queryAllByRole } = renderComponent();
  expect(queryAllByRole('radio')).toHaveLength(3);
});

test('respect value props', () => {
  const { getByRole } = renderComponent();

  expect(getByRole('radio', { name: /sedona/i })).toBeChecked();

  fireEvent.click(getByRole('radio', { name: /santa Fe/i }));

  expect(getByRole('radio', { name: /sedona/i })).toBeChecked();
});

test('onChange callback function should be called', () => {
  const onChangeHandler = jest.fn();
  const { getByRole } = render(
    <ToggleGroup value="sedona" onChange={onChangeHandler} label="test">
      <ToggleButton value="sedona" label="Sedona">
        Sedona
      </ToggleButton>
      <ToggleButton value="santa_fe" label="Santa Fe">
        Santa Fe
      </ToggleButton>
      <ToggleButton value="las_cruces" label="Las Cruces">
        Las Cruces
      </ToggleButton>
    </ToggleGroup>
  );

  fireEvent.click(getByRole('radio', { name: /santa fe/i }));

  expect(onChangeHandler).toHaveBeenCalledWith('santa_fe');
});
