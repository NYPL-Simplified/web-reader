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
  const { client, Renderer } = webReader;

  if (!client) return <div>Loading...</div>;

  return (
    <ManagerUI {...webReader}>
      <Renderer {...webReader} />
    </ManagerUI>
  );
};
export default WebReader;

/**
 * The underlying problem here is that each Client and Renderer
 * work with their own Location type, but once you've abstracted them
 * to a general Client/Renderer, you no longer know that the
 * Location works with it.
 */
