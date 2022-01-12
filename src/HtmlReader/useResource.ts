import React from 'react';
import { Injectable } from '../Readium/Injectable';
import { setCss } from './effects';
import { makeInjectableElement } from './lib';
import { HtmlState, HtmlAction } from './types';

/**
 * Fetches a resource whenever the url changes and dispatches
 * actions to keep the reducer up to date. Works similar to
 * useSWR, but storing the resource in the reducer state, not
 * separately.
 *
 * Also performs some modifications on the resource to add initial
 * css variables and injectables.
 */
export default function useResource(
  state: HtmlState,
  getContent: (url: string) => Promise<string>,
  injectables: Injectable[],
  dispatch: React.Dispatch<HtmlAction>
): void {
  const currentResourceUrl = state.location?.href ?? null;

  React.useEffect(() => {
    if (!currentResourceUrl) {
      return;
    }

    async function fetchResource(url: string) {
      try {
        const content = await getContent(url);
        const document = new DOMParser().parseFromString(content, 'text/html');
        // add base so relative URLs work.
        const base = document?.createElement('base');
        if (base && url) {
          base.setAttribute('href', url);
          document?.head.appendChild(base);
        }

        for (const injectable of injectables) {
          const element = makeInjectableElement(document, injectable);
          if (element) document?.head.appendChild(element);
        }

        injectJS(document.body);

        // set the initial CSS state
        setCss(document.documentElement, {
          colorMode: state.colorMode,
          fontSize: state.fontSize,
          fontFamily: state.fontFamily,
          isScrolling: state.isScrolling,
        });

        // inject js to communicate with iframe
        // injectJS(document);

        const finalResource = document.documentElement.outerHTML;
        dispatch({ type: 'RESOURCE_FETCH_SUCCESS', resource: finalResource });
      } catch (e) {
        if (e instanceof Error) {
          dispatch({ type: 'RESOURCE_FETCH_ERROR', error: e });
        } else {
          const message =
            typeof e === 'string'
              ? `Resource Fetch Error: ${e}`
              : 'Unknown Resource Fetch Error';
          dispatch({ type: 'RESOURCE_FETCH_ERROR', error: new Error(message) });
        }
      }
    }

    fetchResource(currentResourceUrl);

    // we specifically do _not_ want to re-run this on state changes
    // because that would rerun it every time a user changes settings.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentResourceUrl, getContent, dispatch, injectables]);
}

/**
 * Injects a script tag which intercepts link clicks and sends a message
 * to the parent iframe.
 */
function injectJS(body: HTMLElement) {
  const script = document.createElement('script');
  const content = `
      var links = document.querySelectorAll( 'a' );
      for ( var i = 0; i < links.length; i ++ ) {
            links[i].addEventListener('click', handleLinkClick);
          }
    function handleLinkClick(evt) {
        // don't navigate
        evt.preventDefault();
        // send message to parent
        window.parent.postMessage( { type: 'LINK_CLICKED', href: evt.target.href } );
    };
  `;
  script.innerHTML = content;

  body.appendChild(script);
}
