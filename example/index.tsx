import 'react-app-polyfill/ie11';
import 'regenerator-runtime/runtime';
import * as React from 'react';
import ReactDOM from 'react-dom';
import {
  BrowserRouter,
  Switch,
  Route,
  Link,
  useParams,
} from 'react-router-dom';
import WebReader from '../src';
import {
  ChakraProvider,
  Heading,
  UnorderedList,
  ListItem,
  Box,
  Text,
  Input,
  Flex,
  Button,
} from '@chakra-ui/react';
import { getTheme } from '../src/ui/theme';
import usePublicationSW from '../src/ServiceWorker/client';
import AxisNowEncrypted from './axisnow-encrypted';
import htmlStyles from 'url:../src/HtmlReader/injectable-styles.css';
import { Injectable } from '@d-i-t-a/reader/dist/types/navigator/IFrameNavigator';
import Tests from './Tests';

const origin = window.location.origin;

const pdfProxyUrl = process.env.CORS_PROXY_URL as string | undefined;

const cssInjectable: Injectable = {
  type: 'style',
  url: htmlStyles,
};
const fontInjectable: Injectable = {
  type: 'style',
  url: `${origin}/fonts/opendyslexic/opendyslexic.css`,
  fontFamily: 'opendyslexic',
};

const htmlInjectables = [cssInjectable, fontInjectable];

const App = () => {
  /**
   * For the example app we will only cache one publication by default.
   * Uncomment to cache others if desired. Note that the SW is disabled
   * by default also, so even though they are cached, they will not be
   * served from the cache. Disabling them just limits the number of network
   * requests we make in dev. To enable the service worker in development,
   * run `npm run example:sw`.
   */
  usePublicationSW([
    {
      manifestUrl: `${origin}/samples/moby-epub2-exploded/manifest.json`,
    },
    // {
    //   manifestUrl: `${origin}/samples/pdf/degruyter.json`,
    //   proxyUrl: pdfProxyUrl,
    // },
    // {
    //   manifestUrl: `${origin}/samples/pdf/muse1007.json`,
    //   proxyUrl: pdfProxyUrl,
    // },
    // { manifestUrl: 'https://alice.dita.digital/manifest.json' },
    // {
    //   manifestUrl: `${origin}/samples/axisnow/decrypted/manifest.json`,
    // },
  ]);

  return (
    <ChakraProvider theme={getTheme('day')}>
      <BrowserRouter>
        <Switch>
          <Route path="/pdf">
            <WebReader
              webpubManifestUrl="/samples/pdf/degruyter.json"
              proxyUrl={pdfProxyUrl}
              pdfWorkerSrc={`${origin}/pdf-worker/pdf.worker.min.js`}
            />
          </Route>
          <Route path="/pdf-collection">
            <WebReader
              webpubManifestUrl="/samples/pdf/muse1007.json"
              proxyUrl={pdfProxyUrl}
              pdfWorkerSrc={`${origin}/pdf-worker/pdf.worker.min.js`}
            />
          </Route>
          <Route path="/axisnow-encrypted">
            <AxisNowEncrypted />
          </Route>
          <Route path="/axisnow-decrypted">
            <WebReader
              injectables={htmlInjectables}
              webpubManifestUrl={`${origin}/samples/dickens-axisnow/decrypted/manifest.json`}
            />
          </Route>
          <Route path="/moby-epub2">
            <WebReader
              injectables={htmlInjectables}
              webpubManifestUrl={`${origin}/samples/moby-epub2-exploded/manifest.json`}
            />
          </Route>
          <Route path="/streamed-alice-epub">
            <WebReader
              injectables={htmlInjectables}
              webpubManifestUrl="https://alice.dita.digital/manifest.json"
            />
          </Route>
          <Route path="/url/:manifestUrl">
            <DynamicReader />
          </Route>
          <Route exact path="/">
            <HomePage />
          </Route>
          <Route path="/test">
            <Tests />
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

const HomePage = () => {
  const [dynamicHref, setValue] = React.useState('');
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) =>
    setValue(event.target.value);
  return (
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
        <ListItem>
          Bring your own manifest:
          <Flex alignItems="center">
            <Input
              maxW={500}
              value={dynamicHref}
              onChange={handleChange}
              placeholder="Webpub Manifest URL"
            />
            <Button
              ml={2}
              as={Link}
              to={`/url/${encodeURIComponent(dynamicHref)}`}
            >
              Go
            </Button>
          </Flex>
        </ListItem>
      </UnorderedList>
      <Heading as="h2" fontSize={2} mt={3}>
        AxisNow Examples
      </Heading>
      <Text fontSize="sm">
        These examples are specific to NYPL, and may not work properly without
        access to private packages.
      </Text>
      <UnorderedList p={4}>
        <ListItem>
          <Link to="/axisnow-encrypted">AxisNow Encrypted EPUB</Link>
          <UnorderedList>
            <ListItem>
              <Text fontSize="sm" as="i">
                This example uses a real book in the NYPL Open eBooks catalog.
                You will need to have process.env.VAULT_UUID and
                process.env.ISBN set properly to read this book. Read
                example/README.txt for more info. If the example stops working,
                your loan likely expired and you will need to run the commands
                listed there with a proper username and password to check it out
                again.
              </Text>
            </ListItem>
          </UnorderedList>
        </ListItem>
        <ListItem>
          <Link to="/axisnow-decrypted">Decrypted AxisNow EPUB</Link>
          <UnorderedList>
            <ListItem>
              <Text fontSize="sm" as="i">
                This sample is the same as the above, but manually decrypted on
                the server and served statically in a decrypted form. The
                encrypted example should match this one in the browser.
              </Text>
            </ListItem>
          </UnorderedList>
        </ListItem>
      </UnorderedList>
    </Box>
  );
};

const DynamicReader: React.FC = () => {
  const { manifestUrl } = useParams<{ manifestUrl: string }>();
  const decoded = decodeURIComponent(manifestUrl);
  return (
    <WebReader injectables={htmlInjectables} webpubManifestUrl={decoded} />
  );
};

ReactDOM.render(<App />, document.getElementById('root'));
