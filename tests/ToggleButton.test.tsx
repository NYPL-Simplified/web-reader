import * as React from 'react';
import { render, screen } from '@testing-library/react';
import ToggleButton from '../src/ui/ToggleButton';

describe('ToggleButton', () => {
  test('Button does not show checkmark if isChecked=false', () => {
    render(<ToggleButton label="hello">hello</ToggleButton>);
    expect(screen.getByRole('radio', { name: 'hello' })).not.toBeChecked();
  });
});
