import React, { FC } from 'react';
import ManagerUI from './manager';
import { AnyManifest, AnyFormat } from './types';
import useWebReader from './useWebReader';

export type WebReaderProps = {
  manifest: AnyManifest;
  format: AnyFormat;
};

/**
 *  Our WebReader
 */
const WebReader: FC<WebReaderProps> = ({ manifest, format }) => {
  const webReader = useWebReader({ manifest, format });

  return <ManagerUI {...webReader} />;
};
export default WebReader;
