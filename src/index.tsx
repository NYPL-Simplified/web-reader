import React, { FC } from 'react';
import { ReaderManagerArguments, UseWebReaderArguments } from './types';
import ErrorBoundary from './ui/ErrorBoundary';
import ManagerUI from './ui/manager';
import useWebReader from './useWebReader';

/**
 * The main React component export.
 */

export type WebReaderProps = UseWebReaderArguments & ReaderManagerArguments;

export const WebReaderWithoutBoundary: FC<WebReaderProps> = ({
  webpubManifestUrl,
  proxyUrl,
  getContent,
  headerLeft,
  ...props
}) => {
  const webReader = useWebReader({
    webpubManifestUrl,
    proxyUrl,
    getContent,
    ...props,
  });
  const { content } = webReader;

  return (
    <ManagerUI headerLeft={headerLeft} {...webReader}>
      {content}
    </ManagerUI>
  );
};

const WebReader: FC<WebReaderProps> = (props) => {
  return (
    <ErrorBoundary {...props}>
      <WebReaderWithoutBoundary {...props} />
    </ErrorBoundary>
  );
};

export default WebReader;

export { usePublicationSW } from './ServiceWorker/index';
export { default as useWebReader } from './useWebReader';
export { default as useHtmlReader } from './HtmlReader';
export { default as usePdfReader } from './PdfReader';
export { getTheme } from './ui/theme';
