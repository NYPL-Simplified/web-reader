import WebReader from '../src';
import * as React from 'react';
import { useParams } from 'react-router';

export default function CustomWebReader(
  props: React.ComponentProps<typeof WebReader>
): JSX.Element {
  const { version = 'v1' } = useParams<{ version: string | undefined }>();
  console.log('Using Version: ', version);
  return <WebReader {...props} _useCustomHtmlRenderer={version === 'v2'} />;
}
