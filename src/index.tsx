import React, { FC } from 'react';
import ManagerUI from './manager';
import { GetContent } from './types';
import useWebReader from './useWebReader';

/**
 * The main React component export.
 */

export type WebReaderProps = {
  webpubManifestUrl: string;
  getContent?: GetContent;
};

const WebReader: FC<WebReaderProps> = ({ webpubManifestUrl, getContent }) => {
  const webReader = useWebReader(webpubManifestUrl, {
    getContent,
  });
  const { content } = webReader;

  return <ManagerUI {...webReader}>{content}</ManagerUI>;
};
export default WebReader;
