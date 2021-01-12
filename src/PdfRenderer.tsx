import React, { FC } from 'react';

const PdfRenderer: FC<{ src: string }> = ({ src }) => {
  return (
    <iframe
      // sandbox="all"
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

export default PdfRenderer;
