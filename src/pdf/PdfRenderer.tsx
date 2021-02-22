import React, { FC } from 'react';

const PdfRenderer: FC<{ content: string }> = ({ content }) => {
  return (
    <iframe
      // sandbox="all"
      src={content}
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
