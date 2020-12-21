import React, { FC } from 'react';
import WebpubClient from './WebpubClient';

/**
 * The responsibilities of the manager:
 *
 *  - Render manager UI
 *  - Save reading location
 *  - Render the reader using apropriate renderer
 */

export const Manager: FC<{ manifestUrl: string; type: 'webpub' }> = ({
  manifestUrl,
}) => {
  const [client, setClient] = React.useState<WebpubClient | null>(null);

  // setup the client
  React.useEffect(() => {
    WebpubClient.init(manifestUrl).then((client) => setClient(client));
  }, [manifestUrl]);

  if (!client) return <div>Loading...</div>;

  // use the correct renderer depending on type
  return (
    <div style={{ height: '100vh', overflow: 'hidden' }}>
      <nav>
        <div>{client.metadata.title}</div>
      </nav>
      <WebPubRenderer src={client.startUrl} />
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
