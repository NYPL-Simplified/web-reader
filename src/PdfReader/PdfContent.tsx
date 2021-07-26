import { Document, Page } from 'react-pdf';
import React, { useState } from 'react';
import { WebpubManifest } from '../types';

/**
 * The content that is rendered. In the EPUB case this is static. It just renders
 * a div that R2D2BC renders into. I don't know if you'll need to pass props
 * into this or just render a div with some id for whatever package you use.
 * But this is where you do it!
 */
export default function PDFContent({ resource }: { resource: string }) {
  console.log('pdfcontent resource', resource);
  const [numPages, setNumPages] = useState(0);
  const [pageNumber, setPageNumber] = useState(1);

  function onDocumentLoadSuccess({ numPages }: { numPages: number }) {
    setNumPages(numPages);
  }

  return (
    <Document file={resource} onLoadSuccess={onDocumentLoadSuccess}>
      <Page pageNumber={pageNumber} />
      <p>
        Page {pageNumber} of {numPages}
      </p>
    </Document>
  );
}
