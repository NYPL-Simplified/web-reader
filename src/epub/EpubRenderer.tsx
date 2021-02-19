import React, { FC } from 'react';
import { AnyClient } from '../types';
import { UseWebReaderReturn } from '../useWebReader';
import EpubClient from './EpubClient';

type RendererProps<TClient extends AnyClient> = Omit<
  UseWebReaderReturn<TClient, unknown>,
  'Renderer'
>;

const EpubRenderer: FC<RendererProps<EpubClient>> = ({ client, location }) => {
  return (
    <div
      id={EpubClient.EPUB_JS_WRAPPER_ID}
      style={{
        flex: 1,
        overflow: 'hidden',
        position: 'relative',
        border: 'none',
        backgroundColor: 'white',
      }}
    />
  );
};

export default EpubRenderer;
