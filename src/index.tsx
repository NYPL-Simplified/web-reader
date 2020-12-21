import React, { FC, HTMLAttributes } from 'react';
import { Manager } from './manager';

export interface WebReaderProps extends HTMLAttributes<HTMLDivElement> {
  manifestUrl: string;
  type: 'webpub';
}

/**
 *  Our WebReader
 */
export const WebReader: FC<WebReaderProps> = ({ manifestUrl, type }) => {
  return <Manager manifestUrl={manifestUrl} type={type} />;
};
