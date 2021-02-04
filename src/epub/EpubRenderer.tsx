import React, { FC } from 'react';
import { WebReaderProps } from '..';
import ReaderClient from '../ReaderClient';
import { EpubLocation } from '../types';
import { UseWebReaderReturn } from '../useWebReader';
import EpubClient from './EpubClient';

type RendererProps<TClient> = Omit<
  UseWebReaderReturn<TClient, unknown>,
  'Renderer'
>;

const EpubRenderer: FC<RendererProps<EpubClient>> = ({ client }) => {
  // display the book
  React.useEffect(() => {
    client?.rendition.display();
  }, [client]);

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
