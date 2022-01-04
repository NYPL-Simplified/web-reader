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
  const { isHorizontalPaginated, resourceSize } = calcPosition(
    iframe,
    isScrolling
  );
  const html = getIframeHTML(iframe);

  const newScrollPosition = progression * resourceSize;

  /**
   * @todo - snap that progression to the nearest page if we are paginated
   */

  if (isHorizontalPaginated) {
    html.scrollLeft = newScrollPosition;
  } else {
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
}
