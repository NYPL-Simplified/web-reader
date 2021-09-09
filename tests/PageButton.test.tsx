import * as React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import PageButton from '../src/ui/PageButton';

test('render PageButton', () => {
  const onClickHandler = jest.fn();
  render(
    <PageButton onClick={onClickHandler} aria-label="Next Page">
      {'>'}
    </PageButton>
  );
  const pageBtn = screen.getByRole('button', { name: 'Next Page' });
  expect(pageBtn).toBeInTheDocument();

  fireEvent.click(pageBtn);

  expect(onClickHandler).toHaveBeenCalled();
});
