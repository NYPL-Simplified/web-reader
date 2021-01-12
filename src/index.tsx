import React, { FC } from 'react';
import ManagerUI from './manager';
import { AnyManifest, AnyMimeType } from './types';
import useWebReader from './useWebReader';

export type WebReaderProps = {
  manifest: AnyManifest;
  type: AnyMimeType;
};

/**
 *  Our WebReader
 */
export const WebReader: FC<WebReaderProps> = ({ manifest, type }) => {
  const webReader = useWebReader({ manifest, type });

  return <ManagerUI {...webReader} />;
};
