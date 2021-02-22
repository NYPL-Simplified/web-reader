import React, { FC } from 'react';
import EpubRenderer from './epub/EpubRenderer';
import ManagerUI from './manager';
import PdfRenderer from './pdf/PdfRenderer';
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
  const webReader = useWebReader(format, entrypoint);
  const { isLoading, renderer } = webReader;

  if (!isLoading) return <div>Loading...</div>;

  return <ManagerUI {...webReader}>{renderer}</ManagerUI>;
};
export default WebReader;

/**
 * The problem in this case is that the format type is the union of the two types,
 * but what we want is strictly one type or the other, which will tell us what
 * we get out of the hook. But we shouldn't actually care what we get out
 * anymore.
 */
