import * as React from 'react';
import { render } from '@testing-library/react';
import {
  MockHtmlNavigator,
  MockHtmlReaderState,
  MockHtmlSettingsProps,
  MockPdfSettingsProps,
} from './utils/MockData';
import HtmlSettings from '../src/ui/HtmlSettings';
import PdfSettings from '../src/ui/PdfSettings';

import { axe } from 'jest-axe';
import SettingsCard from '../src/ui/SettingsButton';

describe('SettingsCard Accessibility checker', () => {
  test('SettingsCard should have no violation', async () => {
    const { container } = render(
      <SettingsCard
        navigator={MockHtmlNavigator}
        state={MockHtmlReaderState}
        type={'HTML'}
      />
    );

    expect(await axe(container)).toHaveNoViolations();
  });
});

describe('Render settings for different media type', () => {
  test('HTML settings', () => {
    const { getByRole, queryByLabelText } = render(
      <HtmlSettings {...MockHtmlSettingsProps} />
    );

    // default buttons
    expect(getByRole('radio', { name: 'Default' })).toBeInTheDocument();
    expect(getByRole('radio', { name: 'Serif' })).toBeInTheDocument();
    expect(getByRole('radio', { name: 'Sans-Serif' })).toBeInTheDocument();
    expect(getByRole('radio', { name: 'Dyslexia' })).toBeInTheDocument();

    expect(
      getByRole('button', { name: 'Decrease font size' })
    ).toBeInTheDocument();
    expect(
      getByRole('button', { name: 'Increase font size' })
    ).toBeInTheDocument();

    expect(getByRole('radio', { name: 'Day' })).toBeInTheDocument();
    expect(getByRole('radio', { name: 'Sepia' })).toBeInTheDocument();
    expect(getByRole('radio', { name: 'Night' })).toBeInTheDocument();

    expect(getByRole('radio', { name: 'Paginated' })).toBeInTheDocument();
    expect(getByRole('radio', { name: 'Scrolling' })).toBeInTheDocument();

    // default checked buttons. Can't mock 'click' because it's controlled.
    expect(getByRole('radio', { name: 'Sans-Serif' })).toBeChecked();
    expect(getByRole('radio', { name: 'Day' })).toBeChecked();
    expect(getByRole('radio', { name: 'Paginated' })).toBeChecked();

    expect(queryByLabelText('Zoom In')).toBeNull();
    expect(queryByLabelText('Zoom Out')).toBeNull();
  });

  test('PDF settings', () => {
    const { getByRole, queryByLabelText } = render(
      <PdfSettings {...MockPdfSettingsProps} />
    );

    expect(getByRole('radio', { name: 'Paginated' })).toBeInTheDocument();
    expect(getByRole('radio', { name: 'Scrolling' })).toBeInTheDocument();

    expect(getByRole('button', { name: 'Zoom In' })).toBeInTheDocument();
    expect(getByRole('button', { name: 'Zoom Out' })).toBeInTheDocument();

    // default checked values
    expect(getByRole('radio', { name: 'Paginated' })).toBeChecked();

    expect(queryByLabelText('Increase font size')).toBeNull();
  });
});
