import * as React from 'react';
import { render } from '@testing-library/react';
import SettingsCard from '../src/ui/SettingsButton';
import { MockHtmlReaderProps, MockPdfReaderProps } from './utils/MockData';

describe('Render settings for different media type', () => {
  test('HTML settings', () => {
    const { getByRole, getByLabelText, queryByLabelText } = render(
      <SettingsCard {...MockHtmlReaderProps} />
    );

    expect(getByRole('button', { name: 'Settings' })).toBeInTheDocument();

    // default buttons
    expect(getByLabelText('Publisher')).toBeInTheDocument();
    expect(getByLabelText('Serif')).toBeInTheDocument();
    expect(getByLabelText('Sans-Serif')).toBeInTheDocument();
    expect(getByLabelText('Dyslexia-Friendly')).toBeInTheDocument();

    expect(getByLabelText('Decrease font size')).toBeInTheDocument();
    expect(getByLabelText('Increase font size')).toBeInTheDocument();

    expect(getByLabelText('Day')).toBeInTheDocument();
    expect(getByLabelText('Sepia')).toBeInTheDocument();
    expect(getByLabelText('Night')).toBeInTheDocument();

    expect(getByLabelText('Paginated')).toBeInTheDocument();
    expect(getByLabelText('Scrolling')).toBeInTheDocument();

    // default checked buttons. Can't mock 'click' because it's controlled.
    expect(getByLabelText('Sans-Serif')).toBeChecked();
    expect(getByLabelText('Day')).toBeChecked();
    expect(getByLabelText('Paginated')).toBeChecked();

    // TODO: pdf specific tests, create tests for PDF specific settings and make sure they don't
    // show up for the HTML reader. This should also apply to Cypress tests.
    expect(queryByLabelText('Zoom In')).toBeNull();
    expect(queryByLabelText('Zoom Out')).toBeNull();
  });

  test('PDF settings', () => {
    const { getByRole, getByLabelText } = render(
      <SettingsCard {...MockPdfReaderProps} />
    );

    // TODO: Need to figure out what settings to be shown by default

    expect(getByRole('button', { name: 'Settings' })).toBeInTheDocument();

    expect(getByLabelText('Publisher')).toBeInTheDocument();
    expect(getByLabelText('Serif')).toBeInTheDocument();
    expect(getByLabelText('Sans-Serif')).toBeInTheDocument();
    expect(getByLabelText('Dyslexia-Friendly')).toBeInTheDocument();

    expect(getByLabelText('Paginated')).toBeInTheDocument();
    expect(getByLabelText('Scrolling')).toBeInTheDocument();

    expect(getByLabelText('Zoom In')).toBeInTheDocument();
    expect(getByLabelText('Zoom Out')).toBeInTheDocument();

    // default checked values
    expect(getByLabelText('Sans-Serif')).toBeChecked();
    expect(getByLabelText('Paginated')).toBeChecked();

    // TODO: HTML specific tests. Same as above, make sure HTML settings/buttons do not show up on the page when a PDF is being rendered.
  });
});
