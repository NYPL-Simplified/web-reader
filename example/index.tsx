import 'react-app-polyfill/ie11';
import 'regenerator-runtime/runtime';
import * as React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter, Switch, Route, Link } from 'react-router-dom';
import WebReader from '../src';
import '@nypl/design-system-react-components/dist/styles.css';
import {
  ChakraProvider,
  Heading,
  UnorderedList,
  ListItem,
  Box,
  Text,
} from '@chakra-ui/react';
import { getTheme } from '../src/ui/theme';
import usePublicationSW from '../src/ServiceWorker/client';
import { pdfjs } from 'react-pdf';
// import createDecryptor from './axisnow/createWorkerlessDecryptor';
import createDecryptor from './axisnow/createWorkerDecryptor';
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
          <Route path="/pdf-collection">
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
          <Route path="/streamed-alice-epub">
            <WebReader webpubManifestUrl="https://alice.dita.digital/manifest.json" />
          </Route>
          <Route exact path="/">
            <Box m={2}>
              <Heading as="h1">NYPL Web Reader</Heading>
              <Heading as="h2" fontSize={2} mt={3}>
                Generic Examples
              </Heading>
              <UnorderedList p={4}>
                <ListItem>
                  EPUB2 Based Webpubs
                  <UnorderedList>
                    <ListItem>
                      <Link to="/moby-epub2">Moby Dick </Link>
                    </ListItem>
                  </UnorderedList>
                </ListItem>
                <ListItem>
                  Remote hosted WebPubs
                  <UnorderedList>
                    <ListItem>
                      <Link to="streamed-alice-epub">
                        Alice's Adventures in Wonderland
                      </Link>
                      <Text as="i">
                        &nbsp;(streamed from https://alice.dita.digital)
                      </Text>
                    </ListItem>
                  </UnorderedList>
                </ListItem>
                <ListItem>
                  PDFs
                  <UnorderedList>
                    <ListItem>
                      <Link to="/pdf">Single-PDF Webpub</Link>
                    </ListItem>
                    <ListItem>
                      <Link to="/pdf-collection">Multi-PDF Webpub</Link>
                    </ListItem>
                  </UnorderedList>
                </ListItem>
              </UnorderedList>
              <Heading as="h2" fontSize={2} mt={3}>
                AxisNow Examples
              </Heading>
              <Text fontSize="sm">
                These examples are specific to NYPL, and may not work properly
                without access to private packages.
              </Text>
              <UnorderedList p={4}>
                <ListItem>
                  <Link to="/axisnow-encrypted">AxisNow Encrypted EPUB</Link>
                </ListItem>
                <ListItem>
                  <Link to="/axisnow-decrypted">Decrypted AxisNow EPUB</Link>
                  <UnorderedList>
                    <ListItem>
                      <Text fontSize="sm" as="i">
                        This sample is the same as the above, but manually
                        decrypted on the server and served statically in a
                        decrypted form. The encrypted example should match this
                        one in the browser.
                      </Text>
                    </ListItem>
                  </UnorderedList>
                </ListItem>
              </UnorderedList>
            </Box>
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

/**
 * This sample shows setting up a decryptor for this specific book and then passing a
 * getContent function to the Web Reader. This getContent function runs in a separate
 * WebWorker thread to decrypt the HTML and any embedded resources within.
 */
const AxisNowEncrypted: React.FC = () => {
  const [getContent, setGetContent] = React.useState<null | GetContent>(null);
  const [error, setError] = React.useState<Error | undefined>(undefined);

  React.useEffect(() => {
    async function setupDecryptor(): Promise<
      (href: string) => Promise<string>
    > {
      const params = {
        book_vault_uuid: '6734F7F5-C48F-4A38-9AE5-9DF4ADCFBF0A',
        isbn: '9781467784870',
      };
      const decryptor = await createDecryptor(params);
      return decryptor;
    }

    setupDecryptor()
      .then((decr) => {
        setGetContent(() => decr);
      })
      .catch(setError);
  }, []);

  if (error) {
    return (
      <Box m={3} role="alert">
        <Heading as="h1" fontSize="lg">
          Something went wrong:
        </Heading>
        <Text>
          {error.name}: {error.message}
        </Text>
      </Box>
    );
  }

  if (!getContent) return <div>loading...</div>;

  return (
    <WebReader
      webpubManifestUrl={`${origin}/samples/axisnow/encrypted/manifest.json`}
      getContent={getContent}
    />
  );
};

async function getPlainContent(href: string) {
  const resp = await fetch(href);
  return await resp.text();
}

ReactDOM.render(<App />, document.getElementById('root'));
