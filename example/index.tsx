import 'react-app-polyfill/ie11';
import 'regenerator-runtime/runtime';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { BrowserRouter, Switch, Route, Link } from 'react-router-dom';
import WebReader from '../src';
import { GetContent } from '../src/types';
import '@nypl/design-system-react-components/dist/styles.css';
import {
  ChakraProvider,
  Heading,
  UnorderedList,
  ListItem,
} from '@chakra-ui/react';
import theme from '../src/ui/theme';

const AxisNowEpub = () => {
  const [getContent, setGetContent] = React.useState<GetContent | null>(null);

  React.useEffect(() => {
    // get content
  }, []);

  if (!getContent) return <div>"Loading Decryptor..."</div>;

  return (
    <WebReader
      webpubManifestUrl="http://localhost:1234/samples/axisnow/encrypted/manifest.json"
      getContent={getContent}
    />
  );
};

const SWTest = () => {
  const [value, setValue] = React.useState<null | string>(null);
  React.useEffect(() => {
    fetch('http://localhost:1234/samples/pdf/degruyter.json').then((res) => {
      res.text().then((text) => {
        setValue(text);
      });
    });
  });

  return <div>{value}</div>;
};

const App = () => {
  return (
    <ChakraProvider theme={theme}>
      <BrowserRouter>
        <Switch>
          <Route path="/pdf">
            <WebReader webpubManifestUrl="http://localhost:1234/samples/pdf/degruyter.json" />
          </Route>
          <Route path="/swtest">
            <SWTest />
          </Route>
          <Route path="/axisnow-encrypted">
            <AxisNowEpub />
          </Route>
          <Route path="/axisnow-decrypted">
            <WebReader webpubManifestUrl="http://localhost:1234/samples/axisnow/decrypted/manifest.json" />
          </Route>
          <Route path="/moby-epub2">
            <WebReader webpubManifestUrl="http://localhost:1234/samples/moby-epub2-exploded/manifest.json" />
          </Route>
          <Route path="/streamed-epub">
            <WebReader webpubManifestUrl="https://alice.dita.digital/manifest.json" />
          </Route>
          <Route path="/">
            <Heading as="h1">Web Reader Proof of Concept</Heading>
            <UnorderedList p={4}>
              <ListItem>
                <Link to="/axisnow-encrypted">Encrypted EPUB Example</Link>
              </ListItem>
              <ListItem>
                <Link to="/swtest">SW Test</Link>
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
                <Link to="/pdf">Pdf Collection Example</Link>
              </ListItem>
            </UnorderedList>
          </Route>
        </Switch>
      </BrowserRouter>
    </ChakraProvider>
  );
};

ReactDOM.render(<App />, document.getElementById('root'));
