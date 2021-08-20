import 'react-app-polyfill/ie11';
import 'regenerator-runtime/runtime';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { BrowserRouter, Switch, Route, Link } from 'react-router-dom';
import WebReader from '../src';
import '@nypl/design-system-react-components/dist/styles.css';
import {
  ChakraProvider,
  Heading,
  UnorderedList,
  ListItem,
} from '@chakra-ui/react';
import { getTheme } from '../src/ui/theme';
import usePublicationSW from '../src/ServiceWorker/client';
import { pdfjs } from 'react-pdf';
import getEncryptedContent from './axisnow/Decryptor';
import Decryptor from './axisnow/Decryptor';
import { GetContent } from '../src/types';

const origin = window.location.origin;

// react-pdf web worker config with their default CDN version
pdfjs.GlobalWorkerOptions.workerSrc = `${origin}/pdf-worker/pdf.worker.min.js`;

const pdfProxyUrl = process.env.CORS_PROXY_URL as string | undefined;

const App = () => {
  usePublicationSW([
    {
      manifestUrl: `${origin}/samples/pdf/degruyter.json`,
      proxyUrl: pdfProxyUrl,
    },
    {
      manifestUrl: `${origin}/samples/pdf/muse1007.json`,
      proxyUrl: pdfProxyUrl,
    },
    { manifestUrl: 'https://alice.dita.digital/manifest.json' },
    {
      manifestUrl: `${origin}/samples/moby-epub2-exploded/manifest.json`,
    },
    {
      manifestUrl: `${origin}/samples/axisnow/decrypted/manifest.json`,
    },
  ]);

  return (
    <ChakraProvider theme={getTheme('day')}>
      <BrowserRouter>
        <Switch>
          <Route path="/pdf">
            <WebReader
              webpubManifestUrl="/samples/pdf/degruyter.json"
              proxyUrl={pdfProxyUrl}
            />
          </Route>
          <Route path="/pdfcollection">
            <WebReader
              webpubManifestUrl="/samples/pdf/muse1007.json"
              proxyUrl={pdfProxyUrl}
            />
          </Route>
          <Route path="/axisnow-encrypted">
            <AxisNowEncrypted />
          </Route>
          <Route path="/axisnow-decrypted">
            <WebReader
              webpubManifestUrl={`${origin}/samples/axisnow/decrypted/manifest.json`}
            />
          </Route>
          <Route path="/moby-epub2">
            <WebReader
              webpubManifestUrl={`${origin}/samples/moby-epub2-exploded/manifest.json`}
            />
          </Route>
          <Route path="/streamed-epub">
            <WebReader webpubManifestUrl="https://alice.dita.digital/manifest.json" />
          </Route>
          <Route exact path="/">
            <Heading as="h1">Web Reader Proof of Concept</Heading>
            <UnorderedList p={4}>
              <ListItem>
                <Link to="/axisnow-encrypted">Encrypted EPUB Example</Link>
              </ListItem>
              <ListItem>
                <Link to="/axisnow-decrypted">Manually Decrypted EPUB</Link>
              </ListItem>
              <ListItem>
                <Link to="/moby-epub2">Moby EPUB2-based Webpub</Link>
              </ListItem>
              <ListItem>
                <Link to="/streamed-epub">Regular (streamed) ePub Example</Link>
              </ListItem>
              <ListItem>
                <Link to="/pdf">Pdf Example</Link>
              </ListItem>
              <ListItem>
                <Link to="/pdfcollection">Pdf Collection Example</Link>
              </ListItem>
            </UnorderedList>
          </Route>
          <Route path="*">
            <h1>404</h1>
            <p>Page not found.</p>
          </Route>
        </Switch>
      </BrowserRouter>
    </ChakraProvider>
  );
};

const AxisNowEncrypted: React.FC = () => {
  const [getContent, setGetContent] = React.useState<null | GetContent>(null);

  React.useEffect(() => {
    async function setupDecryptor() {
      const params = {
        book_vault_uuid: '6734F7F5-C48F-4A38-9AE5-9DF4ADCFBF0A',
        isbn: '9781467784870',
      };
      const decryptor = await Decryptor.createDecryptor(params);

      return decryptor.decryptToString;
    }

    setupDecryptor().then(setGetContent);
  }, []);

  if (!getContent) return 'loading...';
  return (
    <WebReader
      webpubManifestUrl={`${origin}/samples/axisnow/encrypted/manifest.json`}
      getContent={getContent}
    />
  );
};

ReactDOM.render(<App />, document.getElementById('root'));
