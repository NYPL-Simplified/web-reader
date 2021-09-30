import React from 'react';
import {
  ActiveReader,
  HtmlNavigator,
  PdfNavigator,
  ReaderState,
} from '../../src/types';
import { MockWebpubManifest } from './MockWebpubManifest';

const goForwardFn = jest.fn();
const goBackwardFn = jest.fn();
const setColorModeFn = jest.fn();
const setScrollFn = jest.fn();
const increaseFontSizeFn = jest.fn();
const decreaseFontSizeFn = jest.fn();
const zoomInFn = jest.fn();
const zoomOutFn = jest.fn();
const setFontFamilyFn = jest.fn();
const goToPageFn = jest.fn();

export const MockHtmlNavigator = {
  goForward: goForwardFn,
  goBackward: goBackwardFn,
  setColorMode: setColorModeFn,
  setScroll: setScrollFn,
  increaseFontSize: increaseFontSizeFn,
  decreaseFontSize: decreaseFontSizeFn,
  setFontFamily: setFontFamilyFn,
  goToPage: goToPageFn,
} as HtmlNavigator;

export const MockPdfNavigator = {
  goForward: goForwardFn,
  goBackward: goBackwardFn,
  setColorMode: setColorModeFn,
  setScroll: setScrollFn,
  zoomIn: zoomInFn,
  zoomOut: zoomOutFn,
  setFontFamily: setFontFamilyFn,
  goToPage: goToPageFn,
} as PdfNavigator;

export const MockReaderState = {} as ReaderState;

const MockComponent = (): React.ReactElement => <>Hello, world.</>;

const MockHtmlReaderState = {
  colorMode: 'day',
  isScrolling: false,
  fontSize: 16,
  fontFamily: 'sans-serif',
  reader: undefined,
  currentTocLocation: null,
};

const MockPdfReaderState = {
  colorMode: 'day',
  isScrolling: false,
  fontSize: 16,
  fontFamily: 'sans-serif',
  resourceIndex: 0,
  file: null,
  pageNumber: 1,
  numPages: null,
  currentTocLocation: null,
};

export const MockHtmlReaderProps = {
  type: 'HTML',
  isLoading: false,
  content: <MockComponent />,
  state: MockHtmlReaderState,
  manifest: MockWebpubManifest,
  navigator: MockHtmlNavigator,
} as ActiveReader;

export const MockPdfReaderProps = {
  type: 'PDF',
  isLoading: false,
  content: <MockComponent />,
  state: MockPdfReaderState,
  manifest: MockWebpubManifest,
  navigator: MockPdfNavigator,
} as ActiveReader;
