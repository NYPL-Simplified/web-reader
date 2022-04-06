import React from 'react';
import {
  LOCAL_STORAGE_LOCATION_KEY_PREFIX,
  LOCAL_STORAGE_SETTINGS_KEY,
} from '../constants';
import { HtmlState } from '../HtmlReader/types';
import { Locator } from '../Readium/Locator';
import { ReaderArguments, ReaderSettings } from '../types';

/**
 * Use getLocalStorageLocation to get the location when
 * initializing the reducer. useUpdateLocalStorage will set
 * values in local storage as they change.
 *
 * TODO:
 *  - PDF Sync
 *  - how to handle non backwards compatible updates
 */

const lsLocationKey = (identifier: string): string =>
  `${LOCAL_STORAGE_LOCATION_KEY_PREFIX}${identifier}`;

export type LSLocationRecord = {
  location: Locator;
  createdAt: number;
};

export function getLocalStorageLocation(
  identifier: string,
  args: ReaderArguments
): LSLocationRecord | undefined {
  if (!args?.persistLastLocation) return undefined;
  const locationKey = lsLocationKey(identifier);
  const item = localStorage.getItem(locationKey);
  if (item) {
    const record: LSLocationRecord = JSON.parse(item);
    return record;
  }
  return undefined;
}

export function getLocalStorageSettings(
  args: ReaderArguments
): ReaderSettings | undefined {
  if (!args?.persistSettings) return undefined;
  const item = localStorage.getItem(LOCAL_STORAGE_SETTINGS_KEY);
  if (item) {
    const settings: ReaderSettings = JSON.parse(item);
    return settings;
  }
  return undefined;
}

export default function useUpdateLocalStorage(
  identifier: string | null,
  state: HtmlState,
  args: ReaderArguments
): void {
  /**
   * Keep location up to date as the state changes
   */
  React.useEffect(() => {
    if (!identifier || !args?.persistLastLocation) return;
    const locationKey = lsLocationKey(identifier);
    if (state.location) {
      const record: LSLocationRecord = {
        createdAt: Date.now(),
        location: state.location,
      };
      const val = JSON.stringify(record);
      localStorage.setItem(locationKey, val);
    }
  }, [state.location, identifier, args?.persistLastLocation]);

  /**
   * Keep settings up to date
   */
  React.useEffect(() => {
    if (!identifier || !state.settings || !args?.persistSettings) return;
    const settings: ReaderSettings = {
      fontSize: state.settings.fontSize,
      fontFamily: state.settings.fontFamily,
      colorMode: state.settings.colorMode,
      isScrolling: state.settings.isScrolling,
    };
    const val = JSON.stringify(settings);
    localStorage.setItem(LOCAL_STORAGE_SETTINGS_KEY, val);
  }, [state.settings, identifier, args?.persistSettings]);
}
