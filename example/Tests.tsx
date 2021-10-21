import * as React from 'react';
import { Route, useRouteMatch } from 'react-router';
import WebReader from '../src';

export default function Tests(): JSX.Element {
  const { path } = useRouteMatch();

  return (
    <>
      <Route exact path={path}>
        <p>
          This route is for testing purposes. Please render one of the
          sub-routes.
        </p>
      </Route>
      <Route path={`${path}/no-injectables`}>
        <WebReader
          webpubManifestUrl={`${origin}/samples/moby-epub2-exploded/manifest.json`}
        />
      </Route>
      <Route path={`${path}/with-injectables`}>
        <WebReader
          webpubManifestUrl={`${origin}/samples/moby-epub2-exploded/manifest.json`}
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
      <Route path={`${path}/get-content`}>
        <WebReader
          webpubManifestUrl={`${origin}/samples/moby-epub2-exploded/manifest.json`}
          getContent={async (url) => {
            return `<p>url: ${url}</p>`;
          }}
        />
      </Route>
    </>
  );
}
