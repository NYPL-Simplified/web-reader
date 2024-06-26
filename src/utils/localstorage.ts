import React from 'react';
import {
  LOCAL_STORAGE_LOCATIONS_KEY,
  LOCAL_STORAGE_SETTINGS_KEY,
} from '../constants';
import { HtmlReaderArguments, HtmlState } from '../HtmlReader/types';
import { Locator } from '../Readium/Locator';
import { ReaderSettings } from '../types';

export type LSLocation = {
  location: Locator;
  createdAt: number;
};

// we store all locations for books in a single object.
export type LSLocationsRecord = Record<string, LSLocation>;

/**
 * Use getLocalStorageLocation to get the location when
 * initializing the reducer. useUpdateLocalStorage will set
 * values in local storage as they change.
 */
export function getLocalStorageLocation(
  identifier: string,
  args: HtmlReaderArguments
): LSLocation | undefined {
  if (!args?.persistLastLocation) return undefined;
  const item = localStorage.getItem(LOCAL_STORAGE_LOCATIONS_KEY);
  if (item) {
    const record: LSLocationsRecord = JSON.parse(item);
    const location = record[identifier];
    return location;
  }
  return undefined;
}

export function getLocalStorageSettings(
  args: HtmlReaderArguments
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
  args: HtmlReaderArguments
): void {
  /**
   * Keep location up to date as the state changes
   */
  React.useEffect(() => {
    if (!identifier || !args?.persistLastLocation) return;
    if (state.location) {
      const record: LSLocation = {
        createdAt: Date.now(),
        location: state.location,
      };
      const existing = localStorage.getItem(LOCAL_STORAGE_LOCATIONS_KEY);
      if (existing) {
        const locationsRecord: LSLocationsRecord = JSON.parse(existing);
        locationsRecord[identifier] = record;
        localStorage.setItem(
          LOCAL_STORAGE_LOCATIONS_KEY,
          JSON.stringify(locationsRecord)
        );
      } else {
        const locationsRecord: LSLocationsRecord = {
          [identifier]: record,
        };
        localStorage.setItem(
          LOCAL_STORAGE_LOCATIONS_KEY,
          JSON.stringify(locationsRecord)
        );
      }
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

export function clearWebReaderLocalStorage(): void {
  localStorage.removeItem(LOCAL_STORAGE_LOCATIONS_KEY);
  localStorage.removeItem(LOCAL_STORAGE_SETTINGS_KEY);
}
