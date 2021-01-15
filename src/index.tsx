import React, { FC } from 'react';
import ManagerUI from './manager';
import { AnyFormat } from './types';
import useWebReader from './useWebReader';

export type WebReaderProps = {
  entrypoint: string;
  format: AnyFormat;
};

/**
 *  Our WebReader
 */
const WebReader: FC<WebReaderProps> = ({ entrypoint, format }) => {
  const webReader = useWebReader({ entrypoint, format });

  return <ManagerUI {...webReader} />;
};
export default WebReader;
