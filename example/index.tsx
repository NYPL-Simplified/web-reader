import 'react-app-polyfill/ie11';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { BrowserRouter, Switch, Route, Link } from 'react-router-dom';
import WebReader from '../src';
import R2Reader from '../src/R2dComponent';

const App = () => {
  // return <EpubComponent entrypoint="/moby.epub" />;
  return (
    <BrowserRouter>
      <Switch>
        <Route path="/pdf">
          <WebReader
            // entrypoint="/pdfManifest.json"
            entrypoint="https://sfr-files-development.s3.amazonaws.com/manifests/muse/muse13454.json"
            format="application/pdf+json"
          />
        </Route>
        <Route path="/R2">
          <R2Reader />
        </Route>
        <Route path="/webpub">
          TBD
          {/* <WebReader
            entrypoint="/webpubManifest.json"
            format="application/webpub"
          /> */}
        </Route>
        <Route path="/epub">
          <WebReader entrypoint="/moby.epub" format="application/epub" />
        </Route>
        <Route path="/">
          <h1>Web Reader Proof of Concept</h1>
          <ul>
            <li>
              <Link to="/R2">R2 Example</Link>
            </li>
            <li>
              <Link to="/epub">Epub Example</Link>
            </li>
            <li>
              <Link to="/pdf">Pdf Example</Link>
            </li>
            <li>
              <Link to="/webpub">Webpub Example</Link>
            </li>
          </ul>
        </Route>
      </Switch>
    </BrowserRouter>
  );
};

ReactDOM.render(<App />, document.getElementById('root'));
