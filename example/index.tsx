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
  Button,
  Stack,
} from '@chakra-ui/react';
import { getTheme } from '../src/ui/theme';
import usePublicationSW from '../src/ServiceWorker/client';
import AxisNowEncrypted from './axisnow-encrypted';
import readiumBefore from 'url:../src/HtmlReader/ReadiumCss/ReadiumCSS-before.css';
import readiumDefault from 'url:../src/HtmlReader/ReadiumCss/ReadiumCSS-default.css';
import readiumAfter from 'url:../src/HtmlReader/ReadiumCss/ReadiumCSS-after.css';
import Tests from './Tests';
import { Injectable } from '../src/Readium/Injectable';

const origin = window.location.origin;

const pdfProxyUrl = process.env.CORS_PROXY_URL as string | undefined;

const cssInjectables: Injectable[] = [
  {
    type: 'style',
    url: readiumBefore,
  },
  {
    type: 'style',
    url: readiumDefault,
  },
  {
    type: 'style',
    url: readiumAfter,
  },
];

const fontInjectable: Injectable = {
  type: 'style',
  url: `${origin}/fonts/opendyslexic/opendyslexic.css`,
  fontFamily: 'opendyslexic',
};

const htmlInjectablesReflowable = [...cssInjectables, fontInjectable];

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
          <Route exact path="/">
            <HomePage />
          </Route>

          <Route path="/pdf">
            <PdfReaders />
          </Route>
          <Route path="/html">
            <HtmlReaders />
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

const PdfReaders = () => {
  return (
    <>
      <Route path={`/pdf/single-resource-short`}>
        <WebReader
          webpubManifestUrl="/samples/pdf/single-resource-short.json"
          proxyUrl={pdfProxyUrl}
          pdfWorkerSrc={`${origin}/pdf-worker/pdf.worker.min.js`}
        />
      </Route>
      <Route path={`/pdf/large`}>
        <WebReader
          webpubManifestUrl="/samples/pdf/single-resource-long.json"
          proxyUrl={pdfProxyUrl}
          pdfWorkerSrc={`${origin}/pdf-worker/pdf.worker.min.js`}
        />
      </Route>
      <Route path={`/pdf/collection`}>
        <WebReader
          webpubManifestUrl="/samples/pdf/multi-resource.json"
          proxyUrl={pdfProxyUrl}
          pdfWorkerSrc={`${origin}/pdf-worker/pdf.worker.min.js`}
        />
      </Route>
      <Route path={`/pdf/fixed-height-embedded-collection`}>
        <Box bg="lavenderblush" p={6} w="100vw">
          <Heading>Fixed-height Embedded PDF</Heading>
          <Text as="p">
            This example shows how a web reader looks embedded within a page
            instead of taking over the full page. It is fixed height, which
            means it will not grow to fit content in scrolling mode.
          </Text>
          <WebReader
            webpubManifestUrl={`${origin}/samples/pdf/multi-resource.json`}
            proxyUrl={pdfProxyUrl}
            pdfWorkerSrc={`${origin}/pdf-worker/pdf.worker.min.js`}
            growWhenScrolling={false}
          />
          <Heading>The page continues...</Heading>
          <Text as="p">Here is some more content below the reader</Text>
        </Box>
      </Route>
      <Route path={`/pdf/growing-height-embedded-collection`}>
        <Box bg="lavenderblush" p={6} w="100vw">
          <Heading>Growing-height Embedded PDF</Heading>
          <Text as="p">
            This example shows how a web reader looks embedded within a page
            instead of taking over the full page. This example lets the PDF grow
            to fit content of the resource in scrolling mode. In paginated mode,
            however, it will use the value of the `height` prop.
          </Text>
          <WebReader
            webpubManifestUrl={`${origin}/samples/pdf/multi-resource.json`}
            proxyUrl={pdfProxyUrl}
            pdfWorkerSrc={`${origin}/pdf-worker/pdf.worker.min.js`}
          />
          <Heading>The page continues...</Heading>
          <Text as="p">Here is some more content below the reader</Text>
        </Box>
      </Route>
    </>
  );
};

