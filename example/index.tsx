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
  useRouteMatch,
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
          <Route exact path="/">
            <HomePage />
          </Route>

          <PdfReaders />
          <Route path="/:version">
            <HtmlReaders />
          </Route>

          <Route path="*">
            <h1>404</h1>
            <p>Page not found. what</p>
          </Route>
        </Switch>
      </BrowserRouter>
    </ChakraProvider>
  );
};

const PdfReaders = () => {
  return (
    <Switch>
      <Route path={`/pdf`}>
        <WebReader
          webpubManifestUrl="/samples/pdf/single-resource-short.json"
          proxyUrl={pdfProxyUrl}
          pdfWorkerSrc={`${origin}/pdf-worker/pdf.worker.min.js`}
        />
      </Route>
      <Route path={`/pdf-large`}>
        <WebReader
          webpubManifestUrl="/samples/pdf/single-resource-long.json"
          proxyUrl={pdfProxyUrl}
          pdfWorkerSrc={`${origin}/pdf-worker/pdf.worker.min.js`}
        />
      </Route>
      <Route path={`/pdf-collection`}>
        <WebReader
          webpubManifestUrl="/samples/pdf/multi-resource.json"
          proxyUrl={pdfProxyUrl}
          pdfWorkerSrc={`${origin}/pdf-worker/pdf.worker.min.js`}
        />
      </Route>
      <Route path={`/fixed-height-embedded-pdf-collection`}>
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
      <Route path={`/growing-height-embedded-pdf-collection`}>
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
    </Switch>
  );
};

/**
 * Allows switching between v1 and v2 of the HTML reader.
 */
const HtmlReaders = () => {
  const { path } = useRouteMatch();
  const { version = 'v1' } = useParams<{ version: string | undefined }>();
  const useCustomHtmlRenderer = version === 'v2';
  console.log('Using Version: ', version);

  return (
    <Switch>
      <Route path={`${path}/axisnow-encrypted`}>
        <AxisNowEncrypted
          _useCustomHtmlRenderer={useCustomHtmlRenderer}
          injectables={htmlInjectables}
        />
      </Route>
      <Route path={`${path}/axisnow-decrypted`}>
        <WebReader
          injectables={htmlInjectables}
          webpubManifestUrl={`${origin}/samples/dickens-axisnow/decrypted/manifest.json`}
          _useCustomHtmlRenderer={useCustomHtmlRenderer}
        />
      </Route>
      <Route path={`${path}/moby-epub2`}>
        <WebReader
          injectables={htmlInjectables}
          webpubManifestUrl={`${origin}/samples/moby-epub2-exploded/manifest.json`}
          _useCustomHtmlRenderer={useCustomHtmlRenderer}
        />
      </Route>
      <Route path={`${path}/fixed-height-embedded-moby-epub2`}>
        <Box bg="lavenderblush" p={6} w="100vw">
          <Heading>Fixed-height Embedded Example</Heading>
          <Text as="p">
            This example shows how a web reader looks embedded within a page
            instead of taking over the full page. It is fixed height, which
            means it will not grow to fit content in scrolling mode..
          </Text>
          <WebReader
            injectables={htmlInjectables}
            webpubManifestUrl={`${origin}/samples/moby-epub2-exploded/manifest.json`}
            growWhenScrolling={false}
            height="70vh"
            _useCustomHtmlRenderer={useCustomHtmlRenderer}
          />
          <Heading>The page continues...</Heading>
          <Text as="p">Here is some more content below the reader</Text>
        </Box>
      </Route>
      <Route path={`${path}/growing-embedded-moby-epub2`}>
        <Box bg="lavenderblush" p={6} w="100vw">
          <Heading>Growing-height Embedded Example</Heading>
          <Text as="p">
            This example shows how a web reader looks embedded within a page and
            with a growing-height policy. This example lets the PDF grow to fit
            content of the resource in scrolling mode. In paginated mode,
            however, it will use the value of the `height` prop.
          </Text>
          <WebReader
            injectables={htmlInjectables}
            webpubManifestUrl={`${origin}/samples/moby-epub2-exploded/manifest.json`}
            _useCustomHtmlRenderer={useCustomHtmlRenderer}
          />
          <Heading>The page continues...</Heading>
          <Text as="p">Here is some more content below the reader</Text>
        </Box>
      </Route>
      <Route path={`${path}/streamed-alice-epub`}>
        <WebReader
          injectables={htmlInjectables}
          webpubManifestUrl="https://alice.dita.digital/manifest.json"
          _useCustomHtmlRenderer={useCustomHtmlRenderer}
        />
      </Route>
      <Route path={`${path}/readium-css-docs`}>
        <WebReader
          injectables={htmlInjectables}
          webpubManifestUrl={`${origin}/samples/ReadiumCSS-docs/manifest.json`}
          _useCustomHtmlRenderer={useCustomHtmlRenderer}
        />
      </Route>
      <Route path={`${path}/url/:manifestUrl`}>
        <DynamicReader _useCustomHtmlRenderer={useCustomHtmlRenderer} />
      </Route>
      <Route path={`${path}/test`}>
        <Tests _useCustomHtmlRenderer={useCustomHtmlRenderer} />
      </Route>
    </Switch>
  );
};

