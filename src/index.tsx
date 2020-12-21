import React, { FC, HTMLAttributes } from 'react';
import { Manager } from './manager';
import { Format } from './types';

export interface WebReaderProps extends HTMLAttributes<HTMLDivElement> {
  manifestUrl: string;
  type: Format;
}

/**
 *  Our WebReader
 */
export const WebReader: FC<WebReaderProps> = ({ manifestUrl, type }) => {
  return <Manager manifestUrl={manifestUrl} type={type} />;
};
