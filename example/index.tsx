import 'react-app-polyfill/ie11';
import 'regenerator-runtime/runtime';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { BrowserRouter, Switch, Route, Link } from 'react-router-dom';
import WebReader from '../src';
import { GetContent } from '../src/types';
import '@nypl/design-system-react-components/dist/styles.css';
import { ChakraProvider } from '@chakra-ui/react';
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
    fetch('http://localhost:1234/samples/muse13454.json').then((res) => {
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
            <WebReader webpubManifestUrl="samples/muse13454.json" />
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
            <h1>Web Reader Proof of Concept</h1>
            <ul>
              <li>
                <Link to="/axisnow-encrypted">Encrypted EPUB Example</Link>
              </li>
              <li>
                <Link to="/swtest">SW Test</Link>
              </li>
              <li>
                <Link to="/axisnow-decrypted">Manually Decrypted EPUB</Link>
              </li>
              <li>
                <Link to="/moby-epub2">Moby EPUB2-based Webpub</Link>
              </li>
              <li>
                <Link to="/streamed-epub">Regular (streamed) ePub Example</Link>
              </li>
              <li>
                <Link to="/pdf">Pdf Example</Link>
              </li>
            </ul>
          </Route>
        </Switch>
      </BrowserRouter>
    </ChakraProvider>
  );
};

ReactDOM.render(<App />, document.getElementById('root'));
