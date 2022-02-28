import { ReaderSettings } from '../types';
import {
  calcPosition,
  familyToReadiumFamily,
  getColorModeValue,
  getFontOverride,
  getIframeHTML,
  getPagination,
  setCSSProperty,
} from './lib';

/**
 * These are effects that reach in to the iframe element and modify it.
 * They are not part of the reducer, and should only be called from within a
 * useEffect hook.
 */

/**
 * Scroll the HTML element to a given progression by
 * setting the scrollTop or the scrollLeft.
 */
export function navigateToProgression(
  iframe: HTMLIFrameElement,
  progression: number,
  isScrolling: boolean
): void {
  /**
   * Check for progression info. This is used
   *  - in paginated mode for changing pages
   *  - navigating backward
   *  - switching between scrolling and paginated mode (to keep location)
   */
  const { isHorizontalPaginated, resourceSize, totalPages } = calcPosition(
    iframe,
    isScrolling
  );
  const html = getIframeHTML(iframe);

  if (isHorizontalPaginated) {
    /**
     * snap that progression to the nearest page
     */
    const nearestPage = Math.round(progression * totalPages);
    const calculatedProgression = nearestPage / totalPages;
    const newScrollPosition = calculatedProgression * resourceSize;
    html.scrollLeft = newScrollPosition;
  } else {
    const newScrollPosition = progression * resourceSize;
    html.scrollTop = newScrollPosition;
  }
}

export function navigateToHash(
  fragment: string,
  iframe: HTMLIFrameElement,
  isScrolling: boolean
): void {
  const isHash = fragment.indexOf('#') === 0;
  if (isHash) {
    // we get the element by the hash, and scroll it into view
    const el = iframe.contentDocument?.querySelector(fragment);
    if (el) {
      el.scrollIntoView();
      // the element is now in view, but likely off center. We now
      // need to call navigateToProgression to re-align ourselves
      const { progression } = calcPosition(iframe, isScrolling);
      navigateToProgression(iframe, progression, isScrolling);
    } else {
      console.error('Could not find an element with id', fragment);
    }
  }
}

/**
 * Takes the HTML element and sets CSS variables on it based on the
 * reader's state
 */
export function setCss(html: HTMLElement, settings: ReaderSettings): void {
  setCSSProperty(html, '--USER__scroll', getPagination(settings.isScrolling));
  setCSSProperty(
    html,
    '--USER__appearance',
    getColorModeValue(settings.colorMode)
  );
  setCSSProperty(html, '--USER__advancedSettings', 'readium-advanced-on');
  setCSSProperty(
    html,
    '--USER__fontOverride',
    getFontOverride(settings.fontFamily)
  );
  setCSSProperty(
    html,
    '--USER__fontFamily',
    familyToReadiumFamily[settings.fontFamily]
  );
  setCSSProperty(html, '--USER__fontSize', `${settings.fontSize}%`);
  setCSSProperty(html, 'overflow', settings.isScrolling ? 'scroll' : 'hidden');
  // set the number of columns to only ever have 1.
  setCSSProperty(html, '--USER__colCount', '1');
}
