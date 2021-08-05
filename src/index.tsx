import React, { FC } from 'react';
import ManagerUI from './ui/manager';
import useWebReader from './useWebReader';

/**
 * The main React component export.
 */

export type WebReaderProps = {
  webpubManifestUrl: string;
  proxyUrl?: string;
};

const WebReader: FC<WebReaderProps> = ({ webpubManifestUrl, proxyUrl }) => {
  const webReader = useWebReader(webpubManifestUrl, {
    proxyUrl,
  });
  const { content } = webReader;

  return <ManagerUI {...webReader}>{content}</ManagerUI>;
};

export default WebReader;
