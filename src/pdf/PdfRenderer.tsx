import React, { FC } from 'react';
import { UseWebReaderReturn } from '../useWebReader';
import PdfClient from './PdfClient';

const PdfRenderer: FC<UseWebReaderReturn<PdfClient, any>> = ({ client }) => {
  return <div>hi pdf</div>;
  // return (
  //   <iframe
  //     // sandbox="all"
  //     src={content}
  //     title="Hi"
  //     style={{
  //       flex: 1,
  //       border: 'none',
  //       backgroundColor: 'white',
  //     }}
  //   />
  // );
};

export default PdfRenderer;
