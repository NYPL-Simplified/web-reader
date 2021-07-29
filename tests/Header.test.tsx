import * as React from 'react';
import { render, screen } from '@testing-library/react';
import Header from '../src/ui/Header';
import { Navigator, ReaderState } from '../src/types';

test('render header bar', () => {
  const readerState = {} as ReaderState;
  const navigator = {} as Navigator;

  render(<Header readerState={readerState} navigator={navigator} />);

  expect(
    screen.getByRole('link', { name: 'Return to NYPL' })
  ).toBeInTheDocument();

  expect(screen.getByRole('link', { name: 'Return to NYPL' })).toHaveAttribute(
    'href',
    'https://www.nypl.org'
  );

  expect(screen.getByRole('button', { name: 'Settings' })).toBeInTheDocument();

  expect(
    screen.getByRole('button', { name: 'Toggle Fullscreen' })
  ).toBeInTheDocument();
});

test('render custom left header', () => {
  const readerState = {} as ReaderState;
  const navigator = {} as Navigator;
  const IconComponent = () => (
    <span data-testid="custom-icon">
      <svg viewBox="0 0 18 19" xmlns="http://www.w3.org/2000/svg">
        <path d="M9 0C4.03 0 0 4.03 0 9V16C0 17.66 1.34 19 3 19H6V11H2V9C2 5.13 5.13 2 9 2C12.87 2 16 5.13 16 9V11H12V19H15C16.66 19 18 17.66 18 16V9C18 4.03 13.97 0 9 0Z" />
      </svg>
    </span>
  );

  const HeaderLeft = () => {
    return (
      <div className="headerLeft">
        <IconComponent />
        My Custom Header Text
      </div>
    );
  };

  render(
    <Header
      headerLeft={<HeaderLeft />}
      readerState={readerState}
      navigator={navigator}
    />
  );

  expect(screen.getByText('My Custom Header Text')).toBeInTheDocument();
  expect(screen.getByTestId('custom-icon')).toBeInTheDocument();
});
