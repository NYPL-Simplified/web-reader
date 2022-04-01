import React from 'react';
import { HtmlState } from '../HtmlReader/types';
import { Locator } from '../Readium/Locator';
import { ReaderSettings } from '../types';

/**
 * Use getLocalStorageLocation to get the location when
 * initializing the reducer. useUpdateLocalStorage will set
 * values in local storage as they change.
 *
 * TODO:
 *  - PDF Sync
 *  - how to handle non backwards compatible updates
 */

const lsLocationKey = (webpubManifestUrl: string): string =>
  `web-reader-location-${webpubManifestUrl}`;

export type LSLocationRecord = {
  location: Locator;
  createdAt: number;
};

export function getLocalStorageLocation(
  webpubManifestUrl: string
): LSLocationRecord | undefined {
  const locationKey = lsLocationKey(webpubManifestUrl);
  const item = localStorage.getItem(locationKey);
  if (item) {
    const record: LSLocationRecord = JSON.parse(item);
    return record;
  }
  return undefined;
}

const LOCAL_STORAGE_SETTINGS_KEY = 'web-reader-settings';
export function getLocalStorageSettings(): ReaderSettings | undefined {
  const item = localStorage.getItem(LOCAL_STORAGE_SETTINGS_KEY);
  if (item) {
    const settings: ReaderSettings = JSON.parse(item);
    return settings;
  }
  return undefined;
}

export default function useUpdateLocalStorage(
  webpubManifestUrl: string | undefined,
  state: HtmlState
): void {
  /**
   * Keep location up to date as the state changes
   */
  React.useEffect(() => {
    if (!webpubManifestUrl) return;
    const locationKey = lsLocationKey(webpubManifestUrl);
    if (state.location) {
      const record: LSLocationRecord = {
        createdAt: Date.now(),
        location: state.location,
      };
      const val = JSON.stringify(record);
      localStorage.setItem(locationKey, val);
    }
  }, [state.location, webpubManifestUrl]);

  /**
   * Keep settings up to date
   */
  React.useEffect(() => {
    if (!webpubManifestUrl || !state.settings) return;
    const settings: ReaderSettings = {
      fontSize: state.settings.fontSize,
      fontFamily: state.settings.fontFamily,
      colorMode: state.settings.colorMode,
      isScrolling: state.settings.isScrolling,
    };
    const val = JSON.stringify(settings);
    localStorage.setItem(LOCAL_STORAGE_SETTINGS_KEY, val);
  }, [state.settings, webpubManifestUrl]);
}
