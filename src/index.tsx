import React, { FC } from 'react';
import { UseWebReaderArguments } from './types';
import ManagerUI from './ui/manager';
import useWebReader from './useWebReader';

/**
 * The main React component export.
 */

const WebReader: FC<UseWebReaderArguments> = ({
  webpubManifestUrl,
  proxyUrl,
  getContent,
}) => {
  const webReader = useWebReader({
    webpubManifestUrl,
    proxyUrl,
    getContent,
  });
  const { content } = webReader;

  return <ManagerUI {...webReader}>{content}</ManagerUI>;
};

export default WebReader;
