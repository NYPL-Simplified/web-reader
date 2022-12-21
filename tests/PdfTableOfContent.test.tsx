import * as React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import PdfTableOfContent from '../src/ui/toc/PdfTableOfContent';
import { MockNavigator, MockSinglePdfTocItems } from './utils/MockData';

import { axe } from 'jest-axe';

const TestTOC: React.FC<
  Omit<React.ComponentProps<typeof PdfTableOfContent>, 'containerRef'>
> = (props) => {
  const ref = React.useRef();
  return (
    <div ref={ref}>
      <PdfTableOfContent containerRef={ref} {...props} />
    </div>
  );
};

describe('Table of Content Accessibility checker', () => {
  test('TOC should have no violation', async () => {
    const { container } = render(
      <TestTOC navigator={MockNavigator} tocItems={MockSinglePdfTocItems} />
    );

    expect(await axe(container)).toHaveNoViolations();
  });
});

describe('Empty Table of Content', () => {
  test('Empty TOC should show the missing toc message to users', () => {
    const MissingTocItems = [];
    render(<TestTOC navigator={MockNavigator} tocItems={MissingTocItems} />);

    expect(
      screen.queryByText(/This publication does not have a Table of Contents/)
    ).toBeInTheDocument();
  });
});

describe('Table Of Content rendering', () => {
  beforeEach(() => {
    render(
      <TestTOC navigator={MockNavigator} tocItems={MockSinglePdfTocItems} />
    );
  });

  test('render Table Of Content', async () => {
    // The initial TOC component render should not show TOC popover on the screen.
    expect(screen.queryByText('Chapter 1')).not.toBeVisible();

    // We need to open the TOC element for TOC links to show up
    const toggleBtn = screen.getByRole('button', { name: 'Table of Contents' });
    fireEvent.click(toggleBtn);

    const tocLinkElm = await screen.findByRole('menuitem', {
      name: 'Chapter 1',
    });
    expect(tocLinkElm).toBeInTheDocument();
  });

  test('navigation should be called with the correct url', async () => {
    const toggleBtn = screen.getByRole('button', { name: 'Table of Contents' });
    fireEvent.click(toggleBtn);

    const chapterOneElm = await screen.findByRole('menuitem', {
      name: 'Chapter 1',
    });
    fireEvent.click(chapterOneElm);
    expect(MockNavigator.goToPageNumber).toHaveBeenCalledWith(9);
  });

  test('navigation should call chapter and subchapters separately if both are provided', async () => {
    const toggleBtn = screen.getByRole('button', { name: 'Table of Contents' });
    fireEvent.click(toggleBtn);

    const chapterTwoElm = await screen.findByRole('menuitem', {
      name: 'Chapter 2',
    });
    fireEvent.click(chapterTwoElm);
    expect(MockNavigator.goToPageNumber).toHaveBeenCalledWith(19);

    fireEvent.click(toggleBtn);

    const chapterTwoTwoElm = await screen.findByRole('menuitem', {
      name: 'Chapter 2 Section 2',
    });
    fireEvent.click(chapterTwoTwoElm);
    expect(MockNavigator.goToPageNumber).toHaveBeenCalledWith(26);
  });
});