const ReaderLink: React.FC<{ to: string }> = ({ to, children }) => {
  // don't show for pdfs
  const isPdf = to.includes('pdf');
  return (
    <Stack direction="row">
      <Link to={`/v1${to}`}>{children}</Link>
      {!isPdf && (
        <span>
          - (<Link to={`/v2${to}`}>v2</Link>)
        </span>
      )}
    </Stack>
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
              <ReaderLink to="/moby-epub2">Moby Dick </ReaderLink>
            </ListItem>
          </UnorderedList>
        </ListItem>
        <ListItem>
          EPUB3 Based Webpubs
          <UnorderedList>
            <ListItem>
              <ReaderLink to="/moby-epub3">Moby Dick (EPUB 3)</ReaderLink>
            </ListItem>
            <ListItem>
              <ReaderLink to="/readium-css-docs">
                Readium CSS Documentation (as Webpub)
              </ReaderLink>
            </ListItem>
          </UnorderedList>
        </ListItem>
        <ListItem>
          Remote hosted WebPubs
          <UnorderedList>
            <ListItem>
              <ReaderLink to="streamed-alice-epub">
                Alice's Adventures in Wonderland
              </ReaderLink>
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
              <Link to="/fixed-height-embedded-moby-epub2">
                Fixed-height Embedded Moby Dick
              </Link>
            </ListItem>
            <ListItem>
              <Link to="/growing-embedded-moby-epub2">
                Growing-height Embedded Moby Dick
              </Link>
            </ListItem>
          </UnorderedList>
        </ListItem>
        <ListItem>
          PDFs
          <UnorderedList>
            <ListItem>
              <ReaderLink to="/pdf">Single-PDF Webpub</ReaderLink>
            </ListItem>
            <ListItem>
              <ReaderLink to="/pdf-large">
                Single-PDF Webpub (large file)
              </ReaderLink>
            </ListItem>
            <ListItem>
              <ReaderLink to="/pdf-collection">Multi-PDF Webpub</ReaderLink>
            </ListItem>
            <ListItem>
              <Link to="/fixed-height-embedded-pdf-collection">
                Fixed-height embedded PDF
              </Link>
            </ListItem>
            <ListItem>
              <Link to="/growing-height-embedded-pdf-collection">
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
            <Button as={Link} to={`v1/url/${encodeURIComponent(dynamicHref)}`}>
              V1
            </Button>
            <Button as={Link} to={`v2/url/${encodeURIComponent(dynamicHref)}`}>
              V2
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
          <ReaderLink to="/axisnow-encrypted">
            AxisNow Encrypted EPUB
          </ReaderLink>
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
          <ReaderLink to="/axisnow-decrypted">
            Decrypted AxisNow EPUB
          </ReaderLink>
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

const DynamicReader: React.FC<{ _useCustomHtmlRenderer: boolean }> = ({
  _useCustomHtmlRenderer = false,
}) => {
  const { manifestUrl } = useParams<{ manifestUrl: string }>();
  const decoded = decodeURIComponent(manifestUrl);
  return (
    <WebReader
      injectables={htmlInjectables}
      webpubManifestUrl={decoded}
      _useCustomHtmlRenderer={_useCustomHtmlRenderer}
    />
  );
};

ReactDOM.render(<App />, document.getElementById('root'));
