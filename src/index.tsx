import React, { FC } from 'react';
import { ReaderManagerArguments, UseWebReaderArguments } from './types';
import ManagerUI from './ui/manager';
import useWebReader from './useWebReader';

/**
 * The main React component export.
 */

const WebReader: FC<UseWebReaderArguments & ReaderManagerArguments> = ({
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

export default WebReader;
