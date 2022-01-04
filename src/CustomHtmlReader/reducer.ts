import { ColorMode, FontFamily, ReaderArguments } from '../types';
import { ReadiumLink } from '../WebpubManifestTypes/ReadiumLink';
import {
  HtmlState,
  getCurrentIndex,
  linkToLocator,
  calcPosition,
  getFromReadingOrder,
  isSameResource,
} from './lib';

export type HtmlAction =
  | { type: 'MANIFEST_LOADED' }
  | { type: 'IFRAME_LOADED' }
  | { type: 'NAV_PREVIOUS_RESOURCE' }
  | { type: 'NAV_NEXT_RESOURCE' }
  | { type: 'GO_TO_LINK'; link: ReadiumLink }
  | { type: 'GO_FORWARD' }
  | { type: 'GO_BACKWARD' }
  // indicates completion of an inter-resource nav after iframe loads
  | { type: 'NAV_COMPLETE' }
  | { type: 'SET_COLOR_MODE'; mode: ColorMode }
  | { type: 'SET_SCROLL'; isScrolling: boolean }
  | { type: 'SET_FONT_SIZE'; size: number }
  | { type: 'SET_FONT_FAMILY'; family: FontFamily }
  | { type: 'USER_SCROLLED' }
  | { type: 'SET_IFRAME'; iframe: HTMLIFrameElement | null }
  | { type: 'RESOURCE_CHANGED' };

/**
 * A higher order function that makes it easy to access arguments in the reducer
 * without passing them in to every `dispatch` call.
 */
