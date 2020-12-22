import React, { FC } from 'react';
import { AnyManifest, PdfManifest } from './types';
import { WebpubClient, PdfClient } from './clients';

/**
 * The responsibilities of the manager:
 *
 *  - Render manager UI
 *  - Save reading location
 *  - Render the reader using apropriate renderer
 */

function isPdfManifest(manifest: AnyManifest): manifest is PdfManifest {
  return manifest['@context'] === 'http://readium.org/webpub/default.jsonld';
}

export const Manager: FC<{ manifest: AnyManifest }> = ({ manifest }) => {
  const client = isPdfManifest(manifest)
    ? new PdfClient(manifest)
    : new WebpubClient(manifest);

  if (!client) return <div>Loading...</div>;

  // use the correct renderer depending on type
  return (
    <div
      style={{
        height: '100vh',
        overflow: 'hidden',
        backgroundColor: 'mistyrose',
      }}
    >
      <nav>
        <div>{client.metadata.title}</div>
      </nav>
      <WebPubRenderer src={client.startUrl} />
    </div>
  );
};

type WebpubRendererProps = {
  src: string;
};

export const WebPubRenderer: FC<WebpubRendererProps> = ({ src }) => {
  return (
    <iframe
      src={src}
      title="Hi"
      style={{
        width: '100%',
        height: '100%',
        border: 'none',
        backgroundColor: 'white',
      }}
    />
  );
};
