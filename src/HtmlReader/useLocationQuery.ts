import React from 'react';
import { Locator } from '../Readium/Locator';
import { HtmlState } from './types';

const LOCATION_QUERY_TITLE = 'location';

/**
 * Keep the Location state in the browser's url bar.
 * Dispatch location changed when the url changes.
 */
export default function useLocationQuery(state: HtmlState): void {
  React.useEffect(() => {
    if (state.state === 'READY') updateQuery(state.location);
  }, [state.location, state.state]);
}

function updateQuery(newLocation: Locator | undefined) {
  const current = window.location.href;
  const url = new URL(current);
  const existingLocation = getLocationQuery();
  // determine if they differ
  if (areLocationsEqual(existingLocation, newLocation)) return;
  if (newLocation) {
    url.searchParams.set(LOCATION_QUERY_TITLE, JSON.stringify(newLocation));
  } else {
    url.searchParams.delete(LOCATION_QUERY_TITLE);
  }
  window.history.replaceState({}, '', url);
}

function areLocationsEqual(a: Locator | undefined, b: Locator | undefined) {
  if (!a && !b) return true;
  if (!a || !b) return false;
  return (
    a.href === b.href &&
    a.locations.position === b.locations.position &&
    a.locations.fragment === b.locations.fragment &&
    a.locations.progression === b.locations.progression &&
    a.locations.remainingPositions === b.locations.remainingPositions &&
    a.locations.totalProgression === b.locations.totalProgression &&
    a.locations.totalRemainingPositions === b.locations.totalRemainingPositions
  );
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
