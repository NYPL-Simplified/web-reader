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
      <Route path={`${path}/with-script-injectable`}>
        <WebReader
          webpubManifestUrl={'https://alice.dita.digital/manifest.json'}
          injectablesReflowable={[
            {
              type: 'script',
              url: `${origin}/js/sample.js`,
            },
          ]}
          injectablesFixed={[]}
        />
      </Route>
      <Route path={`${path}/with-reflowable-layout`}>
        <WebReader
          webpubManifestUrl={'https://alice.dita.digital/manifest.json'}
          injectablesReflowable={[
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
          injectablesFixed={[]}
        />
      </Route>
      <Route path={`${path}/with-fixed-layout`}>
        <WebReader
          webpubManifestUrl={`${origin}/samples/fixed-layout/manifest.json`}
          injectablesReflowable={[
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
          injectablesFixed={[]}
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
      <Route path={`${path}/missing-injectable`}>
        <WebReader
          webpubManifestUrl={`${origin}/samples/moby-epub2-exploded/manifest.json`}
          injectablesReflowable={[
            { type: 'style', url: `http://example.com/doesnt-exist.css` },
          ]}
        />
      </Route>
      <Route path={`${path}/missing-toc`}>
        <WebReader
          webpubManifestUrl={`${origin}/samples/test/missing-toc.json`}
          getContent={async (_) => {
            return `<!DOCTYPE html><html><head></head><body><h1>This manifest is missing Table of Contents</h1></body></html>`;
          }}
        />
      </Route>
      <Route path={`${path}/*`}>
        <h1>404</h1>
        <p>Page not found.</p>
      </Route>
    </Switch>
  );
}
