import * as React from 'react';
import { render, fireEvent } from '@testing-library/react';
import ToggleButton from '../src/ui/ToggleButton';
import ToggleGroup from '../src/ui/ToggleGroup';

const renderComponent = () => {
  return render(
    <ToggleGroup value="sedona" label="test">
      <ToggleButton value="sedona">Sedona</ToggleButton>
      <ToggleButton value="santa_fe">Santa Fe</ToggleButton>
      <ToggleButton value="las_cruces">Las Cruces</ToggleButton>
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
  const { getByLabelText } = renderComponent();

  expect(getByLabelText('Sedona')).toBeChecked();

  fireEvent.click(getByLabelText('Santa Fe'));

  expect(getByLabelText('Sedona')).toBeChecked();
});

test('onChange callback function should be called', () => {
  const onChangeHandler = jest.fn();
  const { getByLabelText } = render(
    <ToggleGroup value="sedona" onChange={onChangeHandler} label="test">
      <ToggleButton value="sedona">Sedona</ToggleButton>
      <ToggleButton value="santa_fe">Santa Fe</ToggleButton>
      <ToggleButton value="las_cruces">Las Cruces</ToggleButton>
    </ToggleGroup>
  );

  fireEvent.click(getByLabelText('Santa Fe'));

  expect(onChangeHandler).toHaveBeenCalledWith('santa_fe');
});
