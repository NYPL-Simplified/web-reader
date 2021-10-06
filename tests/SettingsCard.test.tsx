import * as React from 'react';
import { render } from '@testing-library/react';
import { MockHtmlSettingsProps, MockPdfSettingsProps } from './utils/MockData';
import HtmlSettings from '../src/ui/HtmlSettings';
import PdfSettings from '../src/ui/PdfSettings';

describe('Render settings for different media type', () => {
  test('HTML settings', () => {
    const { getByRole, queryByLabelText } = render(
      <HtmlSettings {...MockHtmlSettingsProps} />
    );

    // default buttons
    expect(getByRole('radio', { name: 'Publisher' })).toBeInTheDocument();
    expect(getByRole('radio', { name: 'Serif' })).toBeInTheDocument();
    expect(getByRole('radio', { name: 'Sans-Serif' })).toBeInTheDocument();
    expect(
      getByRole('radio', { name: 'Dyslexia-Friendly' })
    ).toBeInTheDocument();

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

    // TODO: pdf specific tests, create tests for PDF specific settings and make sure they don't
    // show up for the HTML reader. This should also apply to Cypress tests.
    expect(queryByLabelText('Zoom In')).toBeNull();
    expect(queryByLabelText('Zoom Out')).toBeNull();
  });

  test('PDF settings', () => {
    const { getByRole } = render(<PdfSettings {...MockPdfSettingsProps} />);

    // TODO: Need to figure out what settings to be shown by default

    expect(getByRole('radio', { name: 'Paginated' })).toBeInTheDocument();
    expect(getByRole('radio', { name: 'Scrolling' })).toBeInTheDocument();

    expect(getByRole('button', { name: 'Zoom In' })).toBeInTheDocument();
    expect(getByRole('button', { name: 'Zoom Out' })).toBeInTheDocument();

    // default checked values
    expect(getByRole('radio', { name: 'Paginated' })).toBeChecked();

    // TODO: HTML specific tests. Same as above, make sure HTML settings/buttons do not show up on the page when a PDF is being rendered.
  });
});