const HtmlReaders = () => {
  return (
    <Switch>
      <Route path={`/html/axisnow-encrypted`}>
        <AxisNowEncrypted injectables={htmlInjectablesReflowable} />
      </Route>
      <Route path={`/html/axisnow-decrypted`}>
        <WebReader
          injectablesReflowable={htmlInjectablesReflowable}
          webpubManifestUrl={`${origin}/samples/dickens-axisnow/decrypted/manifest.json`}
        />
      </Route>
      <Route path={`/html/moby-epub2`}>
        <WebReader
          injectablesReflowable={htmlInjectablesReflowable}
          webpubManifestUrl={`${origin}/samples/moby-epub2-exploded/manifest.json`}
        />
      </Route>
      <Route path={`/html/moby-epub3`}>
        <WebReader
          injectablesReflowable={htmlInjectablesReflowable}
          webpubManifestUrl={`${origin}/samples/moby-epub3-exploded/manifest.json`}
        />
      </Route>
      <Route path={`/html/moby-epub3-no-local-storage`}>
        <WebReader
          injectablesReflowable={htmlInjectablesReflowable}
          persistLastLocation={false}
          persistSettings={false}
          webpubManifestUrl={`${origin}/samples/moby-epub3-exploded/manifest.json`}
        />
      </Route>
      <Route path={`/html/fixed-layout`}>
        <WebReader
          injectablesReflowable={htmlInjectablesReflowable}
          webpubManifestUrl={`${origin}/samples/fixed-layout/manifest.json`}
        />
      </Route>
      <Route path={`/html/fxl-poems`}>
        <WebReader
          injectablesReflowable={htmlInjectablesReflowable}
          webpubManifestUrl={`${origin}/samples/fxl-poems/manifest.json`}
        />
      </Route>
      <Route path={`/html/fixed-height-embedded-moby-epub2`}>
        <Box bg="lavenderblush" p={6} w="100vw">
          <Heading>Fixed-height Embedded Example</Heading>
          <Text as="p">
            This example shows how a web reader looks embedded within a page
            instead of taking over the full page. It is fixed height, which
            means it will not grow to fit content in scrolling mode..
          </Text>
          <WebReader
            injectablesReflowable={htmlInjectablesReflowable}
            webpubManifestUrl={`${origin}/samples/moby-epub2-exploded/manifest.json`}
            growWhenScrolling={false}
            height="70vh"
          />
          <Heading>The page continues...</Heading>
          <Text as="p">Here is some more content below the reader</Text>
        </Box>
      </Route>
      <Route path={`/html/growing-embedded-moby-epub2`}>
        <Box bg="lavenderblush" p={6} w="100vw">
          <Heading>Growing-height Embedded Example</Heading>
          <Text as="p">
            This example shows how a web reader looks embedded within a page and
            with a growing-height policy. This example lets the PDF grow to fit
            content of the resource in scrolling mode. In paginated mode,
            however, it will use the value of the `height` prop.
          </Text>
          <WebReader
            injectablesReflowable={htmlInjectablesReflowable}
            webpubManifestUrl={`${origin}/samples/moby-epub2-exploded/manifest.json`}
          />
          <Heading>The page continues...</Heading>
          <Text as="p">Here is some more content below the reader</Text>
        </Box>
      </Route>
      <Route path={`/html/streamed-alice-epub`}>
        <WebReader
          injectablesReflowable={htmlInjectablesReflowable}
          webpubManifestUrl="https://alice.dita.digital/manifest.json"
        />
      </Route>
      <Route path={`/html/readium-css-docs`}>
        <WebReader
          injectablesReflowable={htmlInjectablesReflowable}
          webpubManifestUrl={`${origin}/samples/ReadiumCSS-docs/manifest.json`}
        />
      </Route>
      <Route path={`/html/url/:manifestUrl`}>
        <DynamicReader />
      </Route>
      <Route path={`/html/test`}>
        <Tests />
      </Route>
    </Switch>
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
              <Link to="/html/moby-epub2">Moby Dick </Link>
            </ListItem>
          </UnorderedList>
        </ListItem>
        <ListItem>
          EPUB3 Based Webpubs
          <UnorderedList>
            <ListItem>
              <Link to="/html/moby-epub3">Moby Dick (EPUB 3)</Link>
            </ListItem>
            <ListItem>
              <Link to="/html/moby-epub3-no-local-storage">
                Moby Dick (EPUB 3)
              </Link>{' '}
              - does not persist location or settings to local storage
            </ListItem>
            <ListItem>
              <Link to="/html/readium-css-docs">
                Readium CSS Documentation (as Webpub)
              </Link>
            </ListItem>
            <ListItem>
              <Link to="/html/fixed-layout">Fixed Layout (Illustrated)</Link>
            </ListItem>
            <ListItem>
              <Link to="/html/fxl-poems">Fixed Layout (Poems)</Link>
            </ListItem>
          </UnorderedList>
        </ListItem>
        <ListItem>
          Remote hosted WebPubs
          <UnorderedList>
            <ListItem>
              <Link to="/html/streamed-alice-epub">
                Alice's Adventures in Wonderland
              </Link>
              <Text as="i">
                &nbsp;(streamed from https://alice.dita.digital)
              </Text>
            </ListItem>
          </UnorderedList>
        </ListItem>
        <ListItem>
          Embedded Reader
          <UnorderedList>
            <ListItem>
              <Link to="/html/fixed-height-embedded-moby-epub2">
                Fixed-height Embedded Moby Dick
              </Link>
            </ListItem>
            <ListItem>
              <Link to="/html/growing-embedded-moby-epub2">
                Growing-height Embedded Moby Dick
              </Link>
            </ListItem>
          </UnorderedList>
        </ListItem>
        <ListItem>
          PDFs
          <UnorderedList>
            <ListItem>
              <Link to="/pdf/single-resource-short">Single-PDF Webpub</Link>
            </ListItem>
            <ListItem>
              <Link to="/pdf/large">Single-PDF Webpub (large file)</Link>
            </ListItem>
            <ListItem>
              <Link to="/pdf/collection">Multi-PDF Webpub</Link>
            </ListItem>
            <ListItem>
              <Link to="/pdf/fixed-height-embedded-collection">
                Fixed-height embedded PDF
              </Link>
            </ListItem>
            <ListItem>
              <Link to="/pdf/growing-height-embedded-collection">
                Growing-height embedded PDF
              </Link>
            </ListItem>
          </UnorderedList>
        </ListItem>
        <ListItem>
          Bring your own manifest:
          <Stack direction="row" alignItems="center">
            <Input
              maxW={500}
              value={dynamicHref}
              onChange={handleChange}
              placeholder="Webpub Manifest URL"
              mr={2}
            />
            <Button
              as={Link}
              to={`/html/url/${encodeURIComponent(dynamicHref)}`}
            >
              Go
            </Button>
          </Stack>
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
          <Link to="/html/axisnow-encrypted">AxisNow Encrypted EPUB</Link>
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
          <Link to="/html/axisnow-decrypted">Decrypted AxisNow EPUB</Link>
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
    <WebReader
      injectablesReflowable={htmlInjectablesReflowable}
      proxyUrl={pdfProxyUrl}
      pdfWorkerSrc={`${origin}/pdf-worker/pdf.worker.min.js`}
      webpubManifestUrl={decoded}
    />
  );
};

ReactDOM.render(<App />, document.getElementById('root'));
