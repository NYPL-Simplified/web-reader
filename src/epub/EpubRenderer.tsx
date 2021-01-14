import React, { FC } from 'react';

export type EpubRendererProps = {
  src: string;
};

const EpubRenderer: FC<EpubRendererProps> = ({ src }) => {
  return (
    <iframe
      // sandbox="allow-same-origin"
      src={src}
      title="Hi"
      style={{
        flex: 1,
        border: 'none',
        backgroundColor: 'white',
      }}
    />
  );
};

export default EpubRenderer;
