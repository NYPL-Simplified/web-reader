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
  const Renderer = isPdfManifest(manifest) ? PdfRenderer : WebPubRenderer;

  const [chapter, setChapter] = React.useState(0);
  const [page, setPage] = React.useState(0);

  const nextChapter = () => {
    setChapter((ch) => {
      if (client.spine.length - 1 === ch) {
        console.warn(`You're on the last chapter.`);
        return ch;
      }
      return ch + 1;
    });
  };
  const prevChapter = () => {
    setChapter((ch) => {
      if (ch === 0) {
        console.warn(`You're on the first chapter.`);
        return ch;
      }
      return ch - 1;
    });
  };

  const src = client.contentFor(chapter);

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
      <Renderer src={src} />
      <div
        style={{ padding: 8, display: 'flex', justifyContent: 'space-between' }}
      >
        <div style={{ display: 'flex' }}>
          <button onClick={prevChapter}> {`<<`} chapter</button>
          <button> {`<`} page</button>
        </div>
        <div>
          Capter: {chapter + 1} / {client.spine.length}
        </div>
        <div style={{ display: 'flex' }}>
          <button>page {`>`}</button>
          <button onClick={nextChapter}>chapter {`>>`}</button>
        </div>
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
      sandbox=""
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

export const PdfRenderer: FC<WebpubRendererProps> = ({ src }) => {
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
