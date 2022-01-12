import {
  calcPosition,
  familyToReadiumFamily,
  getColorModeValue,
  getFontOverride,
  getIframeHTML,
  getPagination,
  setCSSProperty,
} from './lib';
import { CSSState } from './types';

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
  iframe: HTMLIFrameElement
): void {
  const isHash = fragment.indexOf('#') === 0;
  if (isHash) {
    // we get the element by the hash, and scroll it into view
    const el = iframe.contentDocument?.querySelector(fragment);
    if (el) {
      el.scrollIntoView();
    } else {
      console.error('Could not find an element with id', fragment);
    }
  }
}

/**
 * Takes the HTML element and sets CSS variables on it based on the
 * reader's state
 */
export function setCss(html: HTMLElement, state: CSSState): void {
  setCSSProperty(html, '--USER__scroll', getPagination(state.isScrolling));
  setCSSProperty(
    html,
    '--USER__appearance',
    getColorModeValue(state.colorMode)
  );
  setCSSProperty(html, '--USER__advancedSettings', 'readium-advanced-on');
  setCSSProperty(
    html,
    '--USER__fontOverride',
    getFontOverride(state.fontFamily)
  );
  setCSSProperty(
    html,
    '--USER__fontFamily',
    familyToReadiumFamily[state.fontFamily]
  );
  setCSSProperty(html, '--USER__fontSize', `${state.fontSize}%`);
  setCSSProperty(html, 'overflow', state.isScrolling ? 'scroll' : 'hidden');
  // set the number of columns to only ever have 1.
  setCSSProperty(html, '--USER__colCount', '1');
}
