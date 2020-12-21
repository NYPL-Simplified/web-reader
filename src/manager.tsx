import React, { FC } from 'react';

/**
 * The responsibilities of the manager:
 *
 *  - Render manager UI
 *  - Save reading location
 *  - Render the reader using apropriate renderer
 */

async function fetchManifest(url: string) {
  const result = await fetch(url);
  if (!result.ok) throw new Error('Failed to fetch manifest at url: ' + url);
  return await result.json();
}

type WebpubManifest = {
  metadata: {
    title: string;
    author: string;
  };
  spine: { href: string; type: 'text/html'; title: string }[];
};

export const Manager: FC<{ manifestUrl: string; type: 'webpub' }> = ({
  manifestUrl,
}) => {
  const [manifest, setManifest] = React.useState<WebpubManifest | null>(null);

  // fetch the manifest
  React.useEffect(() => {
    console.log('fetching manifest');
    fetchManifest(manifestUrl).then((manifest) => setManifest(manifest));
  }, [manifestUrl]);

  if (!manifest) return <div>Loading...</div>;

  const startPath = manifest.spine[0].href;
  const startUrl = new URL(startPath, manifestUrl).href;
  console.log('manifest', startUrl);
  // use the correct renderer depending on type
  return (
    <div style={{ height: '100vh', overflow: 'hidden' }}>
      <WebPubRenderer src={startUrl} />
    </div>
  );
};

type WebpubRenererProps = {
  src: string;
};

export const WebPubRenderer: FC<WebpubRenererProps> = ({ src }) => {
  return (
    <iframe
      src={src}
      title="Hi"
      style={{ width: '100%', height: '100%', border: 'none' }}
    />
  );
};
