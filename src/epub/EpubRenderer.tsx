import React, { FC } from 'react';
import EpubClient from './EpubClient';

const EpubRenderer: FC = () => {
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
