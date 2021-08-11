import { Navigator, ReaderState, WebpubManifest } from '../../src/types';

const goForwardFn = jest.fn();
const goBackwardFn = jest.fn();
const setColorModeFn = jest.fn();
const setScrollFn = jest.fn();
const increaseFontSizeFn = jest.fn();
const decreaseFontSizeFn = jest.fn();
const setFontFamilyFn = jest.fn();
const goToPageFn = jest.fn();

export const MockNavigator = {
  goForward: goForwardFn,
  goBackward: goBackwardFn,
  setColorMode: setColorModeFn,
  setScroll: setScrollFn,
  increaseFontSize: increaseFontSizeFn,
  decreaseFontSize: decreaseFontSizeFn,
  setFontFamily: setFontFamilyFn,
  goToPage: goToPageFn,
} as Navigator;

export const MockWebpubManifest = {
  readingOrder: [
    {
      type: 'application/xhtml+xml',
      href: 'OEBPS/wrap0000.html',
    },
    {
      type: 'application/xhtml+xml',
      href: 'OEBPS/wrap00001.html',
    },
  ],
  toc: [
    {
      title: 'Chapter 1',
      href: 'chapter/one/url',
    },
    {
      title: 'Chapter 2',
      href: 'chapter/two/url',
    },
  ],
} as WebpubManifest;

export const MockReaderState = {} as ReaderState;
