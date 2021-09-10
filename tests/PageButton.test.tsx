import * as React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import PageButton from '../src/ui/PageButton';

const MockIconComponent = ({
  testid,
}: {
  testid: string;
}): React.ReactElement => (
  <span data-testid={testid}>
    <svg viewBox="0 0 18 19" xmlns="http://www.w3.org/2000/svg">
      <path d="M9 0C4.03 0 0 4.03 0 9V16C0 17.66 1.34 19 3 19H6V11H2V9C2 5.13 5.13 2 9 2C12.87 2 16 5.13 16 9V11H12V19H15C16.66 19 18 17.66 18 16V9C18 4.03 13.97 0 9 0Z" />
    </svg>
  </span>
);

test('render PageButton', () => {
  const previousHandler = jest.fn();
  const nextHandler = jest.fn();
  render(
    <>
      <PageButton onClick={previousHandler} aria-label="Previous Page">
        <MockIconComponent testid="previous" />
      </PageButton>
      <PageButton onClick={nextHandler} aria-label="Next Page">
        <MockIconComponent testid="next" />
      </PageButton>
    </>
  );

  const previousBtn = screen.getByRole('button', { name: 'Previous Page' });
  const nextBtn = screen.getByRole('button', { name: 'Next Page' });

  expect(previousBtn).toBeInTheDocument();
  expect(nextBtn).toBeInTheDocument();

  expect(screen.getByTestId('previous')).toBeInTheDocument();
  expect(screen.getByTestId('next')).toBeInTheDocument();

  fireEvent.click(previousBtn);
  expect(previousHandler).toHaveBeenCalled();

  fireEvent.click(nextBtn);
  expect(nextHandler).toHaveBeenCalled();
});
