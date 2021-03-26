import { GetContent } from '@d-i-t-a/reader/dist/navigator/IFrameNavigator';
import React, { FC } from 'react';
import ManagerUI from './manager';
import { AnyFormat } from './types';
import useWebReader from './useWebReader';

export type WebReaderProps = {
  webpubManifestUrl: string;
  format: AnyFormat;
  getContent?: GetContent;
};

const WebReader: FC<WebReaderProps> = ({
  webpubManifestUrl,
  format,
  getContent,
}) => {
  const webReader = useWebReader(format, webpubManifestUrl, {
    getContent,
  });
  const { content } = webReader;

  return <ManagerUI {...webReader}>{content}</ManagerUI>;
};
export default WebReader;