export default function makeHtmlReducer(
  args: ReaderArguments
): (state: HtmlState, action: HtmlAction) => HtmlState {
  /**
   * If there are no args, it's an inactive hook, just use a function that returns the state.
   * This way you don't have to keep checking if args is defined.
   */
  if (!args) return (state: HtmlState, _action: HtmlAction) => state;

  const { manifest, webpubManifestUrl } = args;

  // our actual reducer
  return function reducer(state: HtmlState, action: HtmlAction): HtmlState {
    function goToNextResource() {
      const currentIndex = getCurrentIndex(manifest, state, webpubManifestUrl);
      const nextIndex = currentIndex + 1;
      // if we are at the end, do nothing
      if (nextIndex >= manifest.readingOrder.length) return state;
      const nextResource = manifest.readingOrder[nextIndex];
      const locator = linkToLocator(nextResource, webpubManifestUrl);
      return {
        ...state,
        location: locator,
        isNavigated: false,
        isIframeLoaded: false,
      };
    }

    function goToPrevResource() {
      const currentIndex = getCurrentIndex(manifest, state, webpubManifestUrl);
      const prevIndex = currentIndex - 1;
      // if we are at the beginning, do nothing
      if (currentIndex === 0) {
        console.warn('At the beginning');
        return state;
      }
      const prevResource = manifest.readingOrder[prevIndex];
      // send them to the end of the next resource
      const locator = linkToLocator(prevResource, webpubManifestUrl, {
        progression: 1,
      });
      return {
        ...state,
        location: locator,
        // we need to re-perform inter-resource nav
        isNavigated: false,
        isIframeLoaded: false,
      };
    }

    switch (action.type) {
      case 'MANIFEST_LOADED': {
        /**
         * Start at the beginning of first resource.
         * @todo - use the value from URL query param if any
         */
        const locator = linkToLocator(
          manifest.readingOrder[2],
          webpubManifestUrl,
          { progression: 0, position: 1 }
        );

        return {
          ...state,
          location: locator,
        };
      }

      case 'IFRAME_LOADED': {
        if (!state.iframe) return state;
        const { currentPage, totalPages } = calcPosition(
          state.iframe,
          state.isScrolling
        );

        return {
          ...state,
          isIframeLoaded: true,
          location: {
            ...state.location,
            locations: {
              ...state.location.locations,
              position: currentPage,
              remainingPositions: totalPages - currentPage,
            },
          },
        };
      }

      case 'NAV_NEXT_RESOURCE': {
        return goToNextResource();
      }

      case 'NAV_PREVIOUS_RESOURCE': {
        return goToPrevResource();
      }

      case 'GO_TO_LINK': {
        const isInReadingOrder = !!getFromReadingOrder(
          action.link.href,
          manifest,
          webpubManifestUrl
        );
        if (!isInReadingOrder) {
          console.error(
            `Cannot navigate to a link not in the reading order`,
            action.link
          );
          return state;
        }

        // tells us whether we are staying on the same resource or going
        // to load a new one
        const isIframeLoaded = isSameResource(
          action.link.href,
          state.location.href,
          webpubManifestUrl
        );

        const locator = linkToLocator(action.link, webpubManifestUrl);
        return {
          ...state,
          location: locator,
          isNavigated: false,
          isIframeLoaded,
        };
      }

      case 'GO_FORWARD': {
        /**
         * We are going to scroll the user forward by one page unit,
         * unless we are at the end of the resource, in which case we
         * need to go to the next resource
         */

        // if the iframe isn't loaded and present, we can't do anything yet
        if (!state.isIframeLoaded || !state.iframe) {
          console.warn("Can't go forward before iframe is loaded");
          return state;
        }

        const { progression, totalPages, currentPage } = calcPosition(
          state.iframe,
          state.isScrolling
        );

        // if we are at the last page, go to next resource
        if (currentPage === totalPages) {
          return goToNextResource();
        }

        /**
         * Set the progression so that we scroll the user by
         * one page, but also set the 'position' value
         */
        const percentToScroll = 1 / totalPages;
        const newProgression = progression + percentToScroll;
        const newPosition = currentPage + 1;

        return {
          ...state,
          location: {
            ...state.location,
            locations: {
              progression: newProgression,
              position: newPosition,
              remainingPositions: totalPages - newPosition,
            },
          },
          isNavigated: false,
        };
      }

      case 'GO_BACKWARD': {
        // if the iframe isn't loaded and present, we can't do anything yet
        if (!state.isIframeLoaded || !state.iframe) {
          console.warn("Can't go forward before iframe is loaded");
          return state;
        }
        const { progression, totalPages, currentPage } = calcPosition(
          state.iframe,
          state.isScrolling
        );

        // if we are at the last page, go to next resource
        if (currentPage === 1) {
          return goToPrevResource();
        }

        /**
         * Set the progression so that we scroll the user back
         * one page, but also set the 'position' value
         */
        const percentToScroll = 1 / totalPages;
        const newProgression = Math.max(progression - percentToScroll, 0);
        const newPosition = Math.max(currentPage - 1, 1);

        return {
          ...state,
          location: {
            ...state.location,
            locations: {
              progression: newProgression,
              position: newPosition,
              remainingPositions: totalPages - newPosition,
            },
          },
          isNavigated: false,
        };
      }

      case 'NAV_COMPLETE': {
        return {
          ...state,
          isNavigated: true,
        };
      }

      case 'SET_COLOR_MODE':
        return {
          ...state,
          colorMode: action.mode,
        };

      case 'SET_SCROLL': {
        /**
         * - set scroll state
         * - trigger a navigation effect
         * - remove the progression value and only set a position
         *   value so the user snaps to whichever page they were just
         *   reading.
         */
        if (!state.iframe) return state;
        const { currentPageFloor, totalPages } = calcPosition(
          state.iframe,
          state.isScrolling
        );

        return {
          ...state,
          isScrolling: action.isScrolling,
          isNavigated: false,
          location: {
            ...state.location,
            locations: {
              position: currentPageFloor,
              remainingPositions: totalPages - currentPageFloor,
            },
          },
        };
      }

      case 'SET_FONT_SIZE':
        return {
          ...state,
          fontSize: action.size,
        };

      case 'SET_FONT_FAMILY':
        return {
          ...state,
          fontFamily: action.family,
        };

      case 'SET_IFRAME':
        return {
          ...state,
          iframe: action.iframe,
        };

      case 'USER_SCROLLED': {
        if (!state.iframe || !state.isScrolling) return state;
        // update the progression, but don't trigger a navigation effect
        // update the y value
        const { progression, currentPage, totalPages } = calcPosition(
          state.iframe,
          state.isScrolling
        );
        return {
          ...state,
          // don't trigger a navigation effect because the user freely scrolled here
          isNavigated: true,
          location: {
            ...state.location,
            locations: {
              progression,
              position: currentPage,
              remainingPositions: totalPages - currentPage,
            },
          },
        };
      }

      case 'RESOURCE_CHANGED':
        return {
          ...state,
          isIframeLoaded: false,
        };
    }
  };
}
