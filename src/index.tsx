import React, { FC } from 'react';
import ManagerUI from './manager';
import { AnyFormat } from './types';
import useWebReader from './useWebReader';

export type WebReaderProps = {
  entrypoint: string;
  format: AnyFormat;
};

const WebReader: FC<WebReaderProps> = ({ entrypoint, format }) => {
  const webReader = useWebReader(format, entrypoint);
  const { isLoading, content } = webReader;

  if (isLoading) return <div>Loading...</div>;

  return <ManagerUI {...webReader}>{content}</ManagerUI>;
};
export default WebReader;
