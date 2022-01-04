import React from 'react';
import { Locator } from '../Readium/Locator';
import { HtmlAction, HtmlState } from './types';

const LOCATION_QUERY_TITLE = 'location';

/**
 * Keep the Location state in the browser's url bar.
 * Dispatch location changed when the url changes.
 */
export default function useLocationQuery(
  state: HtmlState,
  dispatch: React.Dispatch<HtmlAction>
): void {
  const { location, isIframeLoaded } = state;
  React.useEffect(() => {
    if (isIframeLoaded) updateQuery(location);
  }, [location, isIframeLoaded]);
}

function updateQuery(location: Locator | undefined) {
  const current = window.location.href;
  const url = new URL(current);
  if (location) {
    url.searchParams.set(LOCATION_QUERY_TITLE, JSON.stringify(location));
  } else {
    url.searchParams.delete(LOCATION_QUERY_TITLE);
  }
  window.history.pushState({}, '', url);
}

export function getLocationQuery(): Locator | undefined {
  const search = window.location.search;
  const value = new URLSearchParams(search).get(LOCATION_QUERY_TITLE);
  if (!value) {
    return undefined;
  }
  try {
    const json = JSON.parse(value);
    return json;
  } catch (e) {
    return undefined;
  }
}
