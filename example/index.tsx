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
import '@nypl/design-system-react-components/dist/styles.css';
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
import { pdfjs } from 'react-pdf';
// import createDecryptor from './axisnow/createWorkerlessDecryptor';
import createDecryptor from './axisnow/createWorkerDecryptor';
import { GetContent } from '../src/types';

const origin = window.location.origin;

// react-pdf web worker config with their default CDN version
pdfjs.GlobalWorkerOptions.workerSrc = `${origin}/pdf-worker/pdf.worker.min.js`;

const pdfProxyUrl = process.env.CORS_PROXY_URL as string | undefined;

const App = () => {
  const [dynamicHref, setValue] = React.useState('');
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) =>
    setValue(event.target.value);
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
              webpubManifestUrl={`${origin}/samples/dickens-axisnow/decrypted/manifest.json`}
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
          <Route path="/url/:manifestUrl">
            <DynamicReader />
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
          <Route path="*">
            <h1>404</h1>
            <p>Page not found.</p>
          </Route>
        </Switch>
      </BrowserRouter>
    </ChakraProvider>
  );
};

const DynamicReader: React.FC = () => {
  const { manifestUrl } = useParams<{ manifestUrl: string }>();
  const decoded = decodeURIComponent(manifestUrl);
  return <WebReader webpubManifestUrl={decoded} />;
};

/**
 * This sample shows setting up a decryptor for this specific book and then passing a
 * getContent function to the Web Reader. This getContent function runs in a separate
 * WebWorker thread to decrypt the HTML and any embedded resources within.
 */
const AxisNowEncrypted: React.FC = () => {
  const [getContent, setGetContent] = React.useState<null | GetContent>(null);
  const [error, setError] = React.useState<Error | undefined>(undefined);

  const book_vault_uuid = process.env.AXISNOW_VAULT_UUID;
  const isbn = process.env.AXISNOW_ISBN;

  React.useEffect(() => {
    if (!book_vault_uuid || !isbn) {
      setError(
        new Error(
          'Book cannot be decrypted without process.env.AXISNOW_VAULT_UUID and process.env.AXISNOW_ISBN'
        )
      );
      return;
    }

    const params = {
      book_vault_uuid,
      isbn,
    };

    createDecryptor(params)
      .then((decr) => {
        setGetContent(() => decr);
      })
      .catch(setError);
  }, [book_vault_uuid, isbn]);

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
      webpubManifestUrl={`${origin}/samples/dickens-axisnow/encrypted/manifest.json`}
      getContent={getContent}
    />
  );
};

// const url =
//   'http://localhost:3000/api/axisnow/{isbn}/{vault_uuid}';
// const RemoteAxisNowEncrypted: React.FC = () => {
//   const [getContent, setGetContent] = React.useState<null | GetContent>(null);
//   const [error, setError] = React.useState<Error | undefined>(undefined);

//   const book_vault_uuid = "vault_uuid";
//   const isbn = 'isbn';

//   React.useEffect(() => {
//     if (!book_vault_uuid || !isbn) {
//       setError(
//         new Error(
//           'Book cannot be decrypted without process.env.AXISNOW_VAULT_UUID and process.env.AXISNOW_ISBN'
//         )
//       );
//       return;
//     }

//     const params = {
//       book_vault_uuid,
//       isbn,
//     };

//     createDecryptor(params)
//       .then((decr) => {
//         setGetContent(() => decr);
//       })
//       .catch(setError);
//   }, [book_vault_uuid, isbn]);

//   if (error) {
//     return (
//       <Box m={3} role="alert">
//         <Heading as="h1" fontSize="lg">
//           Something went wrong:
//         </Heading>
//         <Text>
//           {error.name}: {error.message}
//         </Text>
//       </Box>
//     );
//   }

//   if (!getContent) return <div>loading...</div>;

//   return <WebReader webpubManifestUrl={url} getContent={getContent} />;
// };

ReactDOM.render(<App />, document.getElementById('root'));
