import * as React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import TableOfContent from '../src/ui/TableOfContent';
import {
  MockNavigator,
  MockWebpubManifest,
  MockReaderState,
} from './utils/MockData';

beforeEach(() => {
  render(
    <TableOfContent
      readerState={MockReaderState}
      navigator={MockNavigator}
      manifest={MockWebpubManifest}
    />
  );
});

test('render Table Of Content', () => {
  // We need to open the TOC element for TOC links to show up
  const toggleBtn = screen.getByRole('button', { name: 'Table of Contents' });
  fireEvent.click(toggleBtn);

  const tocLinkElm = screen.getByRole('link', { name: 'Chapter 1' });
  expect(tocLinkElm).toBeInTheDocument();
});

test('navigation should be called with the correct url', () => {
  const toggleBtn = screen.getByRole('button', { name: 'Table of Contents' });
  fireEvent.click(toggleBtn);

  const tocLinkElm = screen.getByRole('link', { name: 'Chapter 1' });
  fireEvent.click(tocLinkElm);
  expect(MockNavigator.goToPage).toHaveBeenCalledWith('chapter/one/url');
});
