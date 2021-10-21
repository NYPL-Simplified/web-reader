import * as React from 'react';
import { Route, useRouteMatch } from 'react-router';
import { Switch } from 'react-router-dom';
import WebReader from '../src';

export default function Tests(): JSX.Element {
  const { path } = useRouteMatch();

  return (
    <Switch>
      <Route exact path={path}>
        <p>
          This route is for testing purposes. Please render one of the
          sub-routes.
        </p>
      </Route>
      <Route path={`${path}/get-content`}>
        <WebReader
          webpubManifestUrl={`${origin}/samples/moby-epub2-exploded/manifest.json`}
          getContent={async (url) => {
            return `<p>url: ${url}</p>`;
          }}
        />
      </Route>
      <Route path={`${path}/no-injectables`}>
        <WebReader
          webpubManifestUrl={'https://alice.dita.digital/manifest.json'}
        />
      </Route>
      <Route path={`${path}/with-injectables`}>
        <WebReader
          webpubManifestUrl={'https://alice.dita.digital/manifest.json'}
          injectables={[
            {
              type: 'style',
              url: `${origin}/fonts/opensyslexic/opendyslexic.css`,
              fontFamily: 'opendyslexic',
            },
            {
              type: 'style',
              url: `${origin}/css/sample.css`,
            },
          ]}
        />
      </Route>
      <Route path={`${path}/unparsable-manifest`}>
        <WebReader
          webpubManifestUrl={`${origin}/samples/test/unparsable-manifest.json`}
        />
      </Route>
      <Route path={`${path}/missing-resource`}>
        <WebReader
          webpubManifestUrl={`${origin}/samples/test/missing-resource.json`}
        />
      </Route>
      <Route path={`${path}/*`}>
        <h1>404</h1>
        <p>Page not found.</p>
      </Route>
    </Switch>
  );
}
