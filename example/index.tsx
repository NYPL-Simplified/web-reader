import 'react-app-polyfill/ie11';
import 'regenerator-runtime/runtime';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { BrowserRouter, Switch, Route, Link } from 'react-router-dom';
import WebReader from '../src';
import { GetContent } from '../src/types';
import { initDecryptor, makeGetContent } from '../src/utils/decryptAxisNow';

const AxisNowEpub = () => {
  const [getContent, setGetContent] = React.useState<GetContent | null>(null);

  React.useEffect(() => {
    initDecryptor().then((decryptor) => {
      setGetContent(() => makeGetContent(decryptor));
    });
  }, []);

  if (!getContent) return <div>"Loading Decryptor..."</div>;

  return (
    <WebReader
      webpubManifestUrl="http://localhost:1234/axisnow-webpub/manifest.json"
      getContent={getContent}
    />
  );
};

const App = () => {
  return (
    <BrowserRouter>
      <Switch>
        <Route path="/pdf">
          <WebReader webpubManifestUrl="/muse13454.json" />
        </Route>
        <Route path="/axisnow-epub">
          <AxisNowEpub />
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
              <Link to="/axisnow-epub">Encrypted ePub Example</Link>
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
  );
};

ReactDOM.render(<App />, document.getElementById('root'));
