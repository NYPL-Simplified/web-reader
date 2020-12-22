import React, { FC, HTMLAttributes } from 'react';
import { Manager } from './manager';
import { AnyManifest } from './types';

export interface WebReaderProps extends HTMLAttributes<HTMLDivElement> {
  manifest: AnyManifest;
}

/**
 *  Our WebReader
 */
export const WebReader: FC<WebReaderProps> = ({ manifest }) => {
  return <Manager manifest={manifest} />;
};
