import React from 'react';
import { usePdfReader } from '../src';
import { WebpubManifest } from '../src/types';
import Footer from '../src/ui/Footer';
import Header from '../src/ui/Header';

type CustomReaderProps = {
  webpubManifestUrl: string;
  manifest: WebpubManifest;
  proxyUrl: string | undefined;
  pdfWorkerSrc: string;
};

/**
 * This sample shows setting how to use the usePdfReader hook
 * to render PDFs. Use it when you know you're _not_ going to be
 * opening EPUBs.
 */
const UsePdfReader: React.FC<CustomReaderProps> = ({
  webpubManifestUrl,
  manifest,
  proxyUrl,
  pdfWorkerSrc,
}) => {
  const reader = usePdfReader({
    webpubManifestUrl,
    manifest,
    proxyUrl,
    pdfWorkerSrc,
  });
  const containerRef = React.useRef<HTMLDivElement>(null);

  if (!reader || !reader.type) {
    return null;
  }

  return (
    <div>
      <Header
        {...reader}
        headerLeft={<a href="/">Back</a>}
        containerRef={containerRef}
      />
      {reader.content}
      <Footer {...reader} />
    </div>
  );
};

export default UsePdfReader;
