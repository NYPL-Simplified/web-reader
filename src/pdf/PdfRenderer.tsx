import React, { FC } from 'react';
import { UseWebReaderReturn } from '../useWebReader';
import PdfClient from './PdfClient';

const PdfRenderer: FC<UseWebReaderReturn<PdfClient, any>> = ({
  client,
  location,
}) => {
  console.log('wha', location);
  // return <div>hi pdf</div>;
  return (
    <iframe
      // sandbox="all"
      src={client?.contentFor(location)}
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
