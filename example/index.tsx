import 'react-app-polyfill/ie11';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { WebReader } from '../.';

const MOBY_DICK_MANIFEST = "https://hadriengardeur.github.io/webpub-manifest/examples/MobyDick/manifest.json";

const App = () => {
  return (
    <div>
      <WebReader manifestUrl={MOBY_DICK_MANIFEST} type="webpub" />
    </div>
  );
};

ReactDOM.render(<App />, document.getElementById('root'));
