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
}) => {
  const webReader = useWebReader({
    webpubManifestUrl,
    proxyUrl,
  });
  const { content } = webReader;

  return <ManagerUI {...webReader}>{content}</ManagerUI>;
};

export default WebReader;
