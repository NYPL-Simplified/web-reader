import * as React from 'react';
import { render, screen } from '@testing-library/react';
import Button from '../src/ui/Button';

test('button with hello text should render', () => {
  render(<Button>hello</Button>);
  expect(screen.getByRole('button', { name: 'hello' })).toBeInTheDocument();
});
