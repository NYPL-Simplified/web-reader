import 'react-app-polyfill/ie11';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { BrowserRouter, Switch, Route, Link } from 'react-router-dom';
import { WebReader } from '../.';

const MOBY_DICK_MANIFEST =
  'https://hadriengardeur.github.io/webpub-manifest/examples/MobyDick/manifest.json';

const App = () => {
  return (
    <BrowserRouter>
      <Switch>
        <Route path="/pdf">
          <h1>PDF Example</h1>
          <WebReader manifestUrl={MOBY_DICK_MANIFEST} type="webpub" />
        </Route>
        <Route path="/webpub">
          <WebReader manifestUrl={MOBY_DICK_MANIFEST} type="webpub" />
        </Route>
        <Route path="/">
          <h1>Web Reader Proof of Concept</h1>
          <ul>
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
