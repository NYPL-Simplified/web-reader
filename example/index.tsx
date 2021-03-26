import 'react-app-polyfill/ie11';
import 'regenerator-runtime/runtime';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { BrowserRouter, Switch, Route, Link } from 'react-router-dom';
import WebReader from '../src';
import R2Reader from '../src/R2dComponent';
import { AxisNowEpubMimeType, GetContent } from '../src/types';
import { initDecryptor, makeGetContent } from '../src/decrypt';

const AxisNowEpub = () => {
  const [getContent, setGetContent] = React.useState<GetContent | null>(null);

  React.useEffect(() => {
    initDecryptor().then((decryptor) => {
      setGetContent(() => makeGetContent(decryptor));
    });
  }, []);
  console.log('get content', getContent);

  if (!getContent) return <div>"Loading Decryptor..."</div>;

  return (
    <WebReader
      webpubManifestUrl="http://localhost:1234/axisnow-webpub/manifest.json"
      format={AxisNowEpubMimeType}
      getContent={getContent}
    />
  );
};

const App = () => {
  return (
    <BrowserRouter>
      <Switch>
        <Route path="/r2">
          <R2Reader />
        </Route>
        <Route path="/pdf">
          <WebReader
            // entrypoint="/pdfManifest.json"
            webpubManifestUrl="https://sfr-files-development.s3.amazonaws.com/manifests/muse/muse13454.json"
            format="application/pdf+json"
          />
        </Route>
        <Route path="/axisnow-epub">
          <AxisNowEpub />
        </Route>
        <Route path="/streamed-epub">
          <WebReader
            webpubManifestUrl="https://alice.dita.digital/manifest.json"
            format="application/webpub"
          />
        </Route>
        <Route path="/epub">
          <WebReader webpubManifestUrl="/moby.epub" format="application/epub" />
        </Route>
        <Route path="/">
          <h1>Web Reader Proof of Concept</h1>
          <ul>
            <li>
              <Link to="/axisnow-epub">Encrypted ePub Example</Link>
            </li>
            <li>
              <Link to="/streamed-epub">Streamed ePub Example</Link>
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
