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
  return manifest['@context'] === 'pdf';
}

export const Manager: FC<{ manifest: AnyManifest }> = ({ manifest }) => {
  const client = isPdfManifest(manifest)
    ? new PdfClient(manifest)
    : new WebpubClient(manifest);

  // use the correct renderer depending on type
  return (
    <div
      style={{
        height: '100vh',
        overflow: 'hidden',
        backgroundColor: 'mistyrose',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <nav
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: 8,
        }}
      >
        <h1>{client.metadata.title}</h1>
        <button>settings</button>
      </nav>
      <WebPubRenderer src={client.startUrl} />
      <div
        style={{ padding: 8, display: 'flex', justifyContent: 'space-between' }}
      >
        <button> {`<`} Prev</button>
        <button>Next {`>`}</button>
      </div>
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
        flex: 1,
        border: 'none',
        backgroundColor: 'white',
      }}
    />
  );
};
