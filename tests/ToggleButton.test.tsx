import * as React from 'react';
import { render, screen } from '@testing-library/react';
import ToggleButton from '../src/ui/ToggleButton';

describe('ToggleButton', () => {
  test('Button does not show checkmark if isChecked=false', () => {
    render(<ToggleButton>hello</ToggleButton>);
    expect(screen.getByLabelText('hello')).not.toBeChecked();
  });
  //   test('Button shows checkmark if is isChecked=true', () => {});
});
